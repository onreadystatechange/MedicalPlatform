/**
 * Created by yjy on 2018/1/24.
 */
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
    getMemberrequest: [],
    getMembersuccess: ['data'],
    getMemberfailure: ['error'],
    // ------------- async -----------------
    getMemberList: (disscussId) => {
        return (dispatch, getState) => {
            // console.log(options)
            dispatch(Creators.getMemberrequest());
            dispatch(CommonTypes.fetching());

            return http(`dus/findPersons/${disscussId}`,{method:'get'}).then(data =>  {
                console.log(data);
                dispatch(CommonTypes.fetched());
                dispatch(Creators.getMembersuccess(data)
                )}).catch(
                e=> {
                    dispatch(CommonTypes.fetched());
                    dispatch(Creators.getMemberfailure(e));
                }
            )
        }
    }

})

export const GetMemberType= Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    error:false,
    disscussPO:{},
    disscdisscussDoctorPOListussPO:[]

});

/* ------------- Reducers ------------- */

// we're attempting to login
export const getMemberrequest = (state) => {
    return state.merge({error: false})
}

// we've successfully logged in
export const getMembersuccess = (state, {data}) => {
    return state.merge({ error: false, ...data})
}

// we've had a problem logging in
export const getMemberfailure = (state, {error}) => {
    return state.merge({ error: error})
}
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_MEMBERREQUEST]: getMemberrequest,
    [Types.GET_MEMBERSUCCESS]: getMembersuccess,
    [Types.GET_MEMBERFAILURE]: getMemberfailure,
})

/* ------------- Selectors ------------- */
