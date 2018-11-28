/**
 * Created by yjy on 2017/11/27.
 */
/**
 * Created by yjy on 2017/11/14.
 */
/**
 * Created by yjy on 2017/10/9.
 */

import React, { Component } from 'react';
import { View,Text,TouchableOpacity,Image} from 'react-native';
import {connect} from "react-redux";
import  {CommonTitle,MyWebView}from '../components'
import Images from  '../themes/Images';
const select = state => ({});
@connect(select)
export default class AboutUsScreen extends Component {

    componentDidMount(){

    }

    render() {
        const {navigation:{goBack,navigate}} = this.props;
        return (
            <View style={{flex: 1}}>
                <CommonTitle
                    leftView = {
                        <TouchableOpacity activeOpacity={1} onPress={()=>{goBack(null)}}>
                            <View >
                                <Image source = {Images.back} style = {{width:px(28),height:px(48)}} />
                            </View>
                        </TouchableOpacity>
                    }
                    rightView = {
                        <View >

                        </View>
                    }
                    title='关于我们'
                />
                <MyWebView uri = {'http://www.amdolla.com.cn/about.html'}
                    ref={(c) => {this.web = c}}
                />
            </View>
        );
    }
}