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

export default class ModalSickList extends Component {
    state = {
        visible:false,
        selectArray:null,
        selectItems:[]
    }

    componentDidMount(){

    }


    show = ()=>{
        this.setState({
            visible:true,
            selectArray:[]
        })
    }

    close = ()=>{
        this.setState({
            visible:false,
            selectArray:[],
            selectItems:[]
        })
    }

    handleSubmit =()=>{
        this.props.ok && this.props.ok(this.state.selectArray);
    }

    changeSelectArray = (selectArray,selectItems) =>{
        console.log(selectArray);
        this.setState({
            selectArray,
            selectItems
        })
    }

    addPersion=()=>{
        console.log(99);
        this._ModalSelect.show();
    }

    _renderHeader(){
        return(
            <View
                style = {{ paddingRight:px(30),
                    paddingLeft:px(30), marginTop:px(20),backgroundColor:'#fff'}}
            >
                <TouchableOpacity style = {{
                    flexDirection:'row',
                    alignItems:'center',
                    justifyContent:'flex-start',
                    height:px(130),
                }}  onPress = {this.addPersion}>
                    <View>
                        <Image source = {Images.add_new_friend} style = {{width:px(80),height:px(80),borderRadius:px(10)}}/>
                    </View>
                    <View style = {{width:px(30)}}/>
                    <View style = {{flex:1,flexDirection:'row',alignItems:'center'}}>
                        <Text style = {{fontSize:px(32),color:'#333'}}>
                            添加成员
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style = {{height:px(1),backgroundColor:'#eee'}}/>
            </View>
        )
    }

    _renderRow(){
        return(
            <View  style = {{ paddingRight:px(30),
                paddingLeft:px(30), marginTop:px(20),backgroundColor:'#fff'}}>
                {this.state.selectItems.map((item,index) =>(
                    <View
                        key = {index}
                    >
                        <TouchableOpacity style = {{
                            flexDirection:'row',
                            alignItems:'center',
                            justifyContent:'flex-start',
                            height:px(130),
                        }} >
                            <HeadPortrait imageurl = {item.imageurl}/>
                            <View style = {{width:px(30)}}/>
                            <View style = {{flex:1,flexDirection:'row',alignItems:'center'}}>
                                <Text style = {{fontSize:px(32),color:'#333'}}>
                                    {item.remark || item.pname || item.dname}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style = {{height:px(1),backgroundColor:'#eee'}}/>
                    </View>
                ))}
            </View>

        )
    }






    render() {
        const type = this.props.type;
        return (
            <Modal  style={{flex: 1,backgroundColor:Colors.transparent}} transparent={false} visible={this.state.visible} animationType="slide-up" onClose={this.close}>
                <View>
                    <CommonTitle
                        title = "新建分组"
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
                    <ScrollView>
                        <View style = {{width:width,height:px(24)}} />
                        <List
                            renderFooter={
                                <View style = {{flexDirection:'column',paddingLeft:px(30),backgroundColor:'#fff',paddingTop:px(20),paddingBottom:px(40),justifyContent:'flex-start'}}>
                                    <Text style = {{fontSize:px(28),color:'#666'}}>
                                        4-10个字符，可由中文英文数字和"_"组成
                                    </Text>
                                </View>
                            }
                        >
                            <InputItem
                                placeholder="请输入分组名"
                                type="text"
                                clear
                                onChange = {this.props.onChange}
                                value = {this.props.value}
                            >
                                分组名
                            </InputItem>
                        </List>
                        <View style = {{height:px(60),flexDirection:'row',paddingLeft:px(30),alignItems:'center',}}>
                            <Text style = {{color:'#666',fontSize:px(28)}}>
                                添加分组成员
                            </Text>
                        </View>
                        {this._renderHeader()}
                        {this._renderRow()}
                        <ModalSelectPersion
                            ref = {(ref) => this._ModalSelect = ref}
                            ok = {this.changeSelectArray}
                            add = {false}
                            type = {type}
                        />
                    </ScrollView>
                </View>
            </Modal>
        );
    }
}