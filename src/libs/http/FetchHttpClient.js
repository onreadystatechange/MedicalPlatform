/*
 * Copyright (c) 2014-2016. JarkimZhu
 * This software can not be used privately without permission
 */

'use strict';

/**
 * @author JarkimZhu
 * Created on 2016-06-04.
 * @version 0.1.0
 * @class
 */
import Glog from '../Glog'
export default class FetchHttpClient {
    constructor(forceSetCookie) {
        this._cookie = null;
        this._forceSetCookie = forceSetCookie;
        this._rewriteUri = false;
    }

    get(url, isScriptGet, enableCache) {
        if (!isScriptGet) {
            return new Promise((resolve, reject) => {
                fetch(url, {credentials: "include"})
                    .then((response) => {
                        this._processResponse(response);
                        resolve(response);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        } else {
            return this._scriptGet(url, enableCache);
        }
    }

    post(url, request) {
        let body = request.body;
        let headers = request.headers;
        if (body && !headers["Content-Type"]) {
            if (typeof body === "object") {
                headers["Content-Type"] = "application/json;charset=UTF-8";
                body = JSON.stringify(body);
            } else if (typeof body === "string") {
                headers["Content-Type"] = "text/plain;charset=UTF-8";
            }
        }

        url = this._setCookie(url, request);


        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                headers: request.headers,
                body: body,
                credentials: "include"
            }).then((response) => {
                this._processResponse(response);
                resolve(response);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    upload(url, request) {
        let body = request.body;
        let headers = request.headers;

        let formData;
        if (body instanceof FormData) {
            formData = request;
        } else {
            formData = new FormData();
            for (let key in body) {
                if (body.hasOwnProperty(key)) {
                    formData.append(key, request[key]);
                }
            }
        }

        url = this._setCookie(url, request);

        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                headers: request.headers,
                body: formData,
                credentials: "include"
            }).then((response) => {
                this._processResponse(response);
                resolve(response);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    clearCookie() {
        this._cookie = null;
        this._rewriteUri = false;
    }

    _setCookie(url, request) {
        if (this._cookie && !this._rewriteUri) {
            request.headers["Cookie"] = this._cookie;
        } else if (this._cookie && this._rewriteUri) {
            let index = url.indexOf("?");
            if (index > -1) {
                let prefix = url.substring(0, index);
                let suffix = url.substring(index);
                url = prefix + ";" + this._cookie + suffix;
            } else {
                url = url + ";" + this._cookie;
            }
        }
        return url;
    }

    _processResponse(response) {
        if (response.ok) {
            if (this._forceSetCookie) {
                var cookie = response.headers.get("Set-Cookie");
                if (cookie) {
                    cookie = cookie.substring(0, cookie.indexOf(";"));
                    this._cookie = cookie;
                } else {
                    cookie = response.headers.get("Cx-Session-Id");
                    if (cookie) {
                        this._cookie = cookie;
                        this._rewriteUri = true;
                    }
                }
            }
        } else {
            Glog("Server response status: " + response.status);
        }
    }

    _scriptGet(url, enableCache) {
        var d = document, s = document.createElement('script');

        return new Promise(function (resolve, reject) {
            let _onError = function() {
                s.parentNode.removeChild(s);
                reject("Load " + url + " failed!");
            };
            let _onLoad = function() {
                s.parentNode.removeChild(s);
                this.removeEventListener('load', _onLoad, false);
                this.removeEventListener('error', _onError, false);
                resolve();
            };
            s.addEventListener('load', _onLoad, false);

            s.addEventListener('error', _onError, false);

            if (enableCache) {
                s.src = url + "&_t=" + new Date().getTime();
            } else {
                s.src = url;
            }

            d.body.appendChild(s);
        });
    }
}