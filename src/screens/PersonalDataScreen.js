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
import { View,Text,TouchableOpacity,Image,TextInput,Platform,PixelRatio,StyleSheet,ScrollView,ToastAndroid,Animated,Keyboard} from 'react-native';
import {Button} from "../components"
import Images from  '../themes/Images'
import { createForm } from 'rc-form'
import {Colors} from '../themes'
import {connect} from "react-redux";
import {List,InputItem,TextareaItem,Picker} from "antd-mobile"
import ApplicationStyles from "../themes/ApplicationStyles"
import InputItemStyle from 'antd-mobile/lib/input-item/style/index.native'
import ListItemStyle from 'antd-mobile/lib/list/style/index.native'
import PickerStyle from 'antd-mobile/lib/picker/style/index.native'
import {getGenderType,genderTitleId} from '../utils/DataDict'
const genderData = getGenderType();
import  {px} from '../libs/CSS'
import  {CameraButton} from '../components'
import  {CommonTitle}from '../components'
import  UserInfoActionType from '../redux/UserInfo';

const Item = List.Item;
const newStyle = {};
const newListStyle = {};
const newPickerStyle = {};
for (const key in PickerStyle) {
    if (Object.prototype.hasOwnProperty.call(ListItemStyle, key)) {
        // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
        newPickerStyle[key] = { ...StyleSheet.flatten(ListItemStyle[key]) };
        if (key === 'actionText') {
            newPickerStyle[key].color = '#333';
            newPickerStyle[key].fontSize = px(32);
        }
    }
}
for (const key in ListItemStyle) {
    if (Object.prototype.hasOwnProperty.call(ListItemStyle, key)) {
        // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
        newListStyle[key] = { ...StyleSheet.flatten(ListItemStyle[key]) };
        if (key === 'Content') {
            newListStyle[key].color = '#333';
            newListStyle[key].fontSize = px(32);
        }
        if(key === 'Extra'){
            newListStyle[key].color = '#333';
            newListStyle[key].fontSize = px(32);
        }
    }
}
for (const key in InputItemStyle) {
    if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
        // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
        newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
        if (key === 'input') {
            newStyle[key].color = '#333';
            newStyle[key].fontSize = px(32);
            newStyle[key].width = px(300);
            newStyle[key].textAlign = 'right'
        }
        if(key === "text"){
            newStyle[key].color = '#333';
            newStyle[key].fontSize = px(32);
        }
        if(key === "container"){
            newStyle[key].flexDirection = 'row';
            newStyle[key].height = px(98);
            newStyle[key].alignItems = 'center';
            newStyle[key].justifyContent = 'space-between';
        }
    }
}
@connect(state =>({
    payload:state.user.doctor || {}
}),{
    updateUserInfo:UserInfoActionType.updateUser
})

class PersonalDataScreen extends Component {
    constructor(props){
        super(props);
        this.imageurl = '';
        this.state = {
            loading:false
        }
    }

    componentDidMount(){

    }
    componentWillUnmount(){

    }

    handleSubmit = () => {
        const {navigation:{navigate,goBack},payload} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.updateUserInfo({...values,
                    titleid:values.titleid[0],
                    imageurl:this.imageurl || payload.imageurl ,
                    sex:values.sex[0]
                },goBack)
            }
        });
    }

    validateAccount = (rule, value, callback) => {
        // if (value && value.length > 4) {
        //     callback();
        // } else {
        //     callback(new Error('最小四位数字'));
        // }
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

    onFileUpload = (imageurl)=>{
        this.imageurl = imageurl;
        console.log(imageurl);
    }

    render() {
        const {navigation:{navigate,goBack},form:{getFieldProps, getFieldError},payload:{dname,sex,imageurl,titleid,department,hospital,profile}} = this.props;
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
                    title= '个人资料'
                />
                <ScrollView
                    style={ApplicationStyles.screen.container}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style = {{backgroundColor:'#fff',
                            height:px(110),flexDirection:'row',
                            borderBottomColor:'#ddd',
                            borderBottomWidth:1/PixelRatio,
                            alignItems:'center',
                            justifyContent:'space-between',paddingLeft:px(30),paddingRight:px(30)}}
                    >
                        <View>
                            <Text style = {{fontSize:px(32),color:'#333'}}>
                                头像
                            </Text>
                        </View>

                        <CameraButton
                            imageurl={imageurl}
                            onFileUpload={this.onFileUpload} />
                    </View>

                    <List
                        renderFooter={() => this.handleRenderFooter('dname')}
                    >
                        <InputItem
                            styles={newStyle}
                            {...getFieldProps('dname', {
                                initialValue:dname,
                                rules: [
                                    { required: true, message: '请输入您的真实姓名' }
                                ],
                            })}
                            error = {!!getFieldError('dname')}
                            placeholder="请输入您的真实姓名"
                            clear
                        >姓名</InputItem>
                    </List>

                    <List
                        renderFooter={() => this.handleRenderFooter('sex')}
                    >
                        <Picker extra="请选择性别"
                                data={genderData}
                                {...getFieldProps('sex', {
                                    initialValue:[sex + ''],
                                    rules: [{ required: true, message: '请选择你的性别' }]
                                })}
                                onOk={e => console.log('ok', e)}
                                onDismiss={e => console.log('dismiss', e)}
                                cols={1}

                        >
                            <List.Item styles = {newListStyle}>性别</List.Item>
                        </Picker>

                    </List>

                    <View style = {{height:px(24)}}/>

                    <List
                        renderFooter={() => this.handleRenderFooter('hospital')}
                    >
                        <InputItem
                            styles={newStyle}
                            {...getFieldProps('hospital', {
                                initialValue:hospital,
                                rules: [
                                    { required: true, message: '请输入您任职医院' },
                                ],
                            })}
                            error = {!!getFieldError('hospital')}
                            clear
                            placeholder="请输入您任职医院"
                        >所属医院</InputItem>
                    </List>

                    <List
                        renderFooter={() => this.handleRenderFooter('office')}
                    >
                        <InputItem
                            styles={newStyle}
                            {...getFieldProps('department', {
                                initialValue:department,
                                rules: [
                                    { required: true, message: '请输入您的任职科室' },
                                ],
                            })}
                            error = {!!getFieldError('department')}
                            placeholder="请输入您的任职科室"
                            clear
                        >所属科室</InputItem>
                    </List>

                    <List
                        renderFooter={() => this.handleRenderFooter('titleid')}
                    >
                        <Picker extra="请选择个人职称"
                                data={genderTitleId()}
                                {...getFieldProps('titleid', {
                                    initialValue:[titleid],
                                    rules: [{ required: true, message: '请选择个人职称' }]
                                })}
                                cols={1}

                        >
                            <List.Item styles = {newListStyle}>个人职称</List.Item>
                        </Picker>
                    </List>

                    <List
                        renderHeader={() => <View style = {{height:px(98),paddingLeft:px(30),flexDirection:'row',flex:1,alignItems:'center'}}>
                            <Text style = {{color:'#333',fontSize:px(32)}}>
                                个人简介
                            </Text>
                        </View>}
                    >
                        <TextareaItem
                            {...getFieldProps('profile', {
                                initialValue:profile

                            })}
                            placeholder = "请详细介绍下自己"
                            rows={5}
                            count={100}
                            clear
                        />
                    </List>


                    <View style = {{ paddingRight:px(32),
                        paddingLeft:px(32),marginTop:px(48)}}>
                        <Button  inline onPress={this.handleSubmit} text = "保存"/>
                        <View style = {{height:px(60)}}/>
                    </View>

                </ScrollView>
            </View>

        );
    }
}
export default createForm()(PersonalDataScreen)