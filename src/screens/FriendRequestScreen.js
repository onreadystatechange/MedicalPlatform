/**
 * Created by yjy on 2017/12/14.
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
import { View,Text,TouchableOpacity,Image,ScrollView,TextInput,Keyboard,ToastAndroid} from 'react-native';
import {connect} from "react-redux";
import {Images,Colors} from  '../themes';
import  {CommonTitle,LoadingView}from '../components';
import  http from '../libs/fetch'

@connect(
    state => ({
        nav:state.nav,
        fetching:state.ui.common.fetching
    })
)
export default class FriendRequestScreen extends Component {
    state = {
        name:'',
        remark:'',
        show:false
    }
    componentDidMount(){

    }


    sendMesg =()=>{
        const item = this.props.navigation.state.params.item;
        const {navigation:{goBack,navigate},nav} = this.props;
        this.setState({
            show:true
        })
        http(`friend/ask/add/${item}`,{
            body:{
                remark:this.state.remark,
            },
            method:'post'
        },true).then(data => {
            this.setState({
                show:false
            })
            ToastAndroid.show('好友请求发送成功',ToastAndroid.SHORT);
            goBack(null);
        }).catch(e => this.setState({
            show:false
        }))
    }

    render() {
        const item = this.props.navigation.state.params.item;
        const {navigation:{goBack,navigate,state}} = this.props;
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
                        <TouchableOpacity onPress = {this.sendMesg}>
                            <Text style = {{color:'#fff',fontSize:px(36)}}>
                                发送
                            </Text>
                        </TouchableOpacity>
                    }
                    title= '好友验证'
                />
                <View style = {{height:px(30)}}/>
                <ScrollView >
                    <View style = {{backgroundColor:'#fff',height:px(160),paddingRight:px(30),paddingLeft:px(30)}}>
                        <View style = {{height:px(20)}}/>

                        <Text style = {{color:'#999',fontSize:px(26)}}>
                            您需要发送验证申请，等待对方同意
                        </Text>
                        <View style = {{height:px(20)}}/>

                        <View style = {{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:px(68),borderBottomWidth:px(1),borderBottomColor:'#999',flex:1}}>
                            <TextInput placeholder = "请输入验证信息"
                                       onChangeText = {(e) => {
                                           this.setState({
                                               remark:e
                                           })
                                       }}
                                       onSubmitEditing={Keyboard.dismiss}
                                       value = {this.state.remark}
                                       underlineColorAndroid='transparent'
                                       placeholderTextColor = '#999'
                                       style = {{flex:1,paddingVertical:5,color:'#666',fontSize:px(32)}}
                            />
                            {this.state.remark.length > 0 &&
                                <TouchableOpacity onPress = {() => this.setState({
                                    remark:''
                                })}>
                                    <Image source = {Images.clear_text} style = {{height:px(30),width:px(30)}}/>
                                </TouchableOpacity>
                            }

                        </View>
                        <View style = {{height:px(20)}}/>
                    </View>

                    <View style = {{height:px(30)}}/>
                    <View style = {{backgroundColor:'#fff',paddingRight:px(30),paddingLeft:px(30)}}>
                        <View style = {{height:px(20)}}/>

                        <Text style = {{color:'#999',fontSize:px(26)}}>
                            为好友设置备注
                        </Text>
                        <View style = {{height:px(20)}}/>

                        <View style = {{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:px(68),borderBottomWidth:px(1),borderBottomColor:'#999',flex:1}}>
                            <TextInput placeholder = "请输入备注"
                                       onChangeText = {(e) => {
                                           this.setState({
                                               name:e
                                           })
                                       }}
                                       onSubmitEditing={Keyboard.dismiss}
                                       value = {this.state.name}
                                       underlineColorAndroid='transparent'
                                       placeholderTextColor = '#999'
                                       style = {{flex:1,paddingVertical:5,color:'#666',fontSize:px(32)}}
                            />
                            {
                                this.state.name.length > 0 &&    <TouchableOpacity onPress = {() => this.setState({
                                    name:''
                                })}>
                                    <Image source = {Images.clear_text} style = {{height:px(30),width:px(30)}}/>
                                </TouchableOpacity>
                            }
                        </View>
                        <View style = {{height:px(20)}}/>
                    </View>
                </ScrollView>
                <LoadingView visible = {this.state.show} loadingText = '发送中...' onRequestClose = {()=>console.log(8)}/>
            </View>
        );
    }
}