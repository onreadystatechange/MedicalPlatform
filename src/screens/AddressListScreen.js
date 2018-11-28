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
import { View,Text,TouchableOpacity,Image,StyleSheet,TouchableWithoutFeedback} from 'react-native';
import {connect} from "react-redux";
import Images from  '../themes/Images';
import Colors from '../themes/Colors';
import {StickySearchList} from '../components'
import _ from 'lodash';
import  {CommonTitle,HeadPortrait}from '../components'
import  GetFriendListType from '../redux/GetFriendList';
var Pinyinuntils = require('../utils/PinyinUntils');

const sortData = (arrData) =>{
    const arr = [];
    arrData && Array.isArray(arrData) && arrData.map((item,index)=> {
        arr.push( ToCapitalization(Pinyinuntils.getCamelChars(
            item.remark?item.remark:(item.pname || item.dname)
        )));
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

const dataDirect = (arr,arrData) =>{
    const arr1 = sortData(arr);
    const arr2 = [];
    for(let i = 0;i<arr1.length;i++) {
        arr2.push({});
    }
    for(let i = 0;i<arr1.length;i++){
        for(let j = 0;j<arr.length;j++){
            if(ToCapitalization(Pinyinuntils.getCamelChars(
                     arr[j].remark?arr[j].remark:(arr[j].pname || arr[j].dname)
                )) === arr1[i]){
                if(!arr2[i][arr1[i]]){
                    arr2[i][arr1[i]] = [];
                }
                arr2[i][arr1[i]].push(arr[j])
            }
        }
    }
    return arr2;
}

@connect(
    state =>({
        friendList:state.friendList
    }),
    {
        getPfriendList:GetFriendListType.getPfriendList,
        getDfriendList:GetFriendListType.getDfriendList
    }
)
export default class AddressListScreen extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            search:'doctor',
            dataPatient:[],
            dataDoctor:[]
        };
    }

    componentDidMount(){
        // this.props.getPfriendList();
        // this.props.getDfriendList();

    //     console.log()
    //     const arrPatient = dataDirect(patient,this.state.groupData);
    //     const arrDoctor = dataDirect(doctor,this.state.groupData);
    //     this.setState({
    //         dataPatient:arrPatient,
    //         dataDoctor:arrDoctor
    //     })
    }

    _handleClick(search){
        this.setState((prevState)=>{
            if(prevState.search !== search){
                return {
                    search
                }
            }
        })
    };

    _renderTabs(){
        return(
            <View style = {{width:px(520),
                height:px(60),
                flexDirection:'row',
                borderBottomRightRadius:px(28),
                borderTopRightRadius:px(28),
                borderTopLeftRadius:px(28),
                borderBottomLeftRadius:px(28),
                alignItems:'center'}}>

                <TouchableWithoutFeedback
                    onPress = {()=>this._handleClick('doctor')}

                >
                    <View
                        style = {{
                            flex:1,
                            borderTopLeftRadius:px(28),
                            borderBottomLeftRadius:px(28),
                            backgroundColor:this.state.search === 'doctor'?Colors.navBarColor:'#fff',
                            borderWidth:px(1),
                            height:px(60),
                            alignItems:'center',
                            borderColor:Colors.navBarColor,
                            justifyContent:'center',
                        }}
                    >
                        <Text
                            style = {[this.state.search === 'doctor'?styles.activeTextColor:styles.defaultTextColor]}
                        >
                            医生
                        </Text>
                    </View>

                </TouchableWithoutFeedback>


                <TouchableWithoutFeedback

                    onPress = {()=>this._handleClick('patient')}
                >
                    <View
                        style = {{
                            flex:1,
                            borderColor:Colors.navBarColor,
                            borderBottomRightRadius:px(28),
                            borderWidth:px(1),
                            borderTopRightRadius:px(28),
                            backgroundColor:this.state.search === 'patient'?Colors.navBarColor:'#fff',
                            height:px(60),
                            alignItems:'center',
                            justifyContent:'center',
                        }}
                    >
                        <Text
                            style = {[this.state.search === 'patient'?styles.activeTextColor:styles.defaultTextColor]}
                        >
                            患者
                        </Text>
                    </View>

                </TouchableWithoutFeedback>


            </View>
        )
    }

    _renderHeader(){
        const {navigation:{goBack,navigate}} = this.props;
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
                }} onPress = {()=> navigate('NewFriendScreen')}>
                    <View>
                        <Image source = {Images.add_new_friend} style = {{width:px(80),height:px(80),borderRadius:px(10)}}/>
                    </View>
                    <View style = {{width:px(30)}}/>
                    <View style = {{flex:1,flexDirection:'row',alignItems:'center'}}>
                        <Text style = {{fontSize:px(32),color:'#333'}}>
                            新的朋友
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style = {{height:px(1),backgroundColor:'#eee'}}/>
            </View>
        )
    }

    _handlePress = (item)=>{
        const search = this.state.search;
        const {navigation:{goBack,navigate}} = this.props;
        console.log(item);
        const {id} = item;
        if(search === 'patient'){
            navigate('PatientFriendDetailScreen',{
                item:id
            })
        }else{
            navigate('DoctorFriendDetailScreen',{
                item:id
            })
        }
    }

    _renderRow (data, sectionID, rowID, highlightRow) {
        // console.log(data, sectionID, rowID, highlightRow);
        const keys = _.keys(data)[0];
        return (
            <View
                style = {{width:width,backgroundColor:'#fff'}}
            >
                <View style = {{height:px(50), paddingRight:px(30),paddingLeft:px(30),flexDirection:'row',alignItems:'center',backgroundColor:Colors.transparent,justifyContent:'flex-start'}}>
                    <Text style={{ fontSize: px(30),color:'#333' }}>{keys}</Text>
                </View>
                {!!data[keys] && Array.isArray(data[keys]) && data[keys].map((item,index) =>(
                    <View key = {index}>
                        <TouchableOpacity style = {{
                            flexDirection:'row',
                            alignItems:'center',
                            justifyContent:'flex-start',
                            height:px(130),
                            paddingRight:px(30),paddingLeft:px(30),
                        }} onPress = {() =>this._handlePress(item)} >
                            <HeadPortrait imageurl = {item.imageurl}/>
                            <View style = {{width:px(30)}}/>
                            <View style = {{flex:1,flexDirection:'row',alignItems:'center'}}>
                                <Text style = {{fontSize:px(32),color:'#333'}}>
                                    {item.remark?item.remark:(item.pname||item.dname)}
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
        const {navigation:{goBack,navigate}} = this.props;
        const patient =  this.props.friendList.patient.infos;
        const doctor =  this.props.friendList.doctor.infos;
        console.log(patient,doctor);
        console.log(dataDirect(doctor,[]))
        return (
            <View style={{flex: 1,backgroundColor:Colors.transparent}}>
                <CommonTitle
                    title = "联系人"
                    leftView = {
                        <TouchableOpacity activeOpacity={1} >
                            <View >

                            </View>
                        </TouchableOpacity>

                    }
                    rightView = {
                        <TouchableOpacity activeOpacity={1} onPress = {()=> navigate('SearchScreen',{search:this.state.search})}>
                            <View >
                                <Image source = {Images.add_friend_transparent} style = {{height:px(42),width:px(42)}}/>
                            </View>
                        </TouchableOpacity>
                    }
                />
                <View>
                    <View style = {{width:width,height:px(100),flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}>
                        {this._renderTabs()}
                    </View>


                </View>
                <StickySearchList
                    setVerticalScrollBarEnabled = {false}
                    _handlePress = {this._handlePress}
                    renderHeader = {()=>
                        this._renderHeader()
                    }
                    search = {this.state.search}
                    renderRow={this._renderRow}
                    searchBarTextStyle = {{
                        color:'#333',
                        fontSize:px(28)
                    }}
                    data = {this.state.search === "doctor"?dataDirect(doctor,[]): dataDirect(patient,[])}
                    searBarShow = {true}
                />
            </View>
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