/**
 * Created by yjy on 2017/11/15.
 */

// @flow

import {createReducer, createActions} from 'reduxsauce'
import Immutable from 'seamless-immutable'
import http from '../libs/fetch'
import {setStore ,getStore, clearStore} from '../libs/Storage'
import WebIM  from '../libs/WebIM'
import  UserInfoActionType from '../redux/UserInfo';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
    loginRequest: ['username', 'password'],
    loginSuccess: ['usertoken'],
    loginFailure: ['loginError'],
    registerRequest: ['username', 'password'],
    registerSuccess: ['json'],
    registerFailure: ['registerError'],
    logout: null,

    // ------------- async -----------------
    register: (username, password) => {
        return (dispatch, getState) => {
            let options = {
                username: username,
                password: password,
                nickname: username
            }
            // console.log(options)
            dispatch(Creators.registerRequest(username, password))
        }
    },
    login: (username, password,fn) => {
        return (dispatch, getState) => {
            dispatch(Creators.loginRequest(username, password));
            return http('authen/login',{
                body:{
                    key:username,
                    password:password
                },
                method:'post'
            },true).then((data)=> {
                dispatch(Creators.loginSuccess(data));
                console.log(data);
                setStore("AccessToken",data.token);
                setStore("AccessUserId",data.userid);
                if (WebIM.conn.isOpened()) {
                    WebIM.conn.close('logout')
                };
                WebIM.conn.open({
                    apiUrl: WebIM.config.apiURL,
                    user: data.userid,
                    pwd: data.userid,
                    //  accessToken: password,
                    appKey: WebIM.config.appkey
                });
                fn();
            }).catch(e =>{
                dispatch(Creators.loginFailure(e))
            })
            // dispatch(Creators.loginSuccess(username, password));
            // fn();
        }
    }
});

export const LoginTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    username: null,
    loginError: null,
    fetching: false,
    registerError: null
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const loginRequest = (state, {username, password}) => {
    return state.merge({username, password, fetching: true, loginError: false})
}

// we've successfully logged in
export const loginSuccess = (state, {usertoken}) => {
    return state.merge({fetching: false, loginError: false, usertoken})
}

// we've had a problem logging in
export const loginFailure = (state, {error}) => {
    return state.merge({fetching: false, loginError: error})
}

export const registerRequest = (state = INITIAL_STATE, {username, password}) => {
    return state.merge({username, password, fetching: true})
}

export const registerSuccess = (state = INITIAL_STATE, {json}) => {
    return state.merge({fetching: false, json, registerError: null})
}

export const registerFailure = (state = INITIAL_STATE, {registerError}) => {
    return state.merge({fetching: false, registerError})
}

// we've logged out
export const logout = (state) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.LOGIN_REQUEST]: loginRequest,
    [Types.LOGIN_SUCCESS]: loginSuccess,
    [Types.LOGIN_FAILURE]: loginFailure,
    [Types.REGISTER_REQUEST]: registerRequest,
    [Types.REGISTER_SUCCESS]: registerSuccess,
    [Types.REGISTER_FAILURE]: registerFailure,
    [Types.LOGOUT]: logout
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
export const isLoggedIn = (loginState) => loginState.username !== null
