/**
 * Created by yjy on 2017/12/16.
 */
/**
 * Created by yjy on 2017/12/8.
 */
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
    getPfriendrequest: [],
    getPfriendsuccess: ['data'],
    getPfriendfailure: ['error'],
    getDfriendrequest: [],
    getDfriendsuccess: ['data'],
    getDfriendfailure: ['error'],
    // ------------- async -----------------
    getPfriendList: (id) => {
        return (dispatch, getState) => {
            // console.log(options)
            dispatch(Creators.getPfriendrequest());
            dispatch(CommonTypes.fetching())
            return http(`friend/patients`,{method:'get'}).then(data =>  {
                console.log(data);
                dispatch(CommonTypes.fetched())
                dispatch(Creators.getPfriendsuccess(data)
                )}).catch(
                e=> {
                    dispatch(CommonTypes.fetched())
                    dispatch(Creators.getPfriendfailure(e));
                }
            )
        }
    },
    getDfriendList:() =>{
        return (dispatch, getState) => {
            // console.log(options)
            dispatch(Creators.getDfriendrequest());
            dispatch(CommonTypes.fetching())
            return http(`friend/doctors`,{method:'get'}).then(data =>  {
                console.log(data);
                dispatch(CommonTypes.fetched())
                dispatch(Creators.getDfriendsuccess(data)
                )}).catch(
                e=> {
                    dispatch(CommonTypes.fetched())
                    dispatch(Creators.getDfriendfailure(e));
                }
            )
        }
    }

})

export const GetFriendListType = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    error:false,
    doctor:{
        group:[],
        groupInfo:{}
    },
    patient:{
        group:[],
        groupInfo:{}
    }
});

/* ------------- Reducers ------------- */

// we're attempting to login
export const getPfriendrequest = (state) => {
    return state.merge({error: false})
}

// we've successfully logged in
export const getPfriendsuccess = (state, {data}) => {
    return state.merge({ error: false, patient:{...data}})
}

// we've had a problem logging in
export const getPfriendfailure = (state, {error}) => {
    return state.merge({ error: error})
}


export const getDfriendrequest = (state) => {
    return state.merge({error: false})
}

// we've successfully logged in
export const getDfriendsuccess = (state, {data}) => {
    return state.merge({ error: false, doctor:{...data}})
}

// we've had a problem logging in
export const getDfriendfailure = (state, {error}) => {
    return state.merge({ error: error})
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_PFRIENDREQUEST]: getPfriendrequest,
    [Types.GET_PFRIENDSUCCESS]: getPfriendsuccess,
    [Types.GET_PFRIENDFAILURE]: getPfriendfailure,
    [Types.GET_DFRIENDREQUEST]: getDfriendrequest,
    [Types.GET_DFRIENDSUCCESS]: getDfriendsuccess,
    [Types.GET_DFRIENDFAILURE]: getDfriendfailure,
})

/* ------------- Selectors ------------- */
