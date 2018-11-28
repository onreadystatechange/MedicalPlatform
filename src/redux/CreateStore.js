/**
 * Created by yjy on 2017/11/15.
 */
/**
 * Created by yjy on 2017/11/15.
 */
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
// creates the store
export default (rootReducer) => {
    /* ------------- Redux Configuration ------------- */

    const middleware = []
    const enhancers = []


    /* ------------- Saga Middleware ------------- */
    middleware.push(thunkMiddleware)

    if (__DEV__) {
        // the logger master switch
        middleware.push(logger)
    }

    /* ------------- Assemble Middleware ------------- */

    enhancers.push(applyMiddleware(...middleware))


    // in dev mode, we'll create the store through Reactotron
    const store = createStore(rootReducer, compose(...enhancers))

    return store
}
