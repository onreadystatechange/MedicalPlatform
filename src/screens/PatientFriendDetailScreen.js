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
import  {getLabel,getGenderType} from '../utils/DataDict'
import  {CommonTitle,ModalChangeRemark,CommonModal,LoadingView,ModalControllaDomande,ModalBusinessCard}from '../components'
import {baseImgUrl} from '../configs/BaseConfig'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import  GetFriendListType from '../redux/GetFriendList';
import  http from '../libs/fetch'
import GetPatientListAction from '../redux/GetPatientList'
import {formatTime} from '../utils/TimeUtil'
import  GetPatientCaseListAction from '../redux/GetPatientCaseList';
import  FriendRequestService from '../realm/service/FriendRequestService';
import WebIM from '../libs/WebIM';
import SingleMessageService from '../realm/service/SingleMessageService'
import AllUserMesService from '../realm/service/AllUserMesService'
import TimeUtil from '../utils/TimeUtil';
@connect(
    state =>({
        friendList:state.friendList,
        payload:state.user.doctor || {},
        patientCaseList:state.patientCaseList.PatientHistoryInfo
    }),
    {
        getPfriendList:GetFriendListType.getPfriendList,
        getDfriendList:GetFriendListType.getDfriendList,
        getPatientList:GetPatientListAction.getPatientList,
        getPatientCaseList:GetPatientCaseListAction.getPatientCaseList
    }
)

export default class PatientFriendDetailScreen extends Component {

    state = {
        show:false,
        data:{
            pname:'',
            imageurl:'',
            id:'',
            sex:1,
            pnickname:'',
            remark:'',
        },
        dataList: [],
        selectItems:{},
        visible:false,
        apply:false
    }

    componentDidMount(){
       this._getInitdata();
       const doctorId = this.props.payload.id;
        const item = this.props.navigation.state.params.item;
        const id = item;
       this.props.getPatientCaseList(doctorId,id);
    }

    _applyFor(historyid){
        const doctorid = this.props.payload.id;
        const id = this.props.navigation.state.params.item;
        this.setState({
            apply:true
        })
        http(`med/ask/${doctorid}/${id}/${historyid}`,{
            method:'put'
        }).then(data =>{
            this.setState({
                apply:false
            },()=> this._modal.open());
        })
    }

    _diagnose(doctorId,patientId,historyid,datas,item){
        const {navigation:{goBack,navigate,state}} = this.props;
        navigate('DiagnoseScreen',{
            item:{
                doctorId,
                patientId,
                historyid,
                datas,
                item
            }
        })
    }

    _caseedit(item){
        const {navigation:{goBack,navigate,state}} = this.props;
        navigate('CaseEditScreen',{
            item
        })
    }

    _renderRow = (item,index) =>{
        const datas = !!item.medicalHistoryVO.datas?JSON.parse(item.medicalHistoryVO.datas):null;
        const allow = JSON.parse(item.allow);
        const attendingDoctor = item.attendingDoctor;
        const historyid = item.historyid;
        const id = this.props.payload.id;
        const {navigation:{goBack,navigate,state}} = this.props;
        return (
            <View key = {index} style = {{ paddingLeft:px(30),paddingRight:px(30),backgroundColor:'#fff'}}>
                <View style = {{flexDirection:'row',justifyContent:'space-between',
                    height:px(130)
                }} >
                    <View style = {{flexDirection:'column',justifyContent:'center'}}>
                        <Text style = {{color:'#333',fontSize:px(36)}}>
                            {item.medicalHistoryVO.item}
                        </Text>
                        <View style = {{height:px(10)}}/>
                        {!!datas &&
                        <View style = {{flexDirection:'row'}}>
                            <Text style = {{color:'#999',fontSize:px(28)}}>
                                主治医师:
                            </Text>
                            <View style = {{width:px(10)}}/>
                            <Text style = {{color:'#999',fontSize:px(28)}}>
                                {attendingDoctor === id?'我':datas.doctorName}
                            </Text>
                            <View style = {{width:px(10)}}/>
                            <Text style = {{color:'#999',fontSize:px(28)}}>
                                {formatTime(item.medicalHistoryVO.modtime)}
                            </Text>
                        </View>
                        }
                    </View>

                    {!allow && <TouchableOpacity style = {{height:px(130),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}
                                                 onPress = {() => this._applyFor(historyid)}
                    >
                        <Text style = {{color:Colors.navBarColor,fontSize:px(32)}}>
                            申请查看
                        </Text>
                    </TouchableOpacity>}
                    {allow && attendingDoctor !==id  &&<TouchableOpacity style = {{height:px(130),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}
                                                                         onPress = {() => navigate('CaseDetailScreen',{
                                                                             item:item
                                                                         })}
                    >
                        <Text style = {{color:'#999',fontSize:px(32)}}>
                            查看详情
                        </Text>
                    </TouchableOpacity>}

                    {allow && attendingDoctor ===id  &&
                    <View  style = {{flex:1,justifyContent:'flex-end',flexDirection:'row'}}>
                        <View style = {{justifyContent:'flex-end',flexDirection:'row'}}>
                            <TouchableOpacity style = {{alignSelf:'center',width:px(110),height:px(50),
                                flexDirection:'row',alignItems:'center',borderColor:Colors.navBarColor,borderRadius:px(25),
                                borderWidth:px(1),justifyContent:'center'}}
                                              onPress = {() => this._caseedit(item)}
                            >
                                <Text style = {{fontSize:px(28),color:Colors.navBarColor}}>
                                    编辑
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {{width:px(20)}}/>
                        <View style = {{justifyContent:'flex-end',flexDirection:'row'}}>
                            <TouchableOpacity style = {{alignSelf:'center',width:px(110),height:px(50),
                                flexDirection:'row',alignItems:'center',borderColor:Colors.navBarColor,borderRadius:px(25),
                                borderWidth:px(1),justifyContent:'center'}}
                                              onPress = {() => this._diagnose(attendingDoctor,id,historyid,item.medicalHistoryVO.datas,item.medicalHistoryVO.item)}
                            >
                                <Text style = {{fontSize:px(28),color:Colors.navBarColor}}>
                                    诊断
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    }
                </View>
                <View style = {{height:px(1),backgroundColor:'#eee'}}/>
            </View>
        )
    }

    _getInitdata = ()=>{
        const item = this.props.navigation.state.params.item;
        const id = item;

        http(`friend/patient/${id}`,{
            method:'get',
            body:{

            }
        }).then(data => {
            console.log(data.patient);
            this.setState({
                data:data.patient
            })
        }).catch(e => console.log(e))
    }

    _changeRemark = ()=>{
        this._remark.show();
    }

    _ok=(changeRemark)=>{
        const {navigation:{goBack,navigate}} = this.props;
        const {pname,imageurl,id,sex,pnickname,remark} = this.state.data;
        if(!changeRemark && changeRemark.length <= 0 ){
            ToastAndroid.show('请输入好友备注',ToastAndroid.SHORT);
            return;
        }
        http(`friend/update/${id}?remark=${changeRemark}`,{
            method:'put',
            body:{

            }
        }).then(data => {
            this.props.getPfriendList();
            this.props.getPatientList(this.props.payload.id);
            this._getInitdata();
            this._remark.close();
            ToastAndroid.show('修改备注成功',ToastAndroid.SHORT);
        }).catch(e => console.log(e))
    }

    _handleClick = () =>{
        this._delModal.show();
    }

    _onOk = ()=>{
        const {navigation:{goBack,navigate}} = this.props;
        const {pname,imageurl,id,sex,pnickname,remark} = this.state.data;
        http(`friend/delete/patient/${id}`,{
            method:'delete',
            body:{

            }
        }).then(data => {
            ToastAndroid.show('删除好友成功',ToastAndroid.SHORT);
            const {navigation:{goBack,navigate}} = this.props;
            FriendRequestService.deleteFriends(id);
            this.props.getPfriendList();
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
            success:  (id, serverMsgId)=> {
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
        const {data:{pname,imageurl,id,sex,pnickname,remark}} = this.state;
        const {navigation:{goBack,navigate},patientCaseList} = this.props;
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
                            {pname}
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
                {!!patientCaseList&& patientCaseList.length >0 && <View>
                    <View style = {{paddingLeft:px(30),height:px(100),flexDirection:'row',alignItems:'center'}}>
                        <Text style = {{color:'#333',fontSize:px(32)}}>
                            病例列表
                        </Text>
                    </View>
                    <ScrollView>
                        {!!patientCaseList && patientCaseList.length >0 && patientCaseList.map((item,index)=>this._renderRow(item,index))}
                    </ScrollView>
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
                <View style = {{flex:1}}/>
                <ModalChangeRemark
                    ref = {(ref) =>this._remark = ref}
                    ok = {this._ok}
                    initValue = {this.state.data.remark}
                />
                <CommonModal
                    content = "确定要删除好友吗"
                    ref = {(ref) =>this._delModal = ref}
                    onOk = {this._onOk}
                />
                <LoadingView visible = {this.state.show} loadingText = {'修改中...'} onRequestClose = {()=>console.log(8)}/>
                <ModalControllaDomande
                    ref = {(ref)=> this._modal = ref}
                />
                <ModalBusinessCard
                    modalVisible = {this.state.visible}
                    onRequestClose = {()=>this._close()}
                    sendPerson = {selectItems.remark || selectItems.pname || selectItems.dname }
                    personName = {pname}
                    handleSubmit = {() => {
                        this._sendTextMessage(this.state.data,'card')
                        this._close();
                    }}
                    imageurl = {baseImgUrl+selectItems.imageurl}
                />
                <LoadingView visible = {this.state.apply} loadingText = '发送中...' onRequestClose = {()=>console.log(8)}/>
            </View>
        );
    }
}