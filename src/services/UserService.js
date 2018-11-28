/**
 * Created by yjy on 2017/12/5.
 */
import {
    Platform,ToastAndroid
} from 'react-native'
import { setStore ,getStore, clearStore} from '../libs/Storage'
import  {apiUrl} from '../configs/BaseConfig'
const os = Platform.OS;

import {uploadAvatar,baseImgUrl} from '../configs/BaseConfig'
import Utils from '../utils/Utils'
export  function uploadImage(image, next) {
    console.log(uploadAvatar, image, next);
    return uploadFile(uploadAvatar, image, next)
}

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        return response.json().then(json => Promise.reject(convertJson(json)));
    }
}


function convertJson(response) {
    return (response && response.statusCode && response.statusCodeValue && response.body) ? response.body : response
}


async function uploadFile(url,image,next) {
    let Access_Token = await getStore('AccessToken');
    let path = image.uri;
    let filename = path.substring(path.lastIndexOf('/') + 1, path.length);
    let formData = new FormData();
    let file = {uri: image.uri, type: 'multipart/form-data', name: filename};
    formData.append('file', file);
    formData.append('dir', 'user/images/logo');
    fetch(url, {method: 'POST',headers: {
        'XSS-protext-Authorization':Access_Token,
    }, body:
    formData,
    })
        .then((res) => res.json())
        .then((json) => {
            if (!Utils.isEmpty(json)) {
                if (json.retCode === '000000') {
                    next && next(json.data.photoid);
                } else {
                    console.warn(JSON.stringify(json));
                    ToastAndroid.show('' + json.msg,ToastAndroid.SHORT);
                }
            }
        }).catch((e) => {
        ToastAndroid.show('' + e.toString(),ToastAndroid.SHORT);
    })

}