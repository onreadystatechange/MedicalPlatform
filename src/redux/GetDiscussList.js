/**
 * Created by yjy on 2018/1/3.
 */
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
    getDiscussrequest: [],
    getDiscusssuccess: ['data'],
    getDiscussfailure: ['error'],
    // ------------- async -----------------
    getDiscussList: (id) => {
        return (dispatch, getState) => {
            // console.log(options)
            dispatch(Creators.getDiscussrequest());
            dispatch(CommonTypes.fetching());
            return http(`dus/findDiss/${id}`,{method:'get'}).then(data =>  {
                console.log(data);
                dispatch(CommonTypes.fetched());
                dispatch(Creators.getDiscusssuccess(data)
                )}).catch(
                e=> {
                    dispatch(CommonTypes.fetched());
                    dispatch(Creators.getDiscussfailure(e));
                }
            )
        }
    }

})

export const GetDiscussType= Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    error:false,
    list:{
        myJoin:[],
        myOwner:[]
    }
});

/* ------------- Reducers ------------- */

// we're attempting to login
export const getDiscussrequest = (state) => {
    return state.merge({error: false})
}

// we've successfully logged in
export const getDiscusssuccess = (state, {data}) => {
    return state.merge({ error: false, list:{...data}})
}

// we've had a problem logging in
export const getDiscussfailure = (state, {error}) => {
    return state.merge({ error: error})
}
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_DISCUSSREQUEST]: getDiscussrequest,
    [Types.GET_DISCUSSSUCCESS]: getDiscusssuccess,
    [Types.GET_DISCUSSFAILURE]: getDiscussfailure,
})

/* ------------- Selectors ------------- */
