/**
 * Created by yjy on 2017/12/28.
 */
/**
 * Created by yjy on 2017/12/13.
 */
/**
 * Created by yjy on 2017/12/13.
 */

import React, { Component } from 'react';
import { View,Text,TouchableOpacity,Image,ScrollView,TextInput,StyleSheet,Platform,ToastAndroid} from 'react-native';
import {connect} from "react-redux";
import {Images,Colors} from  '../themes';
import  {CommonTitle}from '../components'
import  {baseImgUrl,uploadAvatar} from '../configs/BaseConfig'
import { TextareaItem, List,InputItem} from 'antd-mobile';
import { createForm } from 'rc-form'
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import InputItemStyle from 'antd-mobile/lib/input-item/style/index.native'
import ListItemStyle from 'antd-mobile/lib/list/style/index.native'
import PickerStyle from 'antd-mobile/lib/picker/style/index.native'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { getStore} from '../libs/Storage'
import {px} from '../libs/CSS'
import ImagePicker from 'react-native-image-picker';
import  Utils from '../utils/Utils'
const options = {
    title: '选择图片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '图片库',
    cameraType: 'back',
    mediaType: 'photo',
    videoQuality: 'high',
    durationLimit: 10,
    maxWidth: 600,
    maxHeight: 600,
    aspectX: 2,
    aspectY: 1,
    quality: 0.8,
    angle: 0,
    allowsEditing: false,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

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
    payload:state.user.doctor || {},
}),{

})
class CaseEditScreen extends Component {
    constructor(props){
        super(props);
        const caseDetail = this.props.navigation.state.params.item;
        const {allow,medicalHistoryVO:{
            diagnoseState,item,modtime,tentativeDiagnosis,treatmentSuggestion,datas
        },attendingDoctor} = caseDetail;
        const data = JSON.parse(datas);
        const {chiefComplaint,hpi,pMedicalh,historyAllergy,hospital,badHabits,marital,marriage,mate,temperature,pulse,breathing,
            pressure,pressureimage,examination,examinationimage,doctorId,familyHistory,doctorName} = data;
        console.log(data);
        this.token = '';
        this.state = {
            showProgress:false,
            images:[],
            index:0,
            height:0,
            chiefComplaint,
            hpi,
            pMedicalh,
            historyAllergy,
            hospital,
            badHabits,
            marital,
            marriage,
            mate,
            temperature,
            pulse,
            breathing,
            pressure,
            pressureimage,
            examination,
            examinationimage,
            doctorName,
            familyHistory,
            attendingDoctor,
            diagnoseState,
            tentativeDiagnosis,treatmentSuggestion,
            item
        }
    }


   async componentDidMount(){
         this.token = await getStore('AccessToken');
    }

    _onPress = (images) =>(index) =>{
        const imagesArr = [];
        images.map((item) => imagesArr.push({
            url:baseImgUrl+item
        }));
        console.log(imagesArr);
        this.setState({
            images:imagesArr,
            index
        },()=>{
            this._ImageView.open()
        })
    }

    _selectImage(){

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else {
                let source;
                if (Platform.OS === 'android') {
                    source = {uri: response.uri, isStatic: true}
                } else {
                    source = {uri: response.uri.replace('file://', ''), isStatic: true}
                }
                let file;
                if(Platform.OS === 'android'){
                    file = response.uri
                }else {
                    file = response.uri.replace('file://', '')
                }
                this.setState({
                    showProgress:true
                });
                console.log(file);
                let fileObj = {uri: file, type: 'multipart/form-data', name: 'images'};
                // let username = this.state.username;
                let formData = new FormData();
                // formData.append('username', username);
                formData.append('file', fileObj);
                formData.append('dir', 'user/images/logo');
                console.log(formData);
                fetch(uploadAvatar, {method: 'POST', headers: {
                    'XSS-protext-Authorization':this.token,
                }, body:
                formData,
                })
                    .then((res) => res.json())
                    .then((json) => {
                        console.log(json)
                        this.setState({showProgress: false});
                        if (!Utils.isEmpty(json)) {
                            if (json.retCode === '000000') {
                                this.setState({pressureimage: json.data.uploadFileInfoPO.name});
                                console.log(json.data.uploadFileInfoPO.name);
                                ToastAndroid.show('上传图片成功',ToastAndroid.SHORT);
                            } else {
                                console.warn(JSON.stringify(json));
                                ToastAndroid.show('' + json.msg,ToastAndroid.SHORT);
                                // console.warn('json.msg: ' + json.msg)
                            }
                        }
                    }).catch((e) => {
                    this.setState({showProgress: false});
                    ToastAndroid.show('' + e.toString(),ToastAndroid.SHORT);
                    console.warn('exception: ' + e.toString())
                })
            }
        });
    }


    render() {
        const {item,chiefComplaint,hpi,pMedicalh,historyAllergy,hospital,badHabits,marital,marriage,mate,temperature,pulse,breathing,
            pressure,pressureimage,examination,examinationimage,
            doctorId,familyHistory,doctorName,attendingDoctor,diagnoseState,tentativeDiagnosis,treatmentSuggestion} = this.state;
        const {navigation:{navigate,goBack},form:{getFieldProps,getFieldError}} = this.props;
        const id = this.props.payload.id;
        const showName = id === attendingDoctor?'我':doctorName;
        return (
            <View style={{flex: 1}}>
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
                            <Text style = {{ color: 'white', fontSize: px(36)}}>
                                保存
                            </Text>
                        </View>
                    }
                    title= '病例编辑'
                />
                <ScrollView style = {{flex:1}} automaticallyAdjustContentInsets={false} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    <View
                        style = {{
                            flexDirection:'row',
                            alignItems:'center',
                            justifyContent:'flex-start',
                            height:px(100),
                            backgroundColor:'#fff',
                            paddingRight:px(30),
                        }}
                    >
                        <View style = {{width:px(8),height:px(36),backgroundColor:Colors.navBarColor}}/>
                        <View style = {{width:px(22)}}/>
                        <View style = {{flexDirection:'row'}}>
                            <Text style = {{color:'#333',fontSize:px(36)}}>
                                {item}
                            </Text>
                        </View>
                        <View style = {{flex:1}}/>
                    </View>
                    <List renderHeader={() => "主诉"}>
                        <TextareaItem
                            {...getFieldProps('chiefComplaint', {
                               initialValue:chiefComplaint
                            })}
                            rows={6}
                            placeholder="请输入主诉"
                            />
                    </List>

                    <List renderHeader={() => "现病史"}>
                        <TextareaItem
                            {...getFieldProps('hpi', {
                                initialValue:hpi
                            })}
                            rows={6}
                            placeholder="请输入现病史"
                            />
                    </List>
                    <List renderHeader={() => "既往史"}>
                        <TextareaItem
                            {...getFieldProps('pMedicalh', {
                                initialValue:pMedicalh
                            })}
                            rows={6}
                            placeholder="请输入现病史"
                            />
                    </List>

                    <List renderHeader={() => "个人史"}>
                        <InputItem
                            clear
                            labelNumber={4}
                            placeholder="居住地地方疾病"
                            styles={newStyle}
                        >
                            疾病
                        </InputItem>
                        <InputItem
                            clear
                            labelNumber={4}
                            placeholder="不良嗜好"
                            styles={newStyle}
                        >
                            不良嗜好
                        </InputItem>
                    </List>

                    <List renderHeader={() => "婚姻史"}>
                        <List.Item>
                            <View style = {{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <Text style = {{color:'#333',fontSize:px(34)}}>
                                    婚姻状况
                                </Text>
                                <RadioGroup
                                    onSelect = {(text)=>this.setState({
                                        marital:text
                                    })}
                                    style = {{flexDirection:'row',justifyContent:'space-between'}}
                                >
                                    {['已婚','未婚'].map((item,index) => (
                                        <RadioButton value={this.state.marital} key = {index}>
                                            <Text style = {{color:'#333'}}>{item}</Text>
                                        </RadioButton>
                                    ))}
                                </RadioGroup>
                            </View>

                        </List.Item>

                        <List.Item styles={newListStyle}>
                            <View style = {{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <Text style = {{color:'#333',fontSize:px(34)}}>
                                    配偶健康状况
                                </Text>
                                <RadioGroup
                                    onSelect = {(text)=>this.setState({
                                        mate:text
                                    })}
                                    style = {{flexDirection:'row',justifyContent:'space-between'}}
                                >
                                    {['良好','差'].map((item,index) => (
                                        <RadioButton value={this.state.mate} key = {index}>
                                            <Text style = {{color:'#333'}}>{item}</Text>
                                        </RadioButton>
                                    ))}
                                </RadioGroup>
                            </View>
                        </List.Item>

                        <InputItem
                            clear
                            labelNumber={4}
                            type = "number"
                            styles={newStyle}
                        >
                            结婚年龄
                        </InputItem>

                    </List>

                    <List renderHeader={() => "家族史"}>
                        <TextareaItem
                            {...getFieldProps('familyHistory', {
                                initialValue:familyHistory
                            })}
                            rows={6}
                            />
                    </List>

                    <List renderHeader={() => "家族史"}>
                        <InputItem
                            clear
                            styles={newStyle}
                        >
                            体温
                        </InputItem>
                        <InputItem
                            clear
                            styles={newStyle}
                        >
                            脉搏
                        </InputItem>
                        <InputItem
                            clear
                            styles={newStyle}
                        >
                            呼吸
                        </InputItem>
                        <InputItem
                            clear
                            styles={newStyle}
                        >
                            血压
                        </InputItem>
                        <View style = {{
                            height:px(250),backgroundColor:'#fff',justifyContent:'space-between',
                            paddingLeft:px(30),paddingRight:px(30),flexDirection:'row',
                            alignItems:'center'}}>

                            <TouchableOpacity style = {{
                                height:px(200),width:px(200),
                                flexDirection:'row',alignItems:'center',
                                justifyContent:'center',borderWidth:px(1),borderColor:'#eee'}}
                                onPress = {()=>this._selectImage()}
                            >
                                <Ionicons name="ios-add" size={60} color='#eee'/>
                            </TouchableOpacity>

                        </View>
                    </List>
                    <List  renderHeader={() => "辅助检查"}>
                        <TextareaItem
                            {...getFieldProps('examination', {
                                initialValue:examination
                            })}
                            rows={6}
                        />
                    </List>

                </ScrollView>

            </View>
        );
    }
}

export default createForm()(CaseEditScreen)