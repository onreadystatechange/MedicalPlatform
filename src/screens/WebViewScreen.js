/**
 * Created by yjy on 2017/12/19.
 */
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
import {Images,Colors} from  '../themes';
import  {CommonTitle,MyWebView}from '../components'
const select = state => ({});
@connect(select)
export default class WebViewScreen extends Component {

    componentDidMount(){

    }

    webGoback(){
        this.web.goBack();
    }

    render() {
        const {navigation:{goBack,navigate}} = this.props;
        const {uri,title}= this.props.navigation.state.params;
        return (
            <View style={{flex: 1,backgroundColor:Colors.transparent}}>
                <CommonTitle
                    leftView = {
                        <View  >
                            <View style = {{flexDirection:'row'}}>
                                <TouchableOpacity  onPress={()=>{this.webGoback()}}  activeOpacity={1}>
                                    <Image source = {Images.back} style = {{width:px(28),height:px(48)}} />
                                </TouchableOpacity>

                                <View style = {{width:px(30)}}/>
                                <TouchableOpacity onPress = {()=>goBack(null)} activeOpacity={1}>
                                    <Text style = {{color:'#fff',fontSize:px(36)}}>
                                        取消
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    }
                    rightView = {
                        <View >

                        </View>
                    }
                    title= {title || ''}
                />
                <MyWebView uri = {uri}
                           ref={(c) => {this.web = c}}
                />
            </View>
        );
    }
}