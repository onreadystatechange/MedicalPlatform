/**
 * Created by yjy on 2017/12/9.
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
import { View,Text,TouchableOpacity,Image,TextInput,TouchableNativeFeedback,StyleSheet,ScrollView,ToastAndroid,Animated,Keyboard} from 'react-native';
import {List,Modal} from 'antd-mobile'
import {connect} from "react-redux";
import Images from  '../../themes/Images';
import Colors from '../../themes/Colors';
import {ExpandableList,InputItem,StickySearchList} from '../../components';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import  {CommonTitle,CommonModal,HeadPortrait}from '../../components'
import GetPatientListAction from '../../redux/GetPatientList'
import {setStore ,getStore, clearStore} from '../../libs/Storage'
import {uploadAvatar,baseImgUrl} from '../../configs/BaseConfig'
import  http from '../../libs/fetch'
import  UserInfoActionType from '../../redux/UserInfo';
import  {px,width} from "../../libs/CSS"
import _ from 'lodash';
var Pinyinuntils = require('../../utils/PinyinUntils');
import CheckBox from 'react-native-check-box'

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
const sortData = (arrData) =>{
    const arr = [];
    arrData && Array.isArray(arrData) && arrData.map((item,index)=> {
        arr.push( ToCapitalization(Pinyinuntils.getCamelChars( item.remark?item.remark:item.pname || item.dname )));
    });
    console.log(Array.from(new Set(arr)).sort());
    return  Array.from(new Set(arr)).sort();
};

const ToCapitalization = (str)=>{
    if(str.length>0){
        var first = str.substr(0,1).toUpperCase();
        return first;
    }
};

const dataDirect = (arr,arrData ) =>{
    arr = _.cloneDeep(arr);
    const arr1 = sortData(arr);
    const arr2 = [];
    for(let i = 0;i<arr1.length;i++) {
        arr2.push({});
    }
    for (let j = 0; j < arr.length; j++) {
        arr[j].checked = false;
    }

     arrData.map((item, index) => {
         for (let j = 0; j < arr.length; j++) {
             console.log(item,arr[j])
            if (item.patientid === arr[j]['id'] || item.id === arr[j]['id']){
                arr.remove(j);
            }
         }
    })

    for(let i = 0;i<arr1.length;i++) {
        for (let j = 0; j < arr.length; j++) {
            if (ToCapitalization(Pinyinuntils.getCamelChars(arr[j].remark ?arr[j].remark : arr[j].dname || arr[j].pname)) === arr1[i]) {
                if (!arr2[i][arr1[i]]) {
                    arr2[i][arr1[i]] = [];
                }
                arr2[i][arr1[i]].push(arr[j])
            }
        }
    }
    return arr2;
}


export default class ModalSelectPersion extends Component {
    state = {
        visible:false,
        data:null,
        selectArray: [],
        groupData:[],
        dataInfo:null,
        selectItems:[]
    }

    dataInfo = null

    async componentDidMount(){
        const type = this.props.type;
        let url = '';
        if(type === 'doctor'){
            url = 'friend/doctors'
        }else{
            url = 'friend/patients'
        }
        let data =  await http(url,{
            body:{
                size:10000
            }
        },true);
        const dataInfo = data.infos;
        this.dataInfo = data.infos;
        console.log(dataInfo);
        console.log(this.props.groupData);
        const arr = dataDirect(dataInfo,this.state.groupData);
        this.setState({
            dataInfo,
            data:arr
        })
    }

     change(groupData){
        console.log(groupData);
        const dataInfo = this.state.dataInfo;
        console.log(dataInfo);
        if(!!groupData && Array.isArray(groupData) && groupData.length >0){
            this.setState({
                data:dataDirect(dataInfo,groupData)
            })
        }else{
            this.setState({
                data:dataDirect(dataInfo,[])
            })
        }
    }


    _handleClick(item,index){
        item.checked = !item.checked;
        let selectArray = this.state.selectArray;
        let selectItems = this.state.selectItems;
        if(item.checked ){
            selectArray.push(item.id);
            selectItems.push(item);
        }else{
            selectArray =  _.pull(selectArray, item.id);
            selectItems = _.pull(selectItems,item);
        }

       this.setState({
           selectItems,
           selectArray
       })
    }



    _renderRow (data, sectionID, rowID, highlightRow) {
        const keys = _.keys(data)[0];
        console.log(data[keys]);
        return (
            <View
                style = {{width:width,backgroundColor:'#fff'}}
            >
                <View style = {{height:px(50), paddingRight:px(30),paddingLeft:px(30),flexDirection:'row',alignItems:'center',backgroundColor:Colors.transparent,justifyContent:'flex-start'}}>
                    <Text style={{ fontSize: px(30),color:'#333' }}>{keys}</Text>
                </View>
                {!!data[keys] && Array.isArray(data[keys]) && data[keys].map((item,index) =>
                    <View key = {index}>
                        <View style = {{
                            flexDirection:'row',
                            alignItems:'center',
                            justifyContent:'flex-start',
                            height:px(130),
                            paddingRight:px(30),paddingLeft:px(30),
                        }} >
                            <HeadPortrait imageurl = {item.imageurl}/>
                            <View style = {{width:px(30)}}/>
                            <View style = {{flex:1,flexDirection:'row',alignItems:'center'}}>
                                <Text style = {{fontSize:px(32),color:'#333'}}>
                                    {item.remark?item.remark:item.pname || item.dname}
                                </Text>
                            </View>

                            <CheckBox
                                style={{flex: 1,justifyContent:'center',flexDirection:'row',marginLeft:px(180)}}
                                isChecked={item.checked}
                                leftText=''
                                disabled = {item.disabled}
                                checkedImage={<Image source={Images.checkbox_checked} style={{width:px(35),height:px(35)}}/>}
                                unCheckedImage={<Image source={Images.checkbox_unchecked} style={{width:px(35),height:px(35)}}/>}
                                onClick={() => this.handleClick(item,index)}
                            />

                        </View>
                        <View style = {{height:px(1),backgroundColor:'#eee'}}/>
                    </View>

                )}

            </View>
        )
    }




    show = () =>{
        if(this.props.add){
            this.setState({
                visible:true,
                selectArray:[],
                selectItems:[]
            })
        }else{
            this.setState({
                visible:true,
            })
        }
    }

    close=()=>{
        if(this.props.add){
            this.setState({
                visible:false,
                selectArray:[],
                selectItems:[]
            })
        }else{
            this.setState({
                visible:false,
            })
        }
    }



    handleSubmit =()=>{
        if(this.state.selectArray.length <= 0){
            ToastAndroid.show('请选择分组成员',ToastAndroid.SHORT);
            return;
        }
        this.props.ok && this.props.ok(this.state.selectArray,this.state.selectItems);
        this.close();
    }

    render() {
        const {data} = this.state;
        console.log(data);
        const isEmpty = () => !!data && data.every((item) =>JSON.stringify(item) === "{}");
       const Empty = isEmpty();
        return (
            <Modal  style={{flex: 1,backgroundColor:Colors.transparent}} transparent={false} visible={this.state.visible} animationType="slide-up" onClose={this.close}>
                <View>
                    <CommonTitle
                        title = "添加分组成员"
                        leftView = {
                            <TouchableOpacity activeOpacity={1} onPress = {this.close}>
                                <View >
                                    <Image source = {Images.back} style = {{width:px(28),height:px(48)}} />
                                </View>
                            </TouchableOpacity>

                        }
                        rightView = {
                            !Empty && <TouchableOpacity activeOpacity={1} onPress = {this.handleSubmit}>
                                <View >
                                    <Text style = {{color:'#fff',fontSize:px(36),opacity:0.8}}>
                                        确定
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        }
                    />

                </View>

                {!Empty?<StickySearchList
                    setVerticalScrollBarEnabled = {false}
                    renderRow={this._renderRow}
                    searchBarTextStyle = {{
                        color:'#333',
                        fontSize:px(28)
                    }}
                    data = {data}
                    searBarShow = {true}
                    handleClick = {(item,index) => this._handleClick(item,index)}
                />:<View style = {{justifyContent:'center',alignItems:'center',flex:1}}>
                    <Text style = {{fontSize:px(32),color:'#999'}}>
                            已添加全部好友
                    </Text>
                </View>}
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    activeStyle:{
        backgroundColor:Colors.navBarColor
    },
    activeTextColor:{
        color:'#fff'
    },
    defaultTextColor:{
        color:Colors.navBarColor
    },
    defaultStyle:{
        backgroundColor:'#fff'
    }
});