/**
 * Created by yjy on 2017/11/24.
 */
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

@connect(
    state =>({

    }),
    {

    }
)

class PhoneCheckForm extends Component {
    constructor(props){
        super(props);
    }

    static navigationOptions = {
        header:null
    };


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
                    renderFooter={() => this.handleRenderFooter('phone')}
                >
                    <InputItem
                        {...getFieldProps('phone', {
                            rules: [
                                { required: true, message: '请输入手机号' },
                                { validator: this.validateAccount },
                            ],
                        })}
                        error = {!!getFieldError('phone')}
                        placeholder="请 输 入 您 的 手 机 号"
                        clear
                    >手机号</InputItem>
                </List>

                <List
                    renderFooter={() => this.handleRenderFooter('checkCode')}
                >
                    <InputItem
                        {...getFieldProps('checkCode',{
                            rules: [{ required: true, message: '请输入验证码' }]
                        })}
                        placeholder="请 输入 你 的 验 证 码"
                        error = {!!getFieldError('checkCode')}
                        clear
                        type="password">
                        验证码
                    </InputItem>
                </List>


                <View style = {{ paddingRight:px(32),
                    paddingLeft:px(32),marginTop:px(48)}}>
                    <Button  inline onPress={this.handleSubmit} text = "提交验证"/>
                </View>

            </ScrollView>

        );
    }
};
export default createForm()(PhoneCheckForm)
