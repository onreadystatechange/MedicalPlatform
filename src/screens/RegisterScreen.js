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
import {List,InputItem,TextareaItem,Picker} from "antd-mobile";
import {Button} from "../components"
import InputItemStyle from 'antd-mobile/lib/input-item/style/index.native'
import ListItemStyle from 'antd-mobile/lib/list/style/index.native'
import PickerStyle from 'antd-mobile/lib/picker/style/index.native'
import {getGenderType,genderTitleId} from '../utils/DataDict'
import { createForm } from 'rc-form'
import {Colors} from '../themes'
import Images from  '../themes/Images';
import CheckUtils from "../utils/CheckUtils"
import  {px} from '../libs/CSS'
import http from '../libs/fetch'
import  {CommonTitle}from '../components'
const newStyle = {};
const newListStyle = {};
const newPickerStyle = {};
for (const key in PickerStyle) {
    if (Object.prototype.hasOwnProperty.call(ListItemStyle, key)) {
        // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
        newPickerStyle[key] = { ...StyleSheet.flatten(ListItemStyle[key]) };
        if (key === 'actionText') {
            newPickerStyle[key].color = '#333';
            newPickerStyle[key].fontSize = px(32);
        }
    }
}
for (const key in ListItemStyle) {
    if (Object.prototype.hasOwnProperty.call(ListItemStyle, key)) {
        // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
        newListStyle[key] = { ...StyleSheet.flatten(ListItemStyle[key]) };
        if (key === 'Content') {
            newListStyle[key].color = '#333';
            newListStyle[key].fontSize = px(32);
        }
        if(key === 'Extra'){
            newListStyle[key].color = '#333';
            newListStyle[key].fontSize = px(32);
        }
    }
}
for (const key in InputItemStyle) {
    if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
        // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
        newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
        if (key === 'input') {
            newStyle[key].color = '#333';
            newStyle[key].fontSize = px(32);
            newStyle[key].width = px(300);
            newStyle[key].textAlign = 'right'
        }
        if(key === "text"){
            newStyle[key].color = '#333';
            newStyle[key].fontSize = px(32);
        }
        if(key === "container"){
            newStyle[key].flexDirection = 'row';
            newStyle[key].height = px(98);
            newStyle[key].alignItems = 'center';
            newStyle[key].justifyContent = 'space-between';
        }
    }
}



const genderData = getGenderType();
class RegisterScreen extends Component {
    constructor(props){
        super(props);
    }


    componentDidMount(){

    }


    handleSubmit = () => {
        const {navigation:{navigate,goBack},form:{getFieldProps, getFieldError}} = this.props;
        const phone = this.props.navigation.state.params.phone;
        const password = getFieldProps('password').value;
        const resetActions = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'LoginScreen'})]
        });
        if(!!password && !CheckUtils.checkPsd(password)){
            ToastAndroid.show('密码格式必须以字母开头，长度在6~18之间，只能包含字母、数字和下划线',ToastAndroid.SHORT);
            return;
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                 http('authen/register/doctor',
                     {body:{...values,sex:values.sex[0],title_id:values.title_id[0],phone:phone},method:'post'}).then(data =>
                         {
                             ToastAndroid.show('注册成功',ToastAndroid.SHORT);
                             this.props.navigation.dispatch(resetActions);
                         }

                 );
            }
        });
    }

    validateAccount = (rule, value, callback) => {
        // if (value && value.length > 4) {
        //     callback();
        // } else {
        //     callback(new Error('最小四位数字'));
        // }
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
                            <View >
                                <Image source = {Images.back} style = {{width:px(28),height:px(48)}} />
                            </View>
                        </TouchableOpacity>
                    }
                    rightView = {
                        <View >

                        </View>
                    }
                    title='注册'
                />
                <ScrollView
                    style={ApplicationStyles.screen.container}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <List
                        renderFooter={() => this.handleRenderFooter('dname')}
                    >
                        <InputItem
                            styles={newStyle}
                            {...getFieldProps('dname', {
                                rules: [
                                    { required: true, message: '请输入您的真实姓名' },
                                ],
                            })}
                            error = {!!getFieldError('dname')}
                            placeholder="请输入您的真实姓名"
                            clear
                        >姓名</InputItem>
                    </List>

                    <List
                        renderFooter={() => this.handleRenderFooter('password')}
                    >
                        <InputItem
                            styles={newStyle}
                            {...getFieldProps('password',{
                                rules: [{ required: true, message: '请设置您的登陆密码' }]
                            })}
                            placeholder="请设置您的登陆密码"
                            error = {!!getFieldError('password')}
                            clear
                            type="password">
                            密码
                        </InputItem>
                    </List>

                    <List

                        renderFooter={() => this.handleRenderFooter('sex')}
                    >
                        <Picker extra="请选择性别"
                                data={genderData}
                                {...getFieldProps('sex', {
                                    rules: [{ required: true, message: '请选择你的性别' }]
                                })}
                                onOk={e => console.log('ok', e)}
                                onDismiss={e => console.log('dismiss', e)}
                                cols={1}
                                styles = {PickerStyle}
                        >
                            <List.Item styles={newListStyle}>性别</List.Item>
                        </Picker>

                    </List>



                    <View style = {{height:px(24)}}/>

                    <List
                        renderFooter={() => this.handleRenderFooter('hospital')}
                    >
                        <InputItem
                            styles={newStyle}
                            {...getFieldProps('hospital', {
                                rules: [
                                    { required: true, message: '请输入您任职医院' },
                                ],
                            })}
                            error = {!!getFieldError('hospital')}
                            clear
                            placeholder="请输入您任职医院"
                        >所属医院</InputItem>
                    </List>

                    <List
                        renderFooter={() => this.handleRenderFooter('department')}
                    >
                        <InputItem
                            styles={newStyle}
                            {...getFieldProps('department', {
                                rules: [
                                    { required: true, message: '请输入您的任职科室' },
                                ],
                            })}
                            error = {!!getFieldError('department')}
                            placeholder="请输入您的任职科室"
                            clear
                        >所属科室</InputItem>
                    </List>

                    <List
                        renderFooter={() => this.handleRenderFooter('title_id')}

                    >
                        <Picker extra="请选择个人职称"
                                data={genderTitleId()}
                                {...getFieldProps('title_id', {
                                    rules: [{ required: true, message: '请选择个人职称' }]
                                })}
                                onOk={e => console.log('ok', e)}
                                onDismiss={e => console.log('dismiss', e)}
                                cols={1}
                                styles = {PickerStyle}
                        >
                            <List.Item styles={newListStyle}>个人职称</List.Item>
                        </Picker>
                    </List>

                    <List>
                        <TextareaItem
                            {...getFieldProps('profile', {

                            })}
                            placeholder = "请详细介绍下自己"
                            rows={5}
                            count={100}
                            clear
                        />
                    </List>


                    <View style = {{ paddingRight:px(32),
                        paddingLeft:px(32),marginTop:px(48)}}>
                        <Button  inline onPress={this.handleSubmit} text = "注册"/>
                        <View style = {{height:px(60)}}/>
                    </View>

                </ScrollView>
            </View>

        );
    }
}
export default createForm()(RegisterScreen)