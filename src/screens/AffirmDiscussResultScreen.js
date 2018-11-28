
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
export default class AffirmDiscussResultScreen extends Component {

    state  ={
        result:'',
        index:'',
        value:'',
        disscussDoctorList:[]
    }

    componentDidMount(){
        const item = this.props.navigation.state.params.item;
        const {id,patientCase,patientId} = item;
        console.log(101001);
        http(`dus/findComByDissId/${id}`,{method:'get'}).then(data =>  {
            console.log(data);
            this.setState({
                disscussDoctorList:data.disscussDoctorList
            })
            }).catch(
            e=> {
              console.log(e);
            }
        )
    }

    handleSubmit(){
        const item = this.props.navigation.state.params.item;
        const {id,patientCase,patientId} = item;
        const {navigation:{goBack,navigate},disscussDoctorPOList} = this.props;
        const result = this.state.value || this.state.result;
        if(!!result){
            return http('dus/addConfirm',{method:'put',body:{
                ...this.props.disscussPO,
                confirmresults:result
            }}).then(data =>  {
                ToastAndroid.show('保存成功',ToastAndroid.SHORT);
                this.props.navigation.state.params.onSelect(result,"affirmResult");
                // this.props.getMemberList();
                goBack(null);
            }).catch(
                e=> {
                    console.log(e)
                }
            )
        }else{
            ToastAndroid.show('请确认讨论结果',ToastAndroid.SHORT);
        }
    }


    render() {
        const {navigation:{goBack,navigate}} = this.props;
        const {disscussDoctorList} = this.state;
        const dataDirect = ()=>disscussDoctorList.filter((item)=>!!item.results === true);
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
                    title= '确认讨论结果'
                />

                <ScrollView style = {{flexDirection:'column'}} automaticallyAdjustContentInsets={false} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    <View style = {{height:px(30)}}/>
                    <RadioGr data = {dataDirect()} onSelect = {(index, value) => this.setState({
                        index:index,
                        value:value
                    })} style = {{backgroundColor:'#fff'}}/>
                    <View style = {{height:px(20),backgroundColor:'#fff'}}/>
                    <TextareaInput
                        noTitle = {true}
                        text = {this.state.result}
                        onChangeText = {(value) =>this.setState({
                            result:value
                        })}
                        placeholder = "填写我要确定的诊断结果"
                        title = '诊断结果'/>
                    <View style = {{height:px(186)}}/>


                    <View style = {{justifyContent:'center',paddingLeft:px(85),paddingRight:px(85)}}>
                        <Button text ="确定" onPress = {() => this.handleSubmit()} />
                    </View>
                    <View style = {{flex:1,height:px(130),flexDirection:'column'}}/>

                </ScrollView>

            </View>

        );
    }
}