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
import { View,Text,TouchableOpacity,Image,TextInput,StyleSheet,ScrollView,TouchableHighlight,TouchableNativeFeedback,ToastAndroid,Animated,Keyboard,TouchableWithoutFeedback} from 'react-native';
import {connect} from "react-redux";
import Images from  '../themes/Images';
import Colors from '../themes/Colors';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import  {CommonTitle,CommonModal,ExpandableList,ModalSickList,ModalSelectPersion,ModalFilterPicker}from '../components'
import GetPatientListAction from '../redux/GetPatientList'
import { getStore} from '../libs/Storage'
import {baseImgUrl} from '../configs/BaseConfig'
import  http from '../libs/fetch'
import  UserInfoActionType from '../redux/UserInfo';
import {px} from '../libs/CSS'
import  GetFriendListType from '../redux/GetFriendList';
import CountEmitter from './../libs/CountEmitter';
import  GetDiscussType from '../redux/GetDiscussList';
import Menu, {
    MenuProvider,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';
Menu.debug = false;
@connect(state =>({
    payload:state.user.doctor || {},
    patientList:state.patientList || {},
    friendList:state.friendList,
}),{
    getPatientList:GetPatientListAction.getPatientList,
    getUser:UserInfoActionType.getUser,
    getPfriendList:GetFriendListType.getPfriendList,
    getDfriendList:GetFriendListType.getDfriendList,
    getDiscuss:GetDiscussType.getDiscussList
})
export default class SickListScreen extends Component {
    state = {
        click:false,
        manage:false,
        title:'',
        groupId:'',
        groupData:null,
        value:'',
        setionId:'',
        model:false,
        picked:null,
        patientid:'',
        groupid:''

    }


    async componentDidMount(){
        let id = await getStore('AccessUserId');
        global.clientId = id;
        this.props.getPatientList(clientId);
        this.props.getUser(id);
        this.props.getDiscuss(id);
        this.props.getPfriendList();
        this.props.getDfriendList();
        CountEmitter.addListener('gopage', this._listenGoPage);
    }

    componentWillUnmount(){
        CountEmitter.removeListener('gopage', this._listenGoPage);
    }

    _listenGoPage=(id,type)=>{
        const {navigation:{goBack,navigate},patientList:{groupInfo,group}} = this.props;
        const isFriend = [...this.props.friendList.doctor.infos,...this.props.friendList.patient.infos].find((item)=>item.id === id);
        console.log(this.props.friendList,isFriend);
        if(isFriend && type === 'doctor'){
            navigate('DoctorFriendDetailScreen',{
                item:id
            })
        }else if(isFriend && type === 'patient'){
            navigate('PatientFriendDetailScreen',{
                item:id
            })
        }else if(!isFriend && type === 'patient'){
            navigate('SearchResultPatient',{
                item:id
            })
        }else{
            navigate('SearchResultDoctor',{
                item:id
            })
        }
    }

    _deleteGroup(groupId){
        http(`gro/delectGroup/${groupId}`,{
            method:'DELETE'
        }).then(data =>  {
            ToastAndroid.show('删除成功',ToastAndroid.SHORT);
            this.props.getPatientList(clientId);
        }).catch(e => {
            console.log(e)
        })
    }

    _deleteItem(groupId,ItemId){
        http(`gro/delectPentient/${groupId}/${ItemId}`,{
            method:'DELETE'
        }).then(data =>  {
            ToastAndroid.show('删除成功',ToastAndroid.SHORT);
            this.props.getPatientList(clientId)
        }).catch(e => {
            console.log(e)
        })
    }

    _modalShow(groupId,title){
        this._Modal.show();
        title = "确定要删除分组"+title+"吗？";
        this.setState({
            title,
            groupId
        })
    }

    _onChange=(value)=>{
        this.setState({
            value
        });
        console.log(value);
    }

    _addgroup(){
        const {navigation:{goBack,navigate},patientList:{groupInfo,group}} = this.props;
        this.setState({
            value:''
        },()=>this._ModalSick.show());
    };

    _addPersion(groupId,title,setionId){
        const {navigation:{goBack,navigate},patientList:{groupInfo,group}} = this.props;
        console.log(groupId,title,groupInfo[title]);
        this.setState({
            groupId,
            title,
            setionId:setionId
        });
        console.log(groupId);
        this._ModalSelect.show();
        this._ModalSelect.change(groupInfo[title]);
    }

    _ok = (pidlist)=>{
        let {groupId,title} = this.state;
        if(!!pidlist && Array.isArray(pidlist) && pidlist.length > 0){
            http('gro/addFirend',{method:'post',body:{
                doctorid:this.props.payload.id,
                groupName:title,
                pidlist:pidlist,
                id:groupId
            }}).then(data =>{
                this.props.getPatientList(this.props.payload.id);
                this.setState({
                    value:''
                })
                ToastAndroid.show('添加成功',ToastAndroid.SHORT);
            })
        }
    }

    _handleSubmit = (pidlist)=>{
        let {groupId,title,value} = this.state;
        if(!!value && value.length >= 0 ){
            http('gro/addGroup',{method:'post',body:{
                doctorid:this.props.payload.id,
                groupName:value,
                pidlist:pidlist,
            }}).then(data =>{
                this.props.getPatientList(this.props.payload.id);
                ToastAndroid.show('添加成功',ToastAndroid.SHORT);
                this._ModalSick.close();
            })
        }else{
            ToastAndroid.show('请输入分组名',ToastAndroid.SHORT);
            return;
        }
    }

    _delete(){
        let {groupId} = this.state;
        this._deleteGroup(groupId);
    }

    _onOptionSelect(value,rowItem,groupid,patientid){
        if(value === 1){
            console.log(999)
            this.setState({
                model:true,
                groupid,
                patientid
            })
        }
        if(value === 2){
            this._deleteItem(groupid,patientid)
        }
        this[`menu${rowItem['id']}`].close();
    }

    _renderRow =(rowItem, rowId, sectionId) =>{
        const {groupid,patientid,pend,patientInfoPO:{pname,pnickname,imageurl,id},remark} = rowItem;
        const {navigation:{goBack,navigate},patientList:{groupInfo,group}} = this.props;
        return(
                <TouchableOpacity
                    onPress ={()=> navigate('PatientDetails',{item:rowItem.patientInfoPO})}
                    onLongPress = {()=>{
                        this[`menu${rowItem['id']}`].open();
                    }}
                    activeOpacity = {0.6}
                    style = {{
                        paddingRight:px(30),
                        paddingLeft:px(30),
                        backgroundColor:'#fff'
                    }}
                >
                        <View
                            style = {{
                                flexDirection:'row',
                                alignItems:'center',
                                justifyContent:'flex-start',
                                height:px(130),
                                position:'relative'
                            }}
                        >
                            <View>
                                <Image source = {Images.default_hdimg} style = {{width:px(80),height:px(80),borderRadius:px(10)}}/>
                            </View>
                            <View style = {{width:px(30)}}/>
                            <View style = {{flex:1,flexDirection:'row',alignItems:'center'}}>
                                <Text style = {{fontSize:px(32),color:'#333'}}>
                                    {!!remark?remark:(pname || pnickname)}

                                </Text>
                                <View style = {{width:px(10)}}/>
                                <Text style = {{color:Colors.navBarColor,fontSize:px(32),opacity:0.5}}>
                                    { pend ===0?'(未诊断)':''}
                                </Text>
                            </View>

                            {false &&<TouchableOpacity onPress = {() =>this._deleteItem(groupid,patientid)} style = {{width:px(100),flexDirection:'row',justifyContent:'flex-end'}}>
                                <View>
                                    {!imageurl?
                                        <Image source = {Images.delete_friend} style = {{width:px(30),height:px(30)}}/>:
                                        <Image source = {{uri:baseImgUrl+imageurl}} style = {{width:px(30),height:px(30)}}/>
                                    }
                                </View>
                            </TouchableOpacity>}

                            <Menu
                                style={{ height: px(95),width:px(170) }}
                                onSelect={(value) => this._onOptionSelect(value,rowItem,groupid,patientid)}
                                ref={(ref)=>this[`menu${rowItem['id']}`] = ref}>
                                <MenuTrigger text=' '/>
                                <MenuOptions>
                                    <MenuOption value={1} >
                                        <Text style={{fontSize:px(32)}}>移动至</Text>
                                    </MenuOption>
                                    <MenuOption value={2} >
                                        <Text style={{color: 'red',fontSize:px(32)}}>删除</Text>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                    </View>
                    <View style = {{height:px(1),backgroundColor:'#eee'}}/>
                </TouchableOpacity>
            )
    };

    _renderSection = (section, sectionId,status)  => {
        const {navigation:{goBack,navigate},patientList:{groupInfo,group}} = this.props;
        return(
            <View>
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
                            {section.label}
                        </Text>
                    </View>
                    <View style = {{flex:1}}/>

                    {this.state.manage && <TouchableOpacity onPress = {()=>this._addPersion(section['key'],section.label,sectionId)}>
                        <View style = {{paddingRight:px(30)}}>
                            <Image
                                source = {Images.add_member}
                                style = {{width:px(36),height:px(36)}}/>
                        </View>
                    </TouchableOpacity>}

                    {this.state.manage && <TouchableOpacity onPress = {() => this._modalShow(section['key'],section.label)}>
                        <View style = {{paddingRight:px(30)}}>
                            <Image
                                source = {Images.delete}
                                style = {{width:px(36),height:px(36)}}/>
                        </View>
                    </TouchableOpacity>}

                    <View>
                        <Image
                            source = {!!status?Images.packUp:Images.unfold}
                            style = {{width:px(36),height:px(36)}}/>
                    </View>
                </View>
                <View style = {{height:px(1),backgroundColor:'#eee'}}/>
            </View>
        )
    };

    _handleClick = () =>{
        this.setState((prevState) =>{
            const manage = !prevState.manage;
            return { manage };
        })
    };

    _onSelect = (picked)=>{
        console.log(picked);
        const yGroupId = this.state.groupid;
        const patiendId = this.state.patientid;
       http(`gro/addMoveFirend/${yGroupId}/${picked}/${patiendId}`,{
           method:'post'
       }).then(data =>  {
           this.setState({
               model:false
           })
           this.props.getPatientList(this.props.payload.id);
           ToastAndroid.show('移动分组成功',ToastAndroid.SHORT);
       }).catch(e=>console.log(e))
    }

    _renderHeader = () =>{
        return(
            <View >
                    {this.state.manage &&
                    <TouchableOpacity  style = {{flex:1,flexDirection:'row',justifyContent:'center',height:px(100),alignItems:'center'}} onPress = {()=>this._addgroup()} >
                        <View style = {{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                            <Ionicons size={26} name="ios-add" color={Colors.navBarColor}/>
                            <View style = {{width:px(10)}}/>
                            <Text style = {{color:Colors.navBarColor,fontSize:px(32)}}>
                                新建分组
                            </Text>
                        </View>
                    </TouchableOpacity>
                    }
            </View>
        )
    };


    render() {
        const {navigation:{goBack,navigate},patientList:{groupInfo,group}} = this.props;
        console.log(groupInfo,group);
        const {click} = this.state;
        const data = ()=> {
            const arr = [];
           if(!!groupInfo && !!group){
               for(let k in groupInfo){
                   let obj = {};
                   obj.member = groupInfo[k];
                   const arr3 = group && group.find((item) => item.groupName === k);
                   obj.title = {
                       label:k,
                       key:arr3.id
                   };
                   arr.push(obj);
               }

           }
           return arr;
        };
        const modelData = ()=>{
            const arr = [];
            data().map((item,index) => arr.push(item.title));
            return arr.filter((item)=> item.key !== this.state.groupid);
        };
        return (
            <MenuProvider style = {{flex:1}}>
                <View style={{flex: 1,backgroundColor:Colors.transparent}}>
                    <CommonTitle
                        rightView = {
                            <TouchableOpacity onPress = {this._handleClick}>
                                {!this.state.manage &&<View >
                                    <Text style = {{ color: 'white', fontSize: px(36)}}>
                                        分组管理
                                    </Text>
                                </View>}
                                {this.state.manage &&
                                <View>
                                    <Text style = {{ color: 'white', fontSize: px(36)}}>
                                        完成
                                    </Text>
                                </View>
                                }
                            </TouchableOpacity>

                        }
                        title= '病人'
                    />

                    <ExpandableList
                        dataSource={data()}
                        headerKey="title"
                        memberKey="member"
                        renderRow={this._renderRow}
                        renderHeader = {this._renderHeader}
                        renderSectionHeaderX={this._renderSection}
                    />

                    <View style = {{flex:1}}>
                        {(!!data() && data().length ===0)  &&
                        <View style = {{flex:1,alignItems:'center',justifyContent:'flex-start'}}>
                            <Text style = {{color:'#999',fontSize:px(30)}}>
                                暂无好友分组
                            </Text>
                        </View>}
                    </View>



                    {/*group-add*/}
                    <CommonModal
                        ref = {(ref) => this._Modal = ref}
                        onOk = {() => this._delete()}
                        content = {this.state.title}
                    />
                    <ModalSickList
                        ref = {(ref) => this._ModalSick = ref}
                        value = {this.state.value}
                        onChange = {this._onChange}
                        ok = {this._handleSubmit}
                        type = 'patient'
                    />
                    <ModalSelectPersion
                        ref = {(ref) => this._ModalSelect = ref}
                        ok = {this._ok}
                        add = {true}
                        type = 'patient'
                        groupData = {data() && Array.isArray(data())?data()[this.state.setionId]:[]}
                    />

                    <ModalFilterPicker
                        visible={this.state.model}
                        onSelect={this._onSelect}
                        onCancel={()=>this.setState({
                            model:false
                        })}
                        options={modelData()}
                    />

                </View>
            </MenuProvider>

        );
    }
}