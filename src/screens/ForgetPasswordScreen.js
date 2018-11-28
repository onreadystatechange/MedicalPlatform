/**
 * Created by yjy on 2017/11/23.
 */
/**
 * Created by yjy on 2017/11/14.
 */
/**
 * Created by yjy on 2017/10/9.
 */

import ApplicationStyles from "../themes/ApplicationStyles"
import React, { Component } from 'react';
import { View,Text,TouchableOpacity,Image,TextInput,StyleSheet,ScrollView,ToastAndroid,Animated,Keyboard} from 'react-native';
import {store} from "react-redux";
import {NavigationActions} from 'react-navigation';
import {List,InputItem} from "antd-mobile";
import {Button} from "../components"
import Images from  '../themes/Images';
import { createForm } from 'rc-form'
import {Colors} from '../themes'
import  {CommonTitle}from '../components'
import CheckUtils from "../utils/CheckUtils"
import http from '../libs/fetch'
class ForgetPasswordScreen extends Component {

    handleSubmit = () => {
        const {navigation:{navigate,goBack},form:{getFieldProps, getFieldError}} = this.props;
        const code = this.props.navigation.state.params.code;
        const phone = this.props.navigation.state.params.phone;
        const password = getFieldProps('password').value;
        const newword = getFieldProps('newword').value;
        const resetActions = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'LoginScreen'})]
        });
        if(newword !== password){
            ToastAndroid.show('两次密码输入不一致',ToastAndroid.SHORT);
            return;
        }
        if(!CheckUtils.checkPsd(password)){
            ToastAndroid.show('密码格式必须以字母开头，长度在6~18之间，只能包含字母、数字和下划线',ToastAndroid.SHORT);
            return;
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                delete values.newword;
                http('doctor/resetpwd',{
                    method:'put',
                    body:{
                        ...values,
                        code:code,
                        phone:phone
                    }
                },true,'put').then(data =>{
                        ToastAndroid.show('修改密码成功',ToastAndroid.SHORT);
                        this.props.navigation.dispatch(resetActions)
                }).catch(e => console.log(e))
            }
        });
    }

    handleRenderFooter (name){
        const {form:{getFieldProps, getFieldError}} = this.props;
        return(
            <View>
                {
                    !!getFieldError(name) &&  (<View style = {{paddingLeft:px(32),height:px(60),justifyContent:'center',backgroundColor:'#fff'}}>
                        <Text style = {{fontSize:px(30),color:Colors.error}}>
                            {getFieldError(name) && getFieldError(name).join(',')}
                        </Text>
                    </View>)
                }
            </View>

        )
    }

    render() {
        const {navigation:{navigate,goBack},form:{getFieldProps, getFieldError}} = this.props;
        return (
            <View style={{flex: 1,backgroundColor:Colors.transparent}}>
                <CommonTitle
                    leftView = {
                        <TouchableOpacity activeOpacity={1} onPress={()=>{goBack(null)}}>
                            <View>
                                <Image source = {Images.back} style = {{width:px(28),height:px(48)}} />
                            </View>
                        </TouchableOpacity>
                    }
                    rightView = {
                        <View >

                        </View>
                    }
                    title= '新密码'
                />
                <ScrollView
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='never'
                    style={ApplicationStyles.screen.container}
                >

                    <List
                        renderFooter={() => this.handleRenderFooter('password')}
                    >
                        <InputItem
                            {...getFieldProps('password', {
                                rules: [
                                    { required: true, message: '请输入新密码' }
                                ],
                            })}
                            error = {!!getFieldError('password')}
                            placeholder="请输入新密码"
                            type="password"
                            clear
                        >新密码</InputItem>
                    </List>

                    <List
                        renderFooter={() => this.handleRenderFooter('newword')}
                    >
                        <InputItem
                            {...getFieldProps('newword',{
                                rules: [{ required: true, message: '请再次输入密码' }]
                            })}
                            placeholder="请再次输入"
                            error = {!!getFieldError('newword')}
                            clear
                            type="password">
                            确认密码
                        </InputItem>
                    </List>


                    <View style = {{ paddingRight:px(32),
                        paddingLeft:px(32),marginTop:px(48)}}>
                        <Button  onPress={this.handleSubmit} text = "确认"/>
                    </View>

                </ScrollView>
            </View>


        )}
}
export default createForm()(ForgetPasswordScreen)