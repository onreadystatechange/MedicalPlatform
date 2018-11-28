/*
 * Copyright (c) 2014-2016. JarkimZhu
 * This software can not be used privately without permission
 */

'use strict';

import httpClient from "../lib/network/HttpClient";
import Constants, {SERVER, ProtocolResult} from "../Constants";
import Emitter, {Events} from "../model/Emitter";
import Glog from '../lib/Glog'
/**
 * @author JarkimZhu
 * Created on 2016-06-02.
 * @version 0.1.0
 * @class
 */
class HttpUtils {
    token = null;
    _domainUrl;
    _fileUrl;

    constructor() {
        this._domainUrl = SERVER.domain;
        this._fileUrl = SERVER.file;
    }

    post(url, body) {
        url = this._domainUrl + url;
        let request = {
            headers: {
                "Accept": "application/json",
                "token": this.token ? this.token : "unknown"
            },
            body: body
        };
        Glog("request[" + url + "]\n" + JSON.stringify(body));
        return new Promise(async (resolve, reject) => {
            try {
                let response = await httpClient.post(url, request);
                let json = await response.json();

                this._processJson(url, json, resolve, reject);
            } catch (e) {
                Glog("Network error: " + JSON.stringify(e));
                Emitter.to(Events.NETWORK_ERROR);
            }
        });
    }

    post4Company(url, body) {
        url = SERVER.companyDomain + url;
        let request = {
            headers: {
                "Accept": "application/json",
                "token": this.token ? this.token : "unknown"
            },
            body: body
        };
        Glog("request[" + url + "]\n" + JSON.stringify(body));
        return new Promise(async (resolve, reject) => {
            try {
                let response = await httpClient.post(url, request);
                let json = await response.json();

                this._processJson(url, json, resolve, reject);
            } catch (e) {
                Glog("Network error: " + JSON.stringify(e));
                Emitter.to(Events.NETWORK_ERROR);
            }
        });
    }

    get(url) {
        url = this._domainUrl + url;
        let request = {
            headers: {
                "Accept": "application/json",
                "token": this.token ? this.token : "unknown"
            }
        };

        Glog("request[" + url + "]");
        return new Promise(async (resolve, reject) => {
            try {
                let response = await httpClient.get(url, request);
                let json = await response.json();

                this._processJson(url, json, resolve, reject);
            } catch (e) {
                Glog("Network error: " + JSON.stringify(e));
                Emitter.to(Events.NETWORK_ERROR);
            }
        });
    }

    get4Company(url) {
        url = SERVER.companyDomain + url;
        let request = {
            headers: {
                "Accept": "application/json",
                "token": this.token ? this.token : "unknown"
            }
        };
        Glog("request[" + url + "]");
        return new Promise(async (resolve, reject) => {
            try {
                let response = await httpClient.get(url, request);
                let json = await response.json();

                this._processJson(url, json, resolve, reject);
            } catch (e) {
                Glog("Network error: " + JSON.stringify(e));
                Emitter.to(Events.NETWORK_ERROR);
            }
        });
    }

    /**
     * 上传文件
     * @param url 上传文件的服务器地址
     * @param body 上传文件的描述信息
     * @param pcb 进度回调函数
     */
    upload(url, body, pcb) {
        url = this._fileUrl + url;
        let request = {
            headers: {
                "Accept": "application/json",
                "token": this.token ? this.token : "unknown"
            },
            body: body
        };
        Glog("request[" + url + "]\n" + JSON.stringify(body));
        return new Promise((resolve, reject) => {
            try {
                httpClient.upload(url, request, async (err, response) => {
                    if(!err) {
                        let json = await response.json();
                        this._processJson(url, json, resolve, reject);
                    } else {
                        Glog("Network error: " + JSON.stringify(err));
                        Emitter.to(Events.NETWORK_ERROR);
                    }
                }, pcb);
            } catch (e) {
                Glog("Network error: " + JSON.stringify(e));
                Emitter.to(Events.NETWORK_ERROR);
            }
        });
    }

    _processJson(url, json, resolve, reject) {
        Glog("response[" + url + "]\n" + JSON.stringify(json));
        if (json.result === ProtocolResult.SUCCESS) {
            resolve(json);
        } else if (json.result === ProtocolResult.INVALID_TOKEN
            || json.result === ProtocolResult.INVALID_SESSION) {
            Emitter.to(Events.INVALID_TOKEN);
        } else if(json.result === ProtocolResult.SERVER_ERROR) {
            Emitter.to(Events.SERVER_UNKNOWN_ERROR);
        } else if(json.result === ProtocolResult.ACCOUNT_FORBIDDEN) {
            Emitter.to(Events.ACCOUNT_FORBIDDEN);
        } else {
            reject(json.result);
        }
    }
}
const httpUtils = new HttpUtils(Constants.ENV);
export default httpUtils;