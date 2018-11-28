/**
 * Created by yjy on 2017/12/5.
 */
import Storage from 'react-native-storage'
import { AsyncStorage, Platform } from 'react-native'


const storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,

    storageBackend: Platform.OS === 'web' ? window.localStorage : AsyncStorage,
    // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    defaultExpires: null,

    // 读写时在内存中缓存数据。默认启用。
    enableCache: true,

    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync同步方法，无缝返回最新数据。

    sync: {

    },
})

export const setStore = async (key, data = '', expires = null) => {
    return storage.save({
        key,
        data,
        expires,
    })
}


export const getStore = (key) => {
    return new Promise((resolve) => {
        storage.load({ key }).then(e => resolve(e)).catch((e) => {
            resolve('')
        })
    })
}

export const clearStore = (key) => {
    return storage.remove({ key })
}



// import { setStore ,getStore, clearStore} from './storage'
//
// // 存储
// setStore(key,value).then(()=>{
//
// // do something
// })
// // 获取
// getStore(key).then(()=>{
// // do something
// })
// // 删除
// clearStore(key).then(()=>{
// // do something
// })