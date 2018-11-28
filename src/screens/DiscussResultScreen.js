/**
 * Created by yjy on 2018/2/3.
 */

/**
 * Created by yjy on 2017/10/9.
 */

import React, { Component } from 'react';
import { View,Text,TouchableOpacity,Image,ScrollView,ToastAndroid} from 'react-native';
import {connect} from "react-redux";
import {Images,Colors} from  '../themes';
import  {CommonTitle,Button,TextareaInput,RadioGr}from '../components'
import  GetMemberType from '../redux/GetMemberList';
import http from '../libs/fetch'
import  GetPatientCaseDetailAction from '../redux/GetPatientCaseDetail';
const select = state => ({});
@connect(state =>({
    payload:state.user.doctor || {},
    patientCaseDetail:state.patientCaseDetail || {},
    disscussPO:state.member.disscussPO || {},
    disscussDoctorPOList:state.member.disscussDoctorPOList || []
}),{
    getPatientCasedetail:GetPatientCaseDetailAction.getPatientCasedetail,
    getMemberList:GetMemberType.getMemberList
})
export default class DiscussResultScreen extends Component {


    componentDidMount(){

    }

    render() {
        const items = this.props.navigation.state.params.item;
        const {confirmresults} = items;
        console.log(confirmresults);
        const {navigation:{goBack,navigate}} = this.props;
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
                    title= '讨论结果'
                />

                <ScrollView style = {{flexDirection:'column'}} automaticallyAdjustContentInsets={false} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    <View style = {{height:px(30)}}/>
                    <TextareaInput
                        noTitle = {false}
                        editable = {false}
                        value = {confirmresults}
                        title = '讨论结果'/>
                    <View style = {{flex:1}}/>

                </ScrollView>

            </View>

        );
    }
}