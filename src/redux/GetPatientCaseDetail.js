/**
 * Created by yjy on 2018/1/27.
 */
/**
 * Created by yjy on 2017/12/28.
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
    getPatientCasedetailrequest: [],
    getPatientCasedetailsuccess: ['data'],
    getPatientCasedetailfailure: ['error'],
    // ------------- async -----------------
    getPatientCasedetail: (disscussId,doctorId,patiendId) => {
        return (dispatch, getState) => {
            // console.log(options)
            dispatch(Creators.getPatientCasedetailrequest());
            dispatch(CommonTypes.fetching())
            return http(`dus/findMed/${disscussId}/${doctorId}/${patiendId}`,{method:'get'}).then(data =>  {
                console.log(data);
                dispatch(CommonTypes.fetched())
                dispatch(Creators.getPatientCasedetailsuccess(data)
                )}).catch(
                e=> {
                    dispatch(CommonTypes.fetched())
                    dispatch(Creators.getPatientCasedetailfailure(e));
                }
            )
        }
    }
})

export const GetPatientCaseDetailAction = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    error:false,
    PatientHistoryInfo:[]

});

/* ------------- Reducers ------------- */

// we're attempting to login
export const getPatientCasedetailrequest = (state) => {
    return state.merge({error: false})
}

// we've successfully logged in
export const getPatientCasedetailsuccess = (state, {data}) => {
    return state.merge({ error: false, ...data})
}

// we've had a problem logging in
export const getPatientCasedetailfailure = (state, {error}) => {
    return state.merge({ error: error,
        PatientHistoryInfo:[]
    })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_PATIENT_CASEDETAILREQUEST]: getPatientCasedetailrequest,
    [Types.GET_PATIENT_CASEDETAILSUCCESS]: getPatientCasedetailsuccess,
    [Types.GET_PATIENT_CASEDETAILFAILURE]: getPatientCasedetailfailure,
})

/* ------------- Selectors ------------- */
