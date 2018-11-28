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
    getPatientrequest: [],
    getPatientsuccess: ['data'],
    getPatientfailure: ['error'],
    // ------------- async -----------------
    getPatientList: (id) => {
        return (dispatch, getState) => {
            // console.log(options)
            dispatch(Creators.getPatientrequest());
            dispatch(CommonTypes.fetching())
            return http(`gro/findByDid/${id}`,{method:'get'}).then(data =>  {
                console.log(data);
                dispatch(CommonTypes.fetched())
                dispatch(Creators.getPatientsuccess(data)
                )}).catch(
                e=> {
                    dispatch(CommonTypes.fetched())
                    dispatch(Creators.getPatientfailure(e));
                }
            )
        }
    }
})

export const GetPatientListAction = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    error:false,
});

/* ------------- Reducers ------------- */

// we're attempting to login
export const getPatientrequest = (state) => {
    return state.merge({error: false})
}

// we've successfully logged in
export const getPatientsuccess = (state, {data}) => {
    return state.merge({ error: false, ...data})
}

// we've had a problem logging in
export const getPatientfailure = (state, {error}) => {
    return state.merge({ error: error})
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_PATIENTREQUEST]: getPatientrequest,
    [Types.GET_PATIENTSUCCESS]: getPatientsuccess,
    [Types.GET_PATIENTFAILURE]: getPatientfailure,
})

/* ------------- Selectors ------------- */
