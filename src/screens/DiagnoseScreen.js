/**
 * Created by yjy on 2017/12/13.
 */
/**
 * Created by yjy on 2017/12/13.
 */
/**
 * Created by yjy on 2017/12/13.
 */
/**
 * Created by yjy on 2017/12/12.
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
import { View,Text,TouchableOpacity,Image,ScrollView,ToastAndroid} from 'react-native';
import {connect} from "react-redux";
import {Images,Colors} from  '../themes';
import  {CommonTitle,Button,TextareaInput}from '../components'
import  http from '../libs/fetch'
const select = state => ({});
@connect(select)
export default class DiagnoseScreen extends Component {
    state  ={
        result:'',
        suggest:''
    }
    componentDidMount(){

    }
    _handleSubmit(){
        const item = this.props.navigation.state.params.item;
        const {result,suggest} = this.state;
        const resultLength =   result.length > 0 ;
        const suggestLength = suggest.length > 0 ;
        if(!resultLength && !suggestLength){
            ToastAndroid.show('诊断结果或医生建议不能为空',ToastAndroid.SHORT);
            return;
        }
        http('med/update',{
            method:'put',
            body:{
                datas:item.datas,
                patientId:item.patientId,
                doctorId:item.doctorId,
                id:item.historyid,
                diagnoseState:2,
                tentativeDiagnosis:this.state.result,
                treatmentSuggestion:this.state.suggest,
                item:item.item
            }
        })
        // {
        //
        //     "datas": "string",
        //     "diagnoseState": 0,
        //     "doctorId": "string",
        //     "id": "string",
        //     "item": "string",
        //     "patientId": "string",
        //     "tentativeDiagnosis": "string",
        //     "treatmentSuggestion": "string"
        // }
    }

    render() {
        // const item = this.props.navigation.state.params.item;
        const {navigation:{goBack,navigate}} = this.props;
        // const {pname,imageurl,id,sex} = item;
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
                    title= '诊断'
                />

                <ScrollView style = {{flexDirection:'column'}}>
                    <View style = {{height:px(30)}}/>
                    <TextareaInput
                        value = {this.state.result}
                        onChangeText = {(value) =>this.setState({
                            result:value
                        })}
                        placeholder = "填写诊断结果"
                        title = '诊断结果'/>
                    <View style = {{height:px(20)}}/>
                    <TextareaInput
                        onChangeText = {(value) =>this.setState({
                            suggest:value
                        })}
                        placeholder = "填写治疗建议"
                        value = {this.state.suggest}
                        title = '医生建议'/>
                    <View style = {{height:px(20),backgroundColor:'#fff'}}/>

                    <View style = {{backgroundColor:'#fff',justifyContent:'center',paddingLeft:px(85),paddingRight:px(85)}}>
                        <Button text ="提交" onPress = {() => this._handleSubmit() }/>
                    </View>
                    <View style = {{backgroundColor:'#fff',flex:1,height:px(130),flexDirection:'column'}}/>

                </ScrollView>

            </View>

        );
    }
}