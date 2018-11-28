/**
 * Created by yjy on 2017/11/15.
 */
// @flow

import {combineReducers} from 'redux'
import configureStore from './CreateStore'
import  navReducer from "./navReducer";
export default () => {
    /* ------------- Assemble The Reducers ------------- */
    let rootReducer = combineReducers({
        entities: combineReducers({
            message: require('./MessageRedux').reducer
        }),
        ui: combineReducers({
            login: require('./LoginRedux').reducer,
            common: require('./CommonRedux').reducer
        }),
        nav:navReducer,
        userAvatar:require('./UploadAvatar').reducer,
        user:require('./UserInfo').reducer,
        patientList:require('./GetPatientList').reducer,
        friendList:require('./GetFriendList').reducer,
        patientCaseList:require('./GetPatientCaseList').reducer,
        discuss:require('./GetDiscussList').reducer,
        member:require('./GetMemberList').reducer,
        patientCaseDetail:require('./GetPatientCaseDetail').reducer
});

    // 登出清空state
    const appReducer = (state, action) => {
        if (action.type === 'LOGOUT') {
            state = {}
        }

        return rootReducer(state, action)
    };

    const store = configureStore(appReducer);

    // Provider does not support changing `store` on the fly
    // TODO  https://github.com/reactjs/react-redux/releases/tag/v2.0.0 by lwz

    // if (module && module.hot) {
    //   // Enable Webpack hot module replacement for reducers
    //   module.hot.accept(() => {
    //     // const nextRootReducer = require('../reducers/index');
    //     store.replaceReducer(rootReducer)
    //   });
    // }

    return store
}
