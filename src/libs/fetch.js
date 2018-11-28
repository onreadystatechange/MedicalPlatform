/**
 * Created by yjy on 2017/3/23.
 */
import { Modal } from 'antd-mobile'
import { AsyncStorage ,BackAndroid,ToastAndroid,View,StatusBar} from 'react-native';
import CountEmitter from './CountEmitter';
import { Toast } from 'antd-mobile';
import { setStore ,getStore, clearStore} from './Storage'
import {apiUrl} from '../configs/BaseConfig'

export default async (url, data = {},joint = false,method = 'GET') => {
    let token = await getStore('AccessToken');
    url = apiUrl + url;
    !data.method && (data.method = 'GET');
    if (typeof data.body === 'object') {
        if (data.method === method ||  !!joint) {
            var tmp = [];
            for (var pro in data.body) {
                (!!data.body[pro]) && tmp.push(pro + '=' + data.body[pro]);
            }
            url += url.indexOf('?') > -1 ? '&' : '?';
            url += tmp.join('&');
        }
        data.body = JSON.stringify(data.body)
    }


    if ((!data.method || data.method.toUpperCase() === 'GET') && data.body) {
        delete data.body;
    }
    console.log(url,data);
    return new Promise((resolve, reject) => {
        fetch(url, {
            credentials: 'include', //enable cookie
            method: data.method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'XSS-protext-Authorization':token,
            },
            body: data.body
        }).then(res => {
            console.log(res);
            if (res.headers.get("content-type") &&
                res.headers.get("content-type").toLowerCase().indexOf("application/json") >= 0) {
                return res.json();
            } else {
                return res.json();
            }
        }).then(json => {
            let {data, reason, retCode, status} = json;
            if((json.status === 504) || (json.status === 500)) {
                reject(data);
            } else if(retCode === '000000' &&  reason === '成功') {
                resolve(data || {});
            } else if(status === 403 || status === 401) {
                ToastAndroid.show('登陆失效',ToastAndroid.SHORT);
                CountEmitter.emit('loginout');
                reject(data);
            } else {
                ToastAndroid.show(reason || '!',ToastAndroid.SHORT);
                reject(data);
            }
        }).catch(e => {
            Toast.offline('网络连接失败!!!');
            console.error(e);
            reject(e);
        })
    })
};