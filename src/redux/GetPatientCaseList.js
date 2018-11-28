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
    getPatientCaserequest: [],
    getPatientCasesuccess: ['data'],
    getPatientCasefailure: ['error'],
    // ------------- async -----------------
    getPatientCaseList: (doctorid,patientid) => {
        return (dispatch, getState) => {
            // console.log(options)
            dispatch(Creators.getPatientCaserequest());
            dispatch(CommonTypes.fetching())
            return http(`med/findMed/${doctorid}/${patientid}`,{method:'get'}).then(data =>  {
                console.log(data);
                dispatch(CommonTypes.fetched())
                dispatch(Creators.getPatientCasesuccess(data)
                )}).catch(
                e=> {
                    dispatch(CommonTypes.fetched())
                    dispatch(Creators.getPatientCasefailure(e));
                }
            )
        }
    }
})

export const GetPatientCaseListAction = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    error:false,
    PatientHistoryInfo:[]

});

/* ------------- Reducers ------------- */

// we're attempting to login
export const getPatientCaserequest = (state) => {
    return state.merge({error: false})
}

// we've successfully logged in
export const getPatientCasesuccess = (state, {data}) => {
    return state.merge({ error: false, ...data})
}

// we've had a problem logging in
export const getPatientCasefailure = (state, {error}) => {
    return state.merge({ error: error,
        PatientHistoryInfo:[]
    })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_PATIENT_CASEREQUEST]: getPatientCaserequest,
    [Types.GET_PATIENT_CASESUCCESS]: getPatientCasesuccess,
    [Types.GET_PATIENT_CASEFAILURE]: getPatientCasefailure,
})

/* ------------- Selectors ------------- */
