/**
 * Created by yjy on 2017/12/22.
 */
/**
 * Created by yjy on 2017/12/9.
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
import ApplicationStyles from "../../themes/ApplicationStyles"
import { View,Text,TouchableOpacity,Image,TextInput,StyleSheet,ScrollView,ToastAndroid,Animated,Keyboard} from 'react-native';
import {List,Modal} from 'antd-mobile'
import {connect} from "react-redux";
import Images from  '../../themes/Images';
import Colors from '../../themes/Colors';
import {ExpandableList,InputItem} from '../../components';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import  {CommonTitle,CommonModal,HeadPortrait}from '../../components'
import GetPatientListAction from '../../redux/GetPatientList'
import {setStore ,getStore, clearStore} from '../../libs/Storage'
import {uploadAvatar,baseImgUrl} from '../../configs/BaseConfig'
import  http from '../../libs/fetch'
import  UserInfoActionType from '../../redux/UserInfo';
import  {px,width} from "../../libs/CSS"
import  ModalSelectPersion from "./ModalSelectPersion"

export default class ModalChangeRemark extends Component {
    state = {
        visible:false,
        remark:''
    }

    componentDidMount(){
        console.log(this.props.initValue);
        this.setState({
            remark:this.props.initValue
        })
    }


    show = ()=>{
        this.setState({
            visible:true
        })
    }

    close = ()=>{
        this.setState({
            visible:false
        })
    }

    handleSubmit =()=>{
        if(this.state.remark.length <= 0 ){
            this.close();
            return;
        }
        this.props.ok && this.props.ok(this.state.remark);
    }



    render() {
        console.log(this.props.initValue);
        return (
            <Modal  style={{flex: 1,backgroundColor:Colors.transparent}} transparent={false} visible={this.state.visible} animationType="slide-up" onClose={this.close}>
                <View>
                    <CommonTitle
                        title = "好友备注"
                        leftView = {
                            <TouchableOpacity activeOpacity={1} onPress = {this.close}>
                                <View >
                                    <Image source = {Images.back} style = {{width:px(28),height:px(48)}} />
                                </View>
                            </TouchableOpacity>

                        }
                        rightView = {
                            <TouchableOpacity activeOpacity={1} onPress = {this.handleSubmit}>
                                <View >
                                    <Text style = {{color:'#fff',fontSize:px(36),opacity:0.8}}>
                                        完成
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        }
                    />
                    <View style = {{height:px(30)}}/>
                    <ScrollView>
                        <View style = {{backgroundColor:'#fff',height:px(160),paddingRight:px(30),paddingLeft:px(30)}}>
                            <View style = {{height:px(20)}}/>

                            <Text style = {{color:'#999',fontSize:px(26)}}>
                                为好友设置备注
                            </Text>
                            <View style = {{height:px(20)}}/>

                            <View style = {{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:px(68),borderBottomWidth:px(1),borderBottomColor:'#999',flex:1}}>
                                <TextInput placeholder = "请输入好友备注"
                                           onChangeText = {(e) => {
                                               this.setState({
                                                   remark:e
                                               })
                                           }}
                                           defaultValue = {this.props.initValue}
                                           onSubmitEditing={Keyboard.dismiss}

                                           underlineColorAndroid='transparent'
                                           placeholderTextColor = '#999'
                                           style = {{flex:1,paddingVertical:5,color:'#666',fontSize:px(32)}}
                                />
                                {false && this.state.remark.length > 0 &&
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
                    </ScrollView>
                </View>
            </Modal>
        );
    }
}