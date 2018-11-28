/**
 * Created by yjy on 2017/12/6.
 */
import React from 'react';
import {StackNavigator,DrawerNavigator,NavigationActions} from 'react-navigation';
import {
    AddressListScreen,
    CommunityScreen,
    MessageScreen,
    SickListScreen,
} from '../screens';
import {connect,store} from "react-redux";
import {Easing,Animated,TouchableOpacity,View,Platform,Image,StyleSheet,ToastAndroid,Text,DeviceEventEmitter,Alert}from 'react-native';
import {Images} from "../themes"
import {px} from "../libs/CSS"
import {UserDrawer} from '../components'
import TabNavigator from 'react-native-tab-navigator';
import Drawer from 'react-native-drawer'
import  UserInfoActionType from '../redux/UserInfo';
import { getStore,setStore} from '../libs/Storage'
import  GetFriendListType from '../redux/GetFriendList';
import http from '../libs/fetch'
import  FriendRequestService from '../realm/service/FriendRequestService'
import  SingleMessageService from '../realm/service/SingleMessageService'
import  AllUserMesService from '../realm/service/AllUserMesService'
import TimeUtil from '../utils/TimeUtil'
import CountEmitter from './../libs/CountEmitter';
import repository from '../realm/repository'
import {
    isFirstTime,
    checkUpdate,
    downloadUpdate,
    switchVersionLater,
    markSuccess,
} from 'react-native-update';
import _updateConfig from '../../update.json';
import  GetMemberType from '../redux/GetMemberList';
import  GetDiscussType from '../redux/GetDiscussList';
const {appKey} = _updateConfig[Platform.OS];
@connect(
    state =>({
        friendList:state.friendList,
        payload:state.user.doctor || {},
        myOwner:state.discuss.list.myOwner || [],
        myJoin:state.discuss.list.myJoin || []
    }),
    {
        getUser:UserInfoActionType.getUser,
        getPfriendList:GetFriendListType.getPfriendList,
        getDfriendList:GetFriendListType.getDfriendList,
        getMemberList:GetMemberType.getMemberList,
        getDiscuss:GetDiscussType.getDiscussList
    }
)
export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'sicklist',
            drawerOpen: false,
            drawerDisabled: false,
            allNumber:0
        };
        this.friendList = [];
        this.version = 0;
    }

    closeDrawer = () => {
        this._drawer.close()
    };

    async componentWillMount(){
        let version = await getStore('AppVersion');
        this.version = version;
        this.checkUp();
        if(isFirstTime){
            markSuccess()
        }
    }

    openDrawer = () => {
        this._drawer.open()
    };

    doUpdate = info => {
        downloadUpdate(info).then(hash => {
            switchVersionLater(hash);
            Alert.alert('提示', '下载完毕,下次启动时自动更新');
        }).catch(err => {
            // Alert.alert('提示', '更新失败.');
        });
    };

   async ignoreInfo(version){
        setStore("AppVersion",version);
    }

    checkUp = () => {
        checkUpdate(appKey).then(info => {
            if (info.expired) {
                return true;
            } else if (info.upToDate) {
                return true;
            } else {
                if(this.version !== info.name){
                    Alert.alert('提示', '检查到新的版本'+info.name+',是否下载?\n'+ info.description, [
                        {text: '是', onPress: ()=>{this.doUpdate(info)}},
                        {text: '忽略',onPress: ()=>{this.ignoreInfo(info.name)}},
                    ]);
                }
            }
        }).catch(err => {
            // Alert.alert('提示', '更新失败.');
        });
    };


    async componentDidMount() {
        let id = await getStore('AccessUserId');
        this.setState({
            allNumber:AllUserMesService.getAllNum(id)
        });
        this.loginToHX();
        repository.objects('AllMessSchema').addListener((puppies, changes)=>{
                this.change()
            }
        );
   }

    componentWillUnmount(){
        repository.removeAllListeners();
    }

    async change(){
        let id = await getStore('AccessUserId');
        console.log(AllUserMesService.getAllNum(id));
        this.setState({
            allNumber:AllUserMesService.getAllNum(id)
        })
    }

    registerHXListener(){
        WebIM.conn.listen({
            // xmpp连接成功
            onOpened: (msg) => {
                // ToastAndroid.show('onOpend',ToastAndroid.SHORT);
                // 登录环信服务器成功后回调这里
                // 出席后才能接受推送消息
                WebIM.conn.setPresence();
            },
            // 出席消息
            onPresence: (msg) => {

            },
            // 各种异常
            onError: (data) => {
                if(data.type === 8){
                    Alert.alert('提示', '账号已在其他地方登陆.', [
                        {text: '确认', onPress: () =>  CountEmitter.emit('loginout',this.props.navigation.dispatch )},
                    ],);
                    // CountEmitter.emit('loginout');
                } else if(data.type === 31){
                    ToastAndroid.show('发送失败',ToastAndroid.SHORT);
                } else if(data.type === 7){
                    ToastAndroid.show('网络中断',ToastAndroid.SHORT);
                }else{
                    return;
                }
            },
            // 连接断开
            onClosed: (data) => {
                if(data.type === 8){
                    Alert.alert('提示', '账号已在其他地方登陆.', [
                        {text: '确认', onPress: () =>  CountEmitter.emit('loginout',this.props.navigation.dispatch)},
                    ],);
                    // CountEmitter.emit('loginout');
                } else if(data.type === 31){
                    ToastAndroid.show('发送失败',ToastAndroid.SHORT);
                } else if(data.type === 7){
                    ToastAndroid.show('网络中断',ToastAndroid.SHORT);
                }else{
                    return;
                }
            },
            // 更新黑名单
            onBlacklistUpdate: (list) => {

            },
            // 文本消息
            onTextMessage: (message) => {
                const {data,type,from,id,to} = message;
                console.log(message)
                if (type === 'chat') {
                    const dataParse = JSON.parse(data);
                    if(!!dataParse.type && dataParse.type === 'addFriend'){
                        http(`friend/search/qrcode/${from}`).then(result =>{
                            const {creatTime,imageurl,dname,dnickname,pname} = !!result.doctor?result.doctor:result.patient;
                            FriendRequestService.save({id:id,content:dataParse.content ||'',imageurl:imageurl || '',
                                fromId:from,fromname:!!dname?dname:pname,role:!!result.doctor?'doctor':'patient',read:false,date:new Date(),userId:this.props.payload.id});
                            AllUserMesService.save({
                                id:this.props.payload.id,
                                label:'新朋友',
                                lastMessage:dataParse.content || '  ',
                                time:TimeUtil.formattimeStamp(TimeUtil.currentTime()),
                                number:AllUserMesService.getNum(this.props.payload.id)  +1,
                                imageurl:imageurl,
                                msgType:'addFriend',
                                uniqueId:this.props.payload.id,
                                isMe:false,
                                chatId:from
                            });
                        });
                    }
                    if(!!dataParse.type && dataParse.type === 'text'){
                        http(`friend/search/qrcode/${from}`).then(result =>{
                            const {creatTime,imageurl,dname,dnickname,pname,remark} = result.doctor || result.patient;
                            const msgFormId = result.doctor?result.doctor.id:result.patient.id;
                            if(!!dataParse.content.type &&  dataParse.content.type === 'txt'){
                                SingleMessageService.save(
                                    {
                                        id:id,
                                        content:dataParse.content.data,
                                        msgType:'txt',
                                        fromname:remark || dname|| pname ,
                                        fromId:msgFormId,
                                        imageurl:imageurl,
                                        read:false,
                                        time:dataParse.content.time,
                                        uniqueId:this.props.payload.id+'-'+from,
                                        error:false
                                    }
                                );
                                AllUserMesService.save({
                                    id:this.props.payload.id,
                                    label:remark || pname || dname,
                                    lastMessage:dataParse.content.data,
                                    time:TimeUtil.formattimeStamp(dataParse.content.time),
                                    number:AllUserMesService.getNum(this.props.payload.id+'-'+from)  +1,
                                    imageurl:imageurl,
                                    msgType:'txt',
                                    uniqueId:this.props.payload.id+'-'+from,
                                    isMe:false,
                                    chatId:from
                                });
                            }
                            if(!!dataParse.content.type &&  dataParse.content.type === 'card'){
                                SingleMessageService.save(
                                    {
                                        id:id,
                                        content:JSON.stringify(dataParse.content.data),
                                        msgType:'card',
                                        fromname:remark || dname|| pname ,
                                        fromId:msgFormId,
                                        imageurl:imageurl,
                                        read:false,
                                        time:dataParse.content.time,
                                        uniqueId:this.props.payload.id+'-'+from,
                                        error:false
                                    }
                                );
                                AllUserMesService.save({
                                    id:this.props.payload.id,
                                    label:remark || pname || dname,
                                    lastMessage:JSON.stringify(dataParse.content.data),
                                    time:TimeUtil.formattimeStamp(dataParse.content.time),
                                    number:AllUserMesService.getNum(this.props.payload.id+'-'+from)  +1,
                                    imageurl:imageurl,
                                    msgType:'card',
                                    uniqueId:this.props.payload.id+'-'+from,
                                    isMe:false,
                                    chatId:from
                                });
                            }

                            if(!!dataParse.content.type &&  dataParse.content.type === 'image'){
                                SingleMessageService.save(
                                    {
                                        id:id,
                                        content:dataParse.content.data,
                                        msgType:'image',
                                        fromname:remark || dname|| pname ,
                                        fromId:msgFormId,
                                        imageurl:imageurl,
                                        read:false,
                                        time:dataParse.content.time,
                                        uniqueId:this.props.payload.id+'-'+from,
                                        error:false
                                    }
                                );
                                AllUserMesService.save({
                                    id:this.props.payload.id,
                                    label:remark || pname || dname,
                                    lastMessage:dataParse.content.data,
                                    time:TimeUtil.formattimeStamp(dataParse.content.time),
                                    number:AllUserMesService.getNum(this.props.payload.id+'-'+from)  +1,
                                    imageurl:imageurl,
                                    msgType:'image',
                                    uniqueId:this.props.payload.id+'-'+from,
                                    isMe:false,
                                    chatId:from
                                });
                            }
                        });
                    }
                    if(!!dataParse.type&& dataParse.type === 'refreshFriend'){
                        this.props.getDfriendList();
                        this.props.getPfriendList();
                    }
                }
                if (type === 'groupchat') {
                    const dataParse = JSON.parse(data);
                    if(!!dataParse.type && dataParse.type === 'text'){
                        let url = `friend/search/qrcode/${from}`;
                        http(url).then(result =>{
                            const {creatTime,imageurl,dname,remark} = result.doctor ;
                            const msgFormId = result.doctor.id;
                            if(!!dataParse.content.type &&  dataParse.content.type === 'txt'){
                                SingleMessageService.save(
                                    {
                                        id:id,
                                        content:dataParse.content.data,
                                        msgType:'txt',
                                        fromname:remark || dname,
                                        fromId:msgFormId,
                                        imageurl:imageurl,
                                        read:false,
                                        time:TimeUtil.currentTime(),
                                        uniqueId:this.props.payload.id+'-'+to,
                                        error:false
                                    }
                                );
                                AllUserMesService.save({
                                    id:id,
                                    label:remark ||  dname,
                                    lastMessage:dataParse.content.data,
                                    time:TimeUtil.formattimeStamp(TimeUtil.currentTime()),
                                    number:AllUserMesService.getNum(this.props.payload.id+'-'+to)  +1,
                                    imageurl:imageurl,
                                    msgType:'txt',
                                    uniqueId:this.props.payload.id+'-'+to,
                                    isMe:false,
                                    chatId:id
                                });
                            }
                            if(!!dataParse.content.type &&  dataParse.content.type === 'card'){
                                SingleMessageService.save(
                                    {
                                        id:id,
                                        content:JSON.stringify(dataParse.content.data),
                                        msgType:'card',
                                        fromname:remark || dname ,
                                        fromId:msgFormId,
                                        imageurl:imageurl,
                                        read:false,
                                        time:TimeUtil.currentTime(),
                                        uniqueId:this.props.payload.id+'-'+to,
                                        error:false
                                    }
                                );
                                AllUserMesService.save({
                                    id:id,
                                    label:remark || dname,
                                    lastMessage:JSON.stringify(dataParse.content.data),
                                    time:TimeUtil.formattimeStamp(TimeUtil.currentTime()),
                                    number:AllUserMesService.getNum(this.props.payload.id+'-'+to)  +1,
                                    imageurl:imageurl,
                                    msgType:'card',
                                    uniqueId:this.props.payload.id+'-'+to,
                                    isMe:false,
                                    chatId:id
                                });
                            }

                            if(!!dataParse.content.type &&  dataParse.content.type === 'image'){
                                SingleMessageService.save(
                                    {
                                        id:id,
                                        content:dataParse.content.data,
                                        msgType:'image',
                                        fromname:remark || dname ,
                                        fromId:msgFormId,
                                        imageurl:imageurl,
                                        read:false,
                                        time:TimeUtil.currentTime(),
                                        uniqueId:this.props.payload.id+'-'+to,
                                        error:false
                                    }
                                );
                                AllUserMesService.save({
                                    id:id,
                                    label:remark ||  dname,
                                    lastMessage:dataParse.content.data,
                                    time:TimeUtil.formattimeStamp(TimeUtil.currentTime()),
                                    number:AllUserMesService.getNum(this.props.payload.id+'-'+to)  +1,
                                    imageurl:imageurl,
                                    msgType:'image',
                                    uniqueId:this.props.payload.id+'-'+to,
                                    isMe:false,
                                    chatId:id
                                });
                            }

                            if(!!dataParse.content.type &&  dataParse.content.type === 'publish'){
                                this.props.getMemberList(id);
                                SingleMessageService.save(
                                    {
                                        id:id,
                                        content:dataParse.content.data,
                                        msgType:'publish',
                                        fromname:remark || dname ,
                                        fromId:msgFormId,
                                        imageurl:imageurl,
                                        read:false,
                                        time:TimeUtil.currentTime(),
                                        uniqueId:this.props.payload.id+'-'+to,
                                        error:false
                                    }
                                );
                                AllUserMesService.save({
                                    id:id,
                                    label:remark ||  dname,
                                    lastMessage:dataParse.content.data,
                                    time:TimeUtil.formattimeStamp(TimeUtil.currentTime()),
                                    number:AllUserMesService.getNum(this.props.payload.id+'-'+to)  +1,
                                    imageurl:imageurl,
                                    msgType:'publish',
                                    uniqueId:this.props.payload.id+'-'+to,
                                    isMe:false,
                                    chatId:id
                                });
                            }

                            if(!!dataParse.content.type &&  dataParse.content.type === 'affirmResult'){
                                this.props.getMemberList(id);
                                this.props.getDiscuss(this.props.id);
                                SingleMessageService.save(
                                    {
                                        id:id,
                                        content:dataParse.content.data,
                                        msgType:'affirmResult',
                                        fromname:remark || dname ,
                                        fromId:msgFormId,
                                        imageurl:imageurl,
                                        read:false,
                                        time:TimeUtil.currentTime(),
                                        uniqueId:this.props.payload.id+'-'+to,
                                        error:false
                                    }
                                );
                                AllUserMesService.save({
                                    id:id,
                                    label:remark ||  dname,
                                    lastMessage:dataParse.content.data,
                                    time:TimeUtil.formattimeStamp(TimeUtil.currentTime()),
                                    number:AllUserMesService.getNum(this.props.payload.id+'-'+to)  +1,
                                    imageurl:imageurl,
                                    msgType:'affirmResult',
                                    uniqueId:this.props.payload.id+'-'+to,
                                    isMe:false,
                                    chatId:id
                                });
                            }

                        });
                    }
                }
            }
        });
    }

    async loginToHX() {
        let id = await getStore('AccessUserId');
        WebIM.conn.open({
            apiUrl: WebIM.config.apiURL,
            user: id,
            pwd: id,
            appKey: WebIM.config.appkey
        });
        this.registerHXListener();
    }


     render() {
        const number = this.state.allNumber;
        return (
            <Drawer
                type="overlay"
                content={<UserDrawer   navigation = {this.props.navigation}/>}
                tapToClose={true}
                panOpenMask={0.1}
                openDrawerOffset={0.2} // 20% gap on the right side of drawer
                panCloseMask={0.1}
                closedDrawerOffset={0}
                styles={drawerStyles}
                onOpen={() => {
                    console.log('onopen')
                    this.setState({drawerOpen: true})
                }}
                onClose={() => {
                    console.log('onclose')
                    this.setState({drawerOpen: false})
                }}
                ref={(ref) => this._drawer = ref}
                tweenHandler={(ratio) => ({main: { opacity:(2-ratio)/2 }})}>

                <TabNavigator style={styles.container}>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'message'}
                        title="消息"
                        selectedTitleStyle={{color: "#3399ff"}}
                        renderIcon={() => <Image source = {Images.message_default} style = {styles.img}/>}
                        renderSelectedIcon={() => <Image source = {Images.message_focus} style = {styles.img}/>}
                        onPress={() => this.setState({selectedTab: 'message'})}
                        badgeText = {number && number.toString()}
                    >

                        <MessageScreen
                            navigation = {this.props.navigation}
                            drawerOpen = {this.openDrawer}
                        />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'sicklist'}
                        title="病人"
                        selectedTitleStyle={{color: "#3399ff"}}
                        renderIcon={() =>  <Image source = {Images.home_patient} style = {styles.img}/>}
                        renderSelectedIcon={() =>  <Image source = {Images.patient_focus} style = {styles.img}/>}
                        onPress={() => this.setState({selectedTab: 'sicklist'})}>
                        <SickListScreen
                            navigation = {this.props.navigation}
                        />
                    </TabNavigator.Item>

                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'community'}
                        title="社区"
                        selectedTitleStyle={{color: "#3399ff"}}
                        renderIcon={() =>  <Image source = {Images.community_default} style = {styles.img}/>}
                        renderSelectedIcon={() =>  <Image source = {Images.community_focus} style = {styles.img}/>}
                        onPress={() => this.setState({selectedTab: 'community'})}>
                        <CommunityScreen
                            navigation = {this.props.navigation}
                        />
                    </TabNavigator.Item>

                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'adress'}
                        title="通讯录"
                        selectedTitleStyle={{color: "#3399ff"}}
                        renderIcon={() =>  <Image source = {Images.adress_default} style = {styles.img}/>}
                        renderSelectedIcon={() =>  <Image source = {Images.address_list_focus} style = {styles.img}/>}
                        onPress={() => this.setState({selectedTab: 'adress'})}>
                        <AddressListScreen
                            navigation = {this.props.navigation}
                        />
                    </TabNavigator.Item>
                </TabNavigator>
            </Drawer>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    img:{
        height: px(44),
        width: px(44),
        resizeMode: 'contain',
        marginTop:-px(10)
    }
});

const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
    main: {paddingLeft: 0}
}
