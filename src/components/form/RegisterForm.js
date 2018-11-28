/**
 * Created by yjy on 2017/11/24.
 */
/**
 * Created by yjy on 2017/11/14.
 */
/**
 * Created by yjy on 2017/10/9.
 */

import React, { Component } from 'react';
import { View,Text,TouchableOpacity,Image,TextInput,StyleSheet,ScrollView,ToastAndroid,Animated,Keyboard} from 'react-native';
import {connect,store} from "react-redux";
import {NavigationActions} from 'react-navigation';
import {List,InputItem,TextareaItem,Picker} from "antd-mobile";
import {InputBoard,Button} from "../../components"
import Utils from "../../utils/Utils"
import InputItemStyle from 'antd-mobile/lib/input-item/style/index.native'
import LoginActions from '../../redux/LoginRedux'
import {getGenderType} from '../../utils/DataDict'
import { createForm } from 'rc-form'
import {Colors} from '../../themes'

const genderData = getGenderType();
@connect(
    state =>({

    }),
    {

    }
)

class RegisterForm extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){

    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    validateAccount = (rule, value, callback) => {
        if (value && value.length > 4) {
            callback();
        } else {
            callback(new Error('最小四位数字'));
        }
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
        const {navigation:{navigate},form:{getFieldProps, getFieldError}} = this.props;
        return (
            <ScrollView
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='never'>
                <List
                    renderFooter={() => this.handleRenderFooter('name')}
                >
                    <InputItem
                        {...getFieldProps('name', {
                            rules: [
                                { required: true, message: '请输入您的真实姓名' },
                                { validator: this.validateAccount },
                            ],
                        })}
                        error = {!!getFieldError('name')}
                        placeholder="请 输 入 您 的 真 实 姓 名"
                        clear
                    >姓名</InputItem>
                </List>

                <List
                    renderFooter={() => this.handleRenderFooter('password')}
                >
                    <InputItem
                        {...getFieldProps('password',{
                            rules: [{ required: true, message: '请设置您的登陆密码' }]
                        })}
                        placeholder="请 设 置 您 的 登 陆 密 码"
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

                            })}
                            onOk={e => console.log('ok', e)}
                            onDismiss={e => console.log('dismiss', e)}


                    >
                        <List.Item >性别</List.Item>
                    </Picker>

                </List>



                <View style = {{height:px(24)}}/>

                <List
                    renderFooter={() => this.handleRenderFooter('hospital')}
                >
                    <InputItem
                        {...getFieldProps('hospital', {
                            rules: [
                                { required: true, message: '请输入您任职医院' },
                            ],
                        })}
                        error = {!!getFieldError('hospital')}
                        clear
                        placeholder="请 输 入 您 任 职 医 院"
                    >医院</InputItem>
                </List>

                <List
                    renderFooter={() => this.handleRenderFooter('office')}
                >
                    <InputItem
                        {...getFieldProps('office', {
                            rules: [
                                { required: true, message: '请输入您的任职科室' },
                            ],
                        })}
                        error = {!!getFieldError('office')}
                        placeholder="请 输 入 您 的 任 职 科 室"
                        clear
                    >科室</InputItem>
                </List>

                <List
                    renderFooter={() => this.handleRenderFooter('job')}
                >
                    <InputItem
                        {...getFieldProps('job', {
                            rules: [
                                { required: true, message: '请输入您的职称' },
                            ],
                        })}
                        error = {!!getFieldError('name')}
                        clear
                        placeholder="请 输 入 您 的 职 称"
                    >职称</InputItem>
                </List>

                <List>
                    <TextareaItem
                        {...getFieldProps('count', {

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
                </View>

            </ScrollView>

        );
    }
};
export default createForm()(RegisterForm)
