/**
 * Created by yjy on 2017/11/24.
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
import {Button,CountDown} from "../components"
import CheckUtils from "../utils/CheckUtils"
import Images from  '../themes/Images'
import  {CommonTitle}from '../components'
import http from '../libs/fetch'

class PhoneCheckScreen extends Component {
    state = {
        phone:'',
        code:''
    }

    componentDidMount(){

    }

    ok=()=>{
        const type = this.props.navigation.state.params.type;
        let url = 'authen/smscode/';
        if(type === "ForgetPasswordScreen"){
            url ='authen/smscode/reset/'
        }
        const phone = this.state.phone;
        if(!!phone && CheckUtils.checkMobile(phone)){
            console.log(999);
            http(`${url}${phone}`).then(data => {
                this.count.countDown();
                ToastAndroid.show('验证码发送成功',ToastAndroid.SHORT);
            });
        }else{
            ToastAndroid.show('请检查手机号码格式是否正确',ToastAndroid.SHORT);
            return false;
        }
    }

    handleSubmit = () => {
        const {navigation:{navigate}} = this.props;
        const type = this.props.navigation.state.params.type;
        const code = this.state.code;
        const phone = this.state.phone;
        if (!CheckUtils.checkMobile(phone)) {
            ToastAndroid.show('请检查手机号码格式是否正确',ToastAndroid.SHORT);
            return;
        }
        if(code.length <= 0){
            ToastAndroid.show('请输入验证码',ToastAndroid.SHORT);
            return;
        }
        http('authen/smscode/check',{
            body:{
                code,
                phone
            }
        },true).then(data =>  navigate(type,{
            code:code,
            phone:phone
        })).catch(e => console.log(e));
    }

    onChangePhone(e){
        this.setState({
            phone:e
        })
    }

    onChangeCode(e){
        this.setState({
            code:e
        })
    }

    render() {
        const {navigation:{navigate,goBack}} = this.props;
        return (
            <View  style = {{flex:1}}>
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
                    title= '手机验证'
                />

                <ScrollView
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='never'
                    style={ApplicationStyles.screen.container}
                    automaticallyAdjustContentInsets={false} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                >

                    <List
                    >
                        <InputItem
                            placeholder="请输入手机号"
                            value = {this.state.phone}
                            type="number"
                            clear
                            onChange = {(e) => this.onChangePhone(e)}
                        >手机号</InputItem>
                    </List>

                    <List
                    >
                        <InputItem
                            placeholder="请输入验证码"
                            value = {this.state.code}
                            clear
                            type="number"
                            onChange = {(e) => this.onChangeCode(e)}
                            extra = {<CountDown ok = {this.ok} ref = {(ref)=> this.count = ref}/>}
                            >
                            验证码
                        </InputItem>
                    </List>


                    <View style = {{ paddingRight:px(32),
                        paddingLeft:px(32),marginTop:px(48)}}>
                        <Button  onPress={this.handleSubmit} text = "提交验证"/>
                    </View>

                </ScrollView>
            </View>

        );
    }
}
export default PhoneCheckScreen