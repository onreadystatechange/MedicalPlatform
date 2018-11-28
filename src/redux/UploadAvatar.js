/**
 * Created by yjy on 2017/12/5.
 */
import {createReducer, createActions} from 'reduxsauce'
import Immutable from 'seamless-immutable'
import {uploadImage} from '../services/UserService'
import { AsyncStorage ,BackAndroid,ToastAndroid,View,StatusBar} from 'react-native';
/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
    getAvatar:['path'],
    uploadAvatar: (params, fileUrl, fileName)=>{
        return dispatch=> {
            return  new Promise((resolve, reject) => {
                uploadImage(params, fileUrl, fileName)
                    .then(result=> {
                        console.log(result.data.uploadFileInfoPO.name)
                        dispatch(Creators.getAvatar(
                            result.data.uploadFileInfoPO.name
                        ));
                        resolve(result)
                    }).catch(
                        e => {
                            ToastAndroid.show(e.reason || '!',ToastAndroid.SHORT);
                            reject(e);
                        }
                    );
            })
        }
    }
});

export const CommonTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    path: ''
})

/* ------------- Reducers ------------- */

export const getAvatar = (state = INITIAL_STATE, {path}) => {
    console.log(path);
    return state.merge({path})
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_AVATAR]: getAvatar
})

/* ------------- Selectors ------------- */
