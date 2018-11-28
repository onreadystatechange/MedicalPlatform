/**
 * Created by yjy on 2017/10/9.
 */

import React, { Component } from 'react';
import { View,Text,TouchableOpacity,Image,ScrollView,ToastAndroid} from 'react-native';
import {connect} from "react-redux";
import {NavigationActions} from 'react-navigation';
import {Images,Colors} from  '../themes';
import  {CommonTitle,ModalSickList,ModalSelectPersion}from '../components'
import  GetMemberType from '../redux/GetMemberList';
import {baseImgUrl} from '../configs/BaseConfig'
import http from '../libs/fetch'
import CountEmitter from './../libs/CountEmitter';
import  GetDiscussType from '../redux/GetDiscussList';
@connect(state =>({
    payload:state.user.doctor || {},
    disscussPO:state.member.disscussPO || {},
    disscussDoctorPOList:state.member.disscdisscussDoctorPOListussPO || [],
    nav:state.nav || {}
}),{
    getMemberList:GetMemberType.getMemberList,
    getDiscuss:GetDiscussType.getDiscussList
})
export default class GroupInfoScreen extends Component {
    state  ={
        result:''
    }

    componentDidMount(){
        const item = this.props.navigation.state.params.item;
        const {id} = item;
        this.props.getMemberList(id);
    }

    addMember = (selectArray,selectItems)=>{
        console.log(selectArray,selectItems);
        const item = this.props.navigation.state.params.item;
        const {id} = item;
        if(!!selectArray && Array.isArray(selectArray) && selectArray.length > 0){
            http(`dus/editAddPerson/add/${id}`,{method:'put',body:{
                dlist: selectArray
            }}).then(data =>{
                this.props.getMemberList(id);
                ToastAndroid.show('添加成功',ToastAndroid.SHORT);
            })
        }
    }

    deleteMember(deleteId){
        const item = this.props.navigation.state.params.item;
        const {id} = item;
        http(`dus/editDelPerson/move/${id}`,{
            method:'delete',
            body:{
                dlist: [
                    deleteId
                ]
            }
        }).then(data => {
            ToastAndroid.show('移除成功',ToastAndroid.SHORT);
            this.props.getMemberList(id);
        }).catch(e => console.log(e))
    }

    deleteDiscussion(){
        const doctorId = this.props.payload.id;
        const type = 'myOwner';
        const {navigation:{goBack,navigate},disscussPO:{doctorList,item,id,owner,confirmpersonid,confirmresults,ifconfirmperson},disscussDoctorPOList} = this.props;
        http(`dus/deleteDiss/${type}/${id}/${doctorId}`,{
            method:'delete'
        }).then(data => {
            ToastAndroid.show('解散成功',ToastAndroid.SHORT);
            this.props.getDiscuss(doctorId);
            goBack(this.props.navigation.state.params.keys.B_key);
        }).catch(e => console.log(e))
    }


    assignMember(newDoctorId){
        const {navigation:{goBack,navigate},disscussPO:{doctorList,item,id,owner,confirmpersonid,confirmresults,ifconfirmperson},disscussDoctorPOList} = this.props;
        http(`dus/updateWang/${id}/${confirmpersonid}/${newDoctorId}`,{
            method:'put',
            body:{

            }
        }).then(data => {
            ToastAndroid.show('指定成功',ToastAndroid.SHORT);
            this.props.getMemberList(id);
        }).catch(e => console.log(e))
    }

    renderItem(item,index,confirm,confirmpersonid){
        const {creatTime,imageurl,dname,remark,id} = item;
        const {navigation:{goBack,navigate},disscussPO:{doctorList,owner},disscussDoctorPOList} = this.props;
        const self = owner === id;
        const me = this.props.payload.id === id;
        return(
            <View
                style = {{width:width,backgroundColor:'#fff', paddingRight:px(30),paddingLeft:px(30)}}
                key = {index}
            >
                <TouchableOpacity style = {{
                    flexDirection:'row',
                    alignItems:'center',
                    justifyContent:'flex-start',
                    height:px(130),
                }} onPress = {()=> {if(id !== this.props.payload.id){
                    CountEmitter.emit('gopage',id,'doctor')
                }}}>
                    <View>
                        <Image source = {{uri:baseImgUrl+imageurl}} style = {{width:px(80),height:px(80),borderRadius:px(10)}}/>
                    </View>
                    <View style = {{width:px(30)}}/>
                    <View style = {{flex:1,flexDirection:'row',alignItems:'center'}}>
                        <Text style = {{fontSize:px(32),color:'#333'}}>
                            {me?'我':remark || dname}
                        </Text>
                    </View>
                    { !self && confirm &&
                        <View style = {{height:px(100),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <View style = {{width:px(30)}}/>
                            <TouchableOpacity onPress = {()=>this.deleteMember(id)}>
                                <View style = {{width:px(120),height:px(50),flexDirection:'row',
                                    borderColor:'#999',borderWidth:px(1),borderRadius:px(23),
                                    alignItems:'center',justifyContent:'center'}}>
                                    <Text style = {{color:'#999',fontSize:px(32)}}>
                                        移除
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style = {{width:px(30)}}/>
                            {confirmpersonid === id?<TouchableOpacity>
                                <View style = {{width:px(120),height:px(50),flexDirection:'row',
                                    alignItems:'center',justifyContent:'center'}}>
                                    <Text style = {{color:'#999',fontSize:px(32)}}>
                                        已指定
                                    </Text>
                                </View>
                            </TouchableOpacity>:<TouchableOpacity onPress = {()=>this.assignMember(id)}>
                                <View style = {{width:px(120),height:px(50),flexDirection:'row',
                                    borderColor:Colors.navBarColor,borderWidth:px(1),borderRadius:px(23),
                                    alignItems:'center',justifyContent:'center'}}>
                                    <Text style = {{color:Colors.navBarColor,fontSize:px(32)}}>
                                        指定
                                    </Text>
                                </View>
                            </TouchableOpacity>}

                        </View>
                    }
                    {self &&<TouchableOpacity style = {{height:px(100),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                        <Text style = {{color:'#999',fontSize:px(32)}}>
                            帮主
                        </Text>
                    </TouchableOpacity>}
                </TouchableOpacity>
                <View style = {{height:px(1),backgroundColor:'#eee'}}/>
            </View>

        )
    }

    render() {
        // const item = this.props.navigation.state.params.item;
        const {data} = this.state;
        const {navigation:{goBack,navigate},disscussPO:{doctorList,item,owner,confirmpersonid,confirmresults,ifconfirmperson},disscussDoctorPOList} = this.props;
        // const {pname,imageurl,id,sex} = item;
        const confirm = owner === this.props.payload.id;
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
                        <TouchableOpacity onPress = {()=>this.deleteDiscussion()}>
                            {confirm  && <View >
                                <Text style = {{ color: 'white', fontSize: px(36)}}>
                                    解散
                                </Text>
                            </View>}
                        </TouchableOpacity>

                    }
                    title= {`群组成员(${!!doctorList && doctorList.length})`}
                />

                <ScrollView style = {{flexDirection:'column'}}>
                    <View style = {{height:px(30)}}/>
                    <View style = {{flexDirection:'row',backgroundColor:'#fff',paddingRight:px(30),paddingLeft:px(30),height:px(100),alignItems:'center',justifyContent:'space-between'}}>
                        <Text style = {{color:'#333',fontSize:px(32)}}>
                            群聊名称
                        </Text>
                        <TouchableOpacity style = {{width:px(100),height:px(100),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <Text style = {{color:'#999',fontSize:px(32)}}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style = {{height:px(30)}}/>
                    {
                        confirm && <View
                            style = {{width:width,backgroundColor:'#fff',paddingRight:px(30),paddingLeft:px(30)}}
                        >
                            <TouchableOpacity style = {{
                                flexDirection:'row',
                                alignItems:'center',
                                justifyContent:'flex-start',
                                height:px(130),
                            }} onPress = {()=>{
                                this._ModalSelect.change(doctorList);
                                this._ModalSelect.show();
                            }}>
                                <View>
                                    <Image source = {Images.add_new_friend} style = {{width:px(80),height:px(80),borderRadius:px(10)}}/>
                                </View>
                                <View style = {{width:px(30)}}/>
                                <View style = {{flex:1,flexDirection:'row',alignItems:'center'}}>
                                    <Text style = {{fontSize:px(32),color:'#333'}}>
                                        添加分组成员
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style = {{height:px(1),backgroundColor:'#eee'}}/>
                        </View>
                    }

                    {doctorList && doctorList.map((item,index)=>this.renderItem(item,index,confirm,confirmpersonid))}

                    <View style = {{height:px(88)}}/>
                </ScrollView>
                {/*<View style = {{justifyContent:'center',paddingLeft:px(85),backgroundColor:'#fff',paddingRight:px(85)}}>*/}
                    {/*<Button text ="解散讨论组" onPress = {() => console.log(1)} />*/}
                {/*</View>*/}

                <ModalSelectPersion
                    ref = {(ref) => this._ModalSelect = ref}
                    ok = {this.addMember}
                    type = 'doctor'
                    groupData = {doctorList && Array.isArray(doctorList)?doctorList:[]}
                />
            </View>

        );
    }
}