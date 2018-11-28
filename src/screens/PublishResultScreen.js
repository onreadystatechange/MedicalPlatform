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
@connect(state =>({
    payload:state.user.doctor || {},
}),{

})
export default class PublishResultScreen extends Component {
    state  ={
        result:''
    }

    componentDidMount(){

    }

    _onPress(){
        const {navigation:{goBack,navigate}} = this.props;
        const items = this.props.navigation.state.params.item;
        const {id} = items;
        if(this.state.result.length >0){
            http(`dus/addCom`,{
                method:'put',
                body:{

                    disscussid: id,
                    doctorid: this.props.payload.id,
                    id: id,
                    results:this.state.result

                }
            },true).then(data => {
                ToastAndroid.show('发布成功',ToastAndroid.SHORT);
                this.props.navigation.state.params.onSelect(this.state.result,"publish");
                goBack(null);
                return;
            }).catch(e => console.log(e))

        }else{
            ToastAndroid.show('请输入发布结果',ToastAndroid.SHORT);
        }
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
                    title= '发布结果'
                />

                <ScrollView style = {{flexDirection:'column'}}>
                    <View style = {{height:px(30)}}/>
                    <TextareaInput
                        value = {this.state.result}
                        onChangeText = {(value) =>this.setState({
                            result:value
                        })}
                        placeholder = "填写我要发布的诊断结果"
                        title = '诊断结果'/>
                    <View style = {{height:px(186)}}/>


                    <View style = {{justifyContent:'center',paddingLeft:px(85),paddingRight:px(85)}}>
                        <Button text ="发布" onPress = {() =>  this._onPress()} />
                    </View>
                    <View style = {{flex:1,height:px(130),flexDirection:'column'}}/>

                </ScrollView>

            </View>

        );
    }
}