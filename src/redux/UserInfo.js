/**
 * Created by yjy on 2017/12/6.
 */
/**
 * Created by yjy on 2017/11/15.
 */

// @flow

import {createReducer, createActions} from 'reduxsauce'
import Immutable from 'seamless-immutable'
import {setStore ,getStore, clearStore} from '../libs/Storage'
import CommonTypes from './CommonRedux'
import http from '../libs/fetch'
import { AsyncStorage ,BackAndroid,ToastAndroid,View,StatusBar} from 'react-native';

import WebIM  from '../libs/WebIM'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
    getUserrequest: [],
    getUsersuccess: ['data'],
    getUserfailure: ['error'],
    updateUserrequest:[],
    updateUsersuccess:['data'],
    updateUserfailure:['error'],
    // ------------- async -----------------
    getUser: (id) => {
        return (dispatch, getState) => {
            // console.log(options)
            dispatch(Creators.getUserrequest());
            http(`doctor/${id}`,{method:'get'}).then(data =>  {
                    dispatch(Creators.getUsersuccess(data)
                )}).catch(
                    e=> {
                        dispatch(Creators.getUserfailure(e));
                    }
            )
        }
    },
    updateUser:(data,fn) =>{
        return(dispatch,getSate) =>{
            dispatch(Creators.updateUserrequest());
            return http('doctor/update',{method:'put',body:data}).then(data =>  {
                dispatch(Creators.updateUsersuccess(data));
                ToastAndroid.show('保存成功',ToastAndroid.SHORT);
                fn && fn()
            }).catch(
                e=> {
                    dispatch(Creators.updateUserfailure(e));
                }
            )
        }
    }
})

export const GetUserInfoType = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    error:false,
});

/* ------------- Reducers ------------- */

// we're attempting to login
export const getUserrequest = (state) => {
    return state.merge({ error: false})
}

// we've successfully logged in
export const getUsersuccess = (state, {data}) => {
    return state.merge({ error: false, ...data})
}

// we've had a problem logging in
export const getUserfailure = (state, {error}) => {
    return state.merge({ error: error})
}

export const updateUserrequest = (state) => {
    return state.merge({ error: false})
}

// we've successfully logged in
export const updateUsersuccess = (state, {data}) => {
    return state.merge({ error: false, ...data})
}

// we've had a problem logging in
export const updateUserfailure = (state, {error}) => {
    return state.merge({ error: error})
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_USERREQUEST]: getUserrequest,
    [Types.GET_USERSUCCESS]: getUsersuccess,
    [Types.GET_USERFAILURE]: getUserfailure,
    [Types.UPDATE_USERREQUEST]: updateUserrequest,
    [Types.UPDATE_USERSUCCESS]: updateUsersuccess,
    [Types.UPDATE_USERFAILURE]: updateUserfailure,
})

/* ------------- Selectors ------------- */
