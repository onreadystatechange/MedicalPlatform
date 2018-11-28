/**
 * Created by yjy on 2017/5/8.
 */
import React from 'react'
import {Provider} from 'react-redux'
import Routers from './Routers'
import getStore from './redux'

const store = getStore();

export default class App extends React.Component {
    render() {

        return <Provider store={store}><Routers /></Provider>

    }
}
