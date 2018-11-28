/**
 * Created by yjy on 2017/12/18.
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
import { View,Text,TouchableOpacity,Image,ScrollView,StyleSheet,ToastAndroid} from 'react-native';
import {connect} from "react-redux";
import {Colors,Images} from  '../themes';
import  {CommonTitle,ModalControllaDomande,ModalBusinessCard,ModalFilterPicker,ModalSickList,LoadingView}from '../components';
import {RefreshState} from 'react-native-refresh-list-view'
import  {getLabel,getGenderType} from '../utils/DataDict'
import  {baseImgUrl} from '../configs/BaseConfig'
import  http from '../libs/fetch'
import WebIM from '../libs/WebIM';
import SingleMessageService from '../realm/service/SingleMessageService'
import AllUserMesService from '../realm/service/AllUserMesService'
import Menu, {
    MenuProvider,
    MenuTrigger,
    MenuOptions,
    MenuOption
} from 'react-native-popup-menu';
import  {px} from '../libs/CSS'
import {formatTime} from '../utils/TimeUtil'
import  GetPatientCaseListAction from '../redux/GetPatientCaseList';
import TimeUtil from '../utils/TimeUtil';
import  GetDiscussType from '../redux/GetDiscussList';
Menu.debug = false;
@connect(state =>({
    payload:state.user.doctor || {},
    patientCaseList:state.patientCaseList.PatientHistoryInfo
}),{
    getPatientCaseList:GetPatientCaseListAction.getPatientCaseList,
    getDiscuss:GetDiscussType.getDiscussList
})
export default class PatientDetails extends Component {
    state = {
        dataList: [],
        refreshState: RefreshState.Idle,
        data:{
            patient:{
                imageurl:'',
                pname:'',
                remark:'',
                sex:''
            }
        },
        selectItems:{},
        visible:false,
        model:false,
        historyid:'',
        value:'',
        show:false,
        apply:false
    }

    async componentDidMount(){
        const {id} = this.props.navigation.state.params.item;
        console.log(this.props.navigation.state.params.item);
        const doctorid = this.props.payload.id;
        // let dataList = await http(`med/findMed/${doctorid}/402881fb600bfaf901600bfb37f71111`);
        let data =  await http(`friend/patient/${id}`);
        this.props.getPatientCaseList(doctorid,id);
        this.setState({
            data:data.patient
        })
    }

    _applyFor(historyid){
        const doctorid = this.props.payload.id;
        const {id} = this.props.navigation.state.params.item;
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

    _onOptionSelect(value){
        console.log(value)
        if(value === 1){
            this._navigateMsg();
        }
        if(value ===2){
            this._navigateSendCard();
        }
        if(value === 3){
            this._modalPickerShow();
        }
    }

    _modalPickerShow(){
        this.setState({
            model:true
        })
    }

    _close(){
        this.setState({
            visible:false
        })
    }
    _select =(picked)=>{
        const historyid = picked;
        this.setState({
            model:false,
            historyid
        })
        this._ModalSick.show();
        // const doctorId = this.props.payload.id;
        // http(`dus/addDiss/${doctorId}/{patiendId}/{item}/${historyId}`,{
        //     method:'post'
        // }).then(data =>  {
        //     this.setState({
        //         model:false
        //     })
        //     this.props.getPatientList(this.props.payload.id);
        //     ToastAndroid.show('移动分组成功',ToastAndroid.SHORT);
        // }).catch(e=>console.log(e))
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

    _navigateMsg(){
        const {navigation:{goBack,navigate,state},patientCaseList} = this.props;
        const {imageurl,pname,remark,sex} = this.state.data;
        navigate('ChatScreen',{item:this.state.data});
    }

    _onSelect = selectItems => {
        this.setState({
            selectItems:selectItems,
            visible:true
        })
    };

    _navigateSendCard(){
        const {navigation:{goBack,navigate,state},patientCaseList} = this.props;
        const {imageurl,pname,remark,sex} = this.state.data;
        navigate('ChooseSCPersonScreen',{ onSelect: this._onSelect,items:this.state.data});
    }

    _onChange=(value)=>{
        this.setState({
            value
        });
    }

    _handleSubmit = (pidlist)=>{
        console.log(pidlist);
        const item = pidlist;
        const {navigation:{goBack,navigate,state},patientCaseList} = this.props;
        const doctorId = this.props.payload.id;
        const patiendId= this.state.data.id;
        const {value,historyid} = this.state
        if(!!value && value.length >= 0 ){
            this.setState({
                show:true
            });
            http(`dus/addDiss/${doctorId}/${patiendId}/${value}/${historyid}`,{method:'post',body:{
                dlist:item
            }}).then(data =>{
                console.log(data);
                this.setState({
                    show:false,
                    value:''
                },()=>{
                    ToastAndroid.show('创建成功',ToastAndroid.SHORT);
                    this._ModalSick.close();
                    this.props.getDiscuss(doctorId);
                    navigate('GroupChatScreen',{
                        item:{
                            id:data.disscussInfo.id,  //disscussId
                            patientId:patiendId,
                            owner:data.disscussInfo.owner,
                            historyId:historyid
                        }
                    });
                });
            })
        }else{
            ToastAndroid.show('请输入分组名',ToastAndroid.SHORT);
            return;
        }
    }

    render() {
        const {navigation:{goBack,navigate,state},patientCaseList} = this.props;
        const {id} = this.props.navigation.state.params.item;
        const {imageurl,pname,remark,sex} = this.state.data;
        const {selectItems} = this.state;
        const arr = [];
        const modelData =()=> patientCaseList && patientCaseList.length>0&&patientCaseList.filter((item)=>{
            const allow = JSON.parse(item.allow);
            const attendingDoctor = item.attendingDoctor;
            const historyid = item.historyid;
            const id = this.props.payload.id;
            if(allow && attendingDoctor ===id){
                arr.push({
                    label:item.medicalHistoryVO.item,
                    key:historyid
                });
            }
        });
        modelData();
        return (
            <MenuProvider style = {{flex:1}}>
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
                            <Menu
                                onSelect={(value) => this._onOptionSelect(value)}
                                ref={(ref)=>this._menu = ref}>
                                <MenuTrigger  customStyles={triggerStyles}>
                                    <Image source = {Images.more} style = {{width:px(32),height:px(32)}} />
                                </MenuTrigger>
                                <MenuOptions customStyles={optionsStyles}>
                                    <MenuOption value={1} customStyles={optionStyles}>
                                        <Image source = {Images.send_msg} style = {{width:px(34),height:px(34)}} />
                                        <View style = {{width:px(10)}}/>
                                        <Text >发送消息</Text>
                                        <View style = {{height:px(1)}}/>
                                    </MenuOption>
                                    <MenuOption value={2} customStyles={optionStyles}>
                                        <Image source = {Images.send_my_card} style = {{width:px(34),height:px(34)}} />
                                        <View style = {{width:px(10)}}/>
                                        <Text >发送名片</Text>
                                    </MenuOption>
                                    <MenuOption value={3} customStyles={optionStyles}>
                                        <Image source = {Images.startDiscussion} style = {{width:px(34),height:px(34)}} />
                                        <View style = {{width:px(10)}}/>
                                        <Text >发起讨论</Text>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        }
                        title= '患者详情'
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
                    <View style = {{height:px(100),paddingLeft:px(30),paddingRight:px(30),backgroundColor:'#fff',flexDirection:'row',
                        justifyContent:'space-between',alignItems:'center'
                    }}>
                        <Text style = {{color:'#333',fontSize:px(32)}}>
                            好友备注
                        </Text>
                        <Text style = {{color:'#999',fontSize:px(32)}}>
                            {!!remark?remark:'无'}
                        </Text>
                    </View>

                    <View style = {{flexDirection:'row',width:width}}>
                        <View style = {{width:px(30),backgroundColor:'#fff'}}/>
                        <View style = {{height:px(1),backgroundColor:'#eee',flex:1}}/>
                        <View style = {{width:px(30),backgroundColor:'#fff'}}/>
                    </View>

                    <View style = {{height:px(100),paddingLeft:px(30),paddingRight:px(30),backgroundColor:'#fff',flexDirection:'row',
                        justifyContent:'space-between',alignItems:'center'
                    }}>
                        <Text style = {{color:'#333',fontSize:px(32)}}>
                            好友姓名
                        </Text>
                        <Text style = {{color:'#999',fontSize:px(32)}}>
                            {pname}
                        </Text>
                    </View>

                    {!!patientCaseList && patientCaseList.length >0 && <View style ={{flex:1}}>
                        <View style = {{paddingLeft:px(30),height:px(100),flexDirection:'row',alignItems:'center'}}>
                            <Text style = {{color:'#333',fontSize:px(32)}}>
                                病例列表
                            </Text>
                        </View>
                        <ScrollView automaticallyAdjustContentInsets={false} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                            {!!patientCaseList && patientCaseList.length >0 && patientCaseList.map((item,index)=>this._renderRow(item,index))}
                        </ScrollView>
                    </View>}
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
                    <ModalFilterPicker
                        visible={this.state.model}
                        onSelect={this._select}
                        onCancel={()=>this.setState({
                            model:false
                        })}
                        options={arr}
                    />
                    <ModalSickList
                        ref = {(ref) => this._ModalSick = ref}
                        value = {this.state.value}
                        onChange = {this._onChange}
                        ok = {this._handleSubmit}
                        type = 'doctor'
                    />
                    <LoadingView visible = {this.state.show} loadingText = '创建中...' onRequestClose = {()=>console.log(8)}/>
                    <LoadingView visible = {this.state.apply} loadingText = '发送中...' onRequestClose = {()=>console.log(8)}/>
                </View>
            </MenuProvider>
        );
    }
}
const triggerStyles = {
    triggerOuterWrapper: {
        position:'relative',
        flex: 1,
    },
    triggerWrapper:{
        position:'relative',
        flex: 1,
    }
}

const optionsStyles = {
    optionsContainer: {
        height:px(240),
        width:px(220),
        borderRadius:px(10),
        backgroundColor:'#fff',
        marginTop:px(40)
    },
    optionsWrapper: {
        paddingLeft:px(20),
        paddingRight:px(30)
    },
    optionWrapper: {
        flexDirection:'row',
        justifyContent:'center',
    },
    optionTouchable: {

    },
    optionText: {

    },
};

const optionStyles = {
    optionTouchable: {

    },
    optionWrapper: {
        height:px(80),
        width:px(180),
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    optionText: {
        color:'#666',
        fontSize:px(28)
    },
};
