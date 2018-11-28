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
import { View,Text,TouchableOpacity,Image} from 'react-native';
import {connect} from "react-redux";
import {Images,Colors} from  '../themes';
import  {getLabel,getGenderType} from '../utils/DataDict'
import  {CommonTitle,Button}from '../components'
import  {baseImgUrl} from '../configs/BaseConfig'
import  http from '../libs/fetch'
const select = state => ({});
@connect(select)
export default class SearchResultPatient extends Component {
    state = {
        data:{
            doctor:{
                dname:'',
                pname:''
            }
        }
    }

   async componentDidMount(){
        const item = this.props.navigation.state.params.item;
        let data = await http(`friend/search/qrcode/${item}`);
        this.setState({
            data:data
        })
    }

    render() {
        const {navigation:{goBack,navigate}} = this.props;
        const {pname,imageurl,id,sex,dname,pnickname,dnickname} = this.state.data.doctor || this.state.data.patient;
        console.log(this.state.data.doctor || this.state.data.patient);
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
                <View style = {{height:px(30)}}/>
                <View style = {{backgroundColor:'#fff',flexDirection:'row',
                    alignItems:'center',paddingLeft:px(30),paddingTop:px(30),paddingBottom:px(30),justifyContent:'flex-start'
                }}>
                    <View>
                        {
                            !!imageurl?<Image source = {{uri:baseImgUrl+imageurl}} style = {{width:px(96),height:px(96),borderRadius:px(10)}}/>:
                                <Image source = {Images.default_hdimg} style = {{width:px(96),height:px(96),borderRadius:px(10)}}/>
                        }
                    </View>
                    <View style = {{width:px(30)}}/>
                    <View style = {{flexDirection:'column'}}>
                        <Text style = {{color:'#333',fontSize:px(32)}}>
                            {pnickname || dnickname}
                        </Text>
                        <View style = {{height:px(5)}}/>
                        <Text style = {{fontSize:px(28),color:'#999'}}>
                            性别：{getLabel(getGenderType(),sex)}
                        </Text>
                    </View>
                </View>
                <View style = {{height:px(20)}}/>
                <View style = {{flexDirection:'row',backgroundColor:'#fff',paddingRight:px(30),paddingLeft:px(30),height:px(100),alignItems:'center',justifyContent:'space-between'}}>
                    <Text style = {{color:'#333',fontSize:px(32)}}>
                        {sex === 0?'他':'她'}的姓名
                    </Text>
                    <TouchableOpacity style = {{height:px(100),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                        <Text style = {{color:'#999',fontSize:px(32)}}>
                            {pname || dname}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style = {{height:px(20)}}/>
                <View style = {{flex:1,backgroundColor:'#fff'}}>
                    <View style = {{height:px(50)}}/>
                    <View style = {{paddingRight:px(90),paddingLeft:px(90)}}>
                        <Button
                            text = "加为好友"
                            onPress = {() => navigate('FriendRequestScreen',{
                                item:id
                            })}
                        />
                    </View>
                </View>
            </View>
        );
    }
}