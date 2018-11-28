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
import { View,Text,TouchableOpacity,Image,ToastAndroid,ScrollView} from 'react-native';
import {connect} from "react-redux";
import {Images,Colors} from  '../themes';
import  {getLabel,genderTitleId,getGenderType} from '../utils/DataDict'
import  {CommonTitle,Button,HeadPortrait,ModalChangeRemark,CommonModal,ModalBusinessCard}from '../components'
import {baseImgUrl} from '../configs/BaseConfig'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import  GetFriendListType from '../redux/GetFriendList';
import  FriendRequestService from '../realm/service/FriendRequestService'
import  http from '../libs/fetch'
import SingleMessageService from '../realm/service/SingleMessageService'
import AllUserMesService from '../realm/service/AllUserMesService'
import TimeUtil from '../utils/TimeUtil';
@connect(
    state =>({
        friendList:state.friendList,
        payload:state.user.doctor || {}
    }),
    {
        getPfriendList:GetFriendListType.getPfriendList,
        getDfriendList:GetFriendListType.getDfriendList
    }
)

export default class DoctorFriendDetailScreen extends Component {

    state = {
        data:{
            dname:'',
            imageurl:'',
            id:'',
            sex:1,
            dnickname:'',
            remark:''
        },
        selectItems:{},
        visible:false,
    }

    componentDidMount(){
        this._getInitdata()
    }

    _getInitdata = ()=>{
        const item = this.props.navigation.state.params.item;
        const id = item;
        http(`friend/doctor/${id}`,{
            method:'get',
            body:{

            }
        }).then(data => {
            console.log(data);
            this.setState({
                data:data.doctor
            })
        }).catch(e => console.log(e))
    }

    _changeRemark = ()=>{
        this._remark.show();
    }

    _ok=(changeRemark)=>{
        const {navigation:{goBack,navigate}} = this.props;
        const {dname,imageurl,id,sex,dnickname,remark} = this.state.data;
        if(!changeRemark && changeRemark.length <= 0 ){
            ToastAndroid.show('请输入好友备注',ToastAndroid.SHORT);
            return;
        }
        http(`friend/update/${id}?remark=${changeRemark}`,{
            method:'put',
            body:{

            }
        }).then(data => {
            ToastAndroid.show('修改备注成功',ToastAndroid.SHORT);
            this.props.getDfriendList();
            this._getInitdata();
            this._remark.close();
        }).catch(e => console.log(e))
    }

    _handleClick = () =>{
        this._modal.show();
    }

    _onOk = ()=>{
        const {navigation:{goBack,navigate}} = this.props;
        const {pname,imageurl,id,sex,pnickname,remark} = this.state.data;
        http(`friend/delete/doctor/${id}`,{
            method:'delete',
            body:{

            }
        }).then(data => {
            ToastAndroid.show('删除好友成功',ToastAndroid.SHORT);
            const {navigation:{goBack,navigate}} = this.props;
            FriendRequestService.deleteFriends(id);
            this.props.getDfriendList();
            goBack(null);
        }).catch(e => console.log(e))
    }

    _onSelect = selectItems => {
        this.setState({
            selectItems:selectItems,
            visible:true
        })
    };

    _navigateSendCard(){
        const {navigation:{goBack,navigate}} = this.props;
        const {imageurl,pname,remark,sex} = this.state.data;
        navigate('ChooseSCPersonScreen',{ onSelect: this._onSelect,items:this.state.data});
    }

    _sendTextMessage(txt,type) { // 发送文本消息
        const {selectItems} = this.state;
        const {imageurl,pname,remark,sex,id,dname} = this.state.selectItems;
        let error = false;
        const textId = WebIM.conn.getUniqueId();                 // 生成本地消息id
        const msg = new WebIM.message('txt', textId);// 创建文本消息
        let  message={};
        message.type='text';
        let identity;
        !!pname?identity = 'patient':identity = 'doctor';
        message.content={
            type:type,
            data:txt,
            identity,
            time:TimeUtil.currentTime()
        };
        let data=JSON.stringify(message);
        msg.set({
            msg: data,                  // 消息内容
            to:id,                    // 接收消息对象（用户id）
            roomType: false,
            success:  (id, serverMsgId)=>{
                error = false;
                if(type === 'card'){
                    txt = JSON.stringify(txt);
                }
                SingleMessageService.save(
                    {
                        id:msg.body.id,
                        content:txt,
                        msgType:type,
                        fromname:'我',
                        fromId:this.props.payload.id,
                        imageurl:this.props.payload.imageurl,
                        read:true,
                        time:TimeUtil.currentTime(),
                        uniqueId:this.props.payload.id+'-'+selectItems.id,
                        error
                    }
                );
                if(!error){
                    AllUserMesService.save({
                        id:this.props.payload.id,
                        label:remark || pname || dname,
                        lastMessage:txt,
                        time:TimeUtil.formatChatTime(TimeUtil.currentTime()),
                        number:0,
                        imageurl:imageurl,
                        msgType:type,
                        uniqueId:this.props.payload.id+'-'+selectItems.id,
                        isMe:true,
                        chatId:selectItems.id
                    })
                }
                console.log('发送成功',message,serverMsgId,id);
            },
            fail: (e)=>{
                error = true;
                console.log("发送失败");
            }
        });
        msg.body.chatType = 'singleChat';
        WebIM.conn.send(msg.body);
    }

    _close(){
        this.setState({
            visible:false
        })
    }

    render() {
        const {data:{dname,imageurl,id,sex,hospital,dnickname,titleid,profile,remark,department}} = this.state;
        const {navigation:{goBack,navigate}} = this.props;
        const {selectItems} = this.state;
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
                        <TouchableOpacity activeOpacity={1} onPress = {()=> this._navigateSendCard()}>
                            <View >
                                <Image source = {Images.transpond} style = {{height:px(42),width:px(42)}}/>
                            </View>
                        </TouchableOpacity>
                    }
                    title= '详细资料'
                />
                <ScrollView>
                <View style = {{height:px(30)}}/>
                <View style = {{backgroundColor:'#fff',flexDirection:'row',
                    alignItems:'center',paddingLeft:px(30),paddingTop:px(30),paddingBottom:px(30),justifyContent:'flex-start'
                }}>
                    <View>
                        {!!imageurl?
                            <Image source = {{uri:baseImgUrl + imageurl}} style = {{width:px(96),height:px(96),borderRadius:px(10)}}/>:
                            <Image source = {Images.default_hdimg} style = {{width:px(96),height:px(96),borderRadius:px(10)}}/>
                        }
                    </View>
                    <View style = {{width:px(30)}}/>
                    <View style = {{flexDirection:'column'}}>
                        <Text style = {{color:'#333',fontSize:px(32)}}>
                            {dname}
                        </Text>
                        <View style = {{height:px(5)}}/>
                        <Text style = {{fontSize:px(28),color:'#999'}}>
                            性别：{getLabel(getGenderType(),sex)}
                        </Text>
                    </View>
                </View>
                <View style = {{height:px(20)}}/>
                <View style ={{backgroundColor:'#fff',paddingRight:px(30),paddingLeft:px(30)}}>
                    <View style = {{flexDirection:'row',height:px(100),alignItems:'center',justifyContent:'space-between'}}>
                        <Text style = {{color:'#333',fontSize:px(32)}}>
                            好友备注
                        </Text>
                        <TouchableOpacity style = {{height:px(100),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}
                                          onPress = {this._changeRemark}
                        >
                            <Text style = {{color:'#999',fontSize:px(32)}}>
                                {!!remark?remark:'无'}
                            </Text>
                            <View style = {{width:px(20)}} />
                            <Ionicons name="ios-arrow-forward-outline" size={20} color='#999'/>
                        </TouchableOpacity>
                    </View>

                    <View style = {{flexDirection:'row',backgroundColor:'#eee'
                        ,height:px(1)}}/>
                    <View style = {{flexDirection:'row'
                        ,height:px(100),alignItems:'center',justifyContent:'space-between'}}>
                        <Text style = {{color:'#333',fontSize:px(32)}}>
                            好友姓名
                        </Text>
                        <View style = {{height:px(100),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}
                        >
                            <Text style = {{color:'#999',fontSize:px(32)}}>
                                {dname}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style = {{height:px(20)}}/>

                <View style ={{backgroundColor:'#fff',paddingRight:px(30),paddingLeft:px(30)}}>
                    <View style = {{flexDirection:'row',height:px(100),alignItems:'center',justifyContent:'space-between'}}>
                        <Text style = {{color:'#333',fontSize:px(32)}}>
                            所属医院
                        </Text>
                        <View style = {{height:px(100),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}
                        >
                            <Text style = {{color:'#999',fontSize:px(32)}}>
                                {hospital}
                            </Text>
                        </View>
                    </View>

                    <View style = {{flexDirection:'row',backgroundColor:'#eee'
                        ,height:px(1)}}/>
                    <View style = {{flexDirection:'row'
                        ,height:px(100),alignItems:'center',justifyContent:'space-between'}}>
                        <Text style = {{color:'#333',fontSize:px(32)}}>
                            所属科室
                        </Text>
                        <View style = {{height:px(100),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}
                        >
                            <Text style = {{color:'#999',fontSize:px(32)}}>
                                {department}
                            </Text>
                        </View>
                    </View>
                    <View style = {{flexDirection:'row',backgroundColor:'#eee'
                        ,height:px(1)}}/>
                    <View style = {{flexDirection:'row'
                        ,height:px(100),alignItems:'center',justifyContent:'space-between'}}>
                        <Text style = {{color:'#333',fontSize:px(32)}}>
                            个人职称
                        </Text>
                        <View style = {{height:px(100),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}
                        >
                            <Text style = {{color:'#999',fontSize:px(32)}}>
                                {getLabel(genderTitleId(),titleid)}
                            </Text>
                        </View>
                    </View>
                </View>

                    {!!profile &&profile.length >0&& <View style ={{flexDirection:'column',minHeight:px(230)}}>
                    <View style = {{flexDirection:'row'
                        ,height:px(100),paddingRight:px(30),paddingLeft:px(30),alignItems:'center',justifyContent:'space-between'}}>
                        <Text style = {{color:'#333',fontSize:px(32)}}>
                            个人简介
                        </Text>
                    </View>

                    <View style = {{minHeight:px(130),paddingTop:px(10),paddingBottom:px(10),paddingLeft:px(30),flex:1,backgroundColor:'#fff'}}>
                        <Text style = {{fontSize:px(28),color:'#999',lineHeight:px(48)}}>
                            {'       ' +profile
                               }
                        </Text>
                    </View>
                </View>}

                <View style = {{height:px(20)}}/>

                <View style = {{paddingTop:px(50),
                    paddingBottom:px(50),backgroundColor:'#fff',flexDirection:'row',justifyContent:'space-between',
                    paddingLeft:px(50),
                    paddingRight:px(50)}}>
                    <TouchableOpacity style = {{flex:1,height:px(70),
                        borderRadius:px(8),flexDirection:'row',alignItems:'center',
                        justifyContent:'center',borderWidth:px(1),borderColor:Colors.navBarColor}}
                                      onPress = {this._handleClick}
                    >
                        <Text style = {{color:Colors.navBarColor,fontSize:px(32)}}>
                            删除好友
                        </Text>
                    </TouchableOpacity>
                    <View style  ={{width:px(60)}}/>
                    <TouchableOpacity style = {{flex:1,height:px(70),
                        borderRadius:px(8),flexDirection:'row',alignItems:'center',
                        justifyContent:'center',backgroundColor:Colors.navBarColor}}
                      onPress = {
                          ()=>navigate('ChatScreen',{
                              item:this.state.data})
                      }
                    >
                        <Text style = {{color:'#fff',fontSize:px(32)}}>
                            和他聊聊
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style = {{flex:1,backgroundColor:'#fff'}}/>
                <ModalChangeRemark
                    ref = {(ref) =>this._remark = ref}
                    ok = {this._ok}
                    initValue = {this.state.data.remark}
                />
                <CommonModal
                    content = "确定要删除好友吗"
                    ref = {(ref) =>this._modal = ref}
                    onOk = {this._onOk}
                />
                    <ModalBusinessCard
                        modalVisible = {this.state.visible}
                        onRequestClose = {()=>this._close()}
                        sendPerson = {selectItems.remark || selectItems.pname || selectItems.dname }
                        personName = {dname}
                        handleSubmit = {() => {
                            this._sendTextMessage(this.state.data,'card')
                            this._close();
                        }}
                        imageurl = {baseImgUrl+selectItems.imageurl}
                    />
                </ScrollView>
            </View>

        );
    }
}