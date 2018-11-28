/**
 * Created by yjy on 2017/11/14.
 */
/**
 * Created by yjy on 2017/10/9.
 */

import React, { Component } from 'react';
import { View,Text,TouchableOpacity,Image,TextInput,StyleSheet,ScrollView,ToastAndroid,Animated,Keyboard} from 'react-native';
import {connect} from "react-redux";
import Images from  '../themes/Images';
import { createForm } from 'rc-form'
import {List,InputItem} from "antd-mobile";
import {Colors} from '../themes'
import ApplicationStyles from "../themes/ApplicationStyles"
import {Button} from "../components"
import InputItemStyle from 'antd-mobile/lib/input-item/style/index.native'
import {px} from "../libs/CSS"
import  {CommonTitle}from '../components'
import  http from '../libs/fetch'
import {  clearStore} from '../libs/Storage'
import {NavigationActions} from 'react-navigation'
import LoginActions from '../redux/LoginRedux'
import CheckUtils from "../utils/CheckUtils"
import  WebIM from '../libs/WebIM'
const newStyle = {};
for (const key in InputItemStyle) {
    if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
        // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
        newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
        if (key === 'input') {
            newStyle[key].color = '#666';
            newStyle[key].fontSize = px(32);
            newStyle[key].width = px(300);
        }
        if(key === "text"){
            newStyle[key].color = '#333';
            newStyle[key].fontSize = px(32);
        }
        if(key === "container"){
            newStyle[key].flexDirection = 'row';
            newStyle[key].height = px(98);
            newStyle[key].alignItems = 'center';
        }
    }
}
const select = state => ({});
@connect(state =>({
    payload:state.user.doctor || {}
}),{
    logout:LoginActions.logout
})
 class ChangePasswordScreen extends Component {

    componentDidMount(){

    }

     handleSubmit = () => {
         const {navigation:{navigate,goBack},form:{getFieldProps, getFieldError},payload} = this.props;
         const resetActions = NavigationActions.reset({
             index: 0,
             actions: [NavigationActions.navigate({routeName: 'LoginScreen'})]
         });
         const password = getFieldProps('password').value;
         const newPassword = getFieldProps('newPassword').value;
         const checkPsd = getFieldProps('checkPsd').value;
         if(!password){
             ToastAndroid.show('请输入原密码',ToastAndroid.SHORT);
             return;
         }
         if(!newPassword){
             ToastAndroid.show('请输入新密码',ToastAndroid.SHORT);
             return;
         }
         if(!checkPsd){
             ToastAndroid.show('请确认新密码',ToastAndroid.SHORT);
             return;
         }
         if(newPassword !== checkPsd){
             ToastAndroid.show('两次密码输入不一致',ToastAndroid.SHORT);
             return;
         }
         if(!!newPassword && !CheckUtils.checkPsd(newPassword)){
             ToastAndroid.show('密码格式必须以字母开头，长度在6~18之间，只能包含字母、数字和下划线',ToastAndroid.SHORT);
             return;
         }
         this.props.form.validateFields((err, values) => {
             http("doctor/updatepwd",{
                 method:'put',
                 body:{
                     ...values,
                     id:payload.id
                 }
             }).then(data => {
                 ToastAndroid.show('修改成功',ToastAndroid.SHORT);
                 clearStore('AccessToken');
                 if (WebIM.conn.isOpened()) {
                     WebIM.conn.close('logout');
                 }
                 // this.props.logout();
                 this.props.navigation.dispatch(resetActions)
             }).catch(
                 e => console.log(e)
             )
         });
    }


    handleRenderFooter (name){
        const {form:{getFieldProps, getFieldError}} = this.props;
        console.log(getFieldError('checkPsd'));
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

    checkPass1(rule, value, callback) {
        const { getFieldValue ,getFieldError} = this.props.form;
        if(!!getFieldValue('checkPsd') && getFieldValue('checkPsd').length >0){
            if (value && value !== getFieldValue('checkPsd')) {
                callback('两次输入密码不一致！');
            }else {
                callback();
            }
        }else {
            callback();

        }
    }

    checkPass2(rule, value, callback) {
        const { getFieldValue ,getFieldError} = this.props.form;
        if(!!getFieldValue('newPassword') && getFieldValue('newPassword').length >0){
            if (value && value !== getFieldValue('newPassword')) {
                callback('两次输入密码不一致！');
            }else {
                callback();
            }
        } else {
            callback();
        }
    }

    render() {
        const {navigation:{goBack,navigate},form:{getFieldProps, getFieldError}} = this.props;
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
                        <View>

                        </View>
                    }
                    title = '修改密码'
                />
                <ScrollView
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='never'
                    style={ApplicationStyles.screen.container}
                >
                    <List
                    >
                        <InputItem
                            styles={newStyle}
                            {...getFieldProps('password', {
                                rules: [
                                    { required: true, message: '请输入原密码' },
                                ],
                            })}
                            error = {!!getFieldError('password')}
                            placeholder="请输入原密码"
                            type="password"
                            clear
                        >原密码</InputItem>
                    </List>
                    <List
                    >
                        <InputItem
                            styles={newStyle}
                            {...getFieldProps('newPassword', {
                                rules: [
                                    { required: true, message: '请输入新密码' },
                                ],
                            })}
                            error = {!!getFieldError('newPassword')}
                            placeholder="请输入新密码"
                            type="password"
                            clear
                        >新密码</InputItem>
                    </List>

                    <List
                    >
                        <InputItem
                            styles={newStyle}
                            {...getFieldProps('checkPsd',{
                                rules: [
                                    { required: true, message: '请再次输入新密码' },
                                ],
                            })}
                            error = {!!getFieldError('checkPsd')}
                            placeholder="请再次输入新密码"
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
        )
    }
}
export default createForm()(ChangePasswordScreen)