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
import { View,Text,FlatList,PixelRatio,TouchableOpacity,TextInput,TouchableWithoutFeedback,TouchableNativeFeedback,StyleSheet,Image,ScrollView} from 'react-native';
import {connect} from "react-redux";
import {Images,Colors,Metrics} from  '../themes';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import ApplicationStyles from '../themes/ApplicationStyles'
import {px} from '../libs/CSS'
import Swipeout from 'react-native-swipeout';
import IconBadge from 'react-native-icon-badge';
import  {CommonTitle}from '../components'
import {baseImgUrl} from '../configs/BaseConfig'
import AllUserMesService from '../realm/service/AllUserMesService'
import SingleMessageService from '../realm/service/SingleMessageService'
import repository from '../realm/repository'
import Emptypage from "../components/common/Emptypage";
@connect(state =>({
    payload:state.user.doctor || {}
}),{

})
export default class MessageScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            isRefreshing: false,
            modalVisible: false,
            focused: false,
            search: '',
            selectedTab: 'contacts',
            notifyCount: 0,
            presses: 0,
            data: {
                // [群组通知，好友通知, 通知总数]
                // notices: [null,subscribes, length],
                notices: [],
                // 作为Groups的快捷按钮使用
                groupHeader: ['INIT'],
                friends: [],
            },
            dataSource: AllUserMesService.filter(this.props.payload.id),
            sectionID: '',
            rowID: '',
            isSwiping:false
        }
    }

    componentDidMount(){
        repository.objects('AllMessSchema').addListener((puppies, changes)=>{
                this.change()
            }
        );
    }

    componentWillUnmount(){
        repository.removeAllListeners();
    }

    change = ()=>{
        this.setState({
            dataSource:AllUserMesService.filter(this.props.payload.id)
        })
    }



    renderItem = (item)=>{
        const {item:{uniqueId,imageurl,label,time,lastMessage,chatId,msgType},index} = item;
        const {navigation:{navigate,goBack}} = this.props;
        if(msgType === 'txt' || msgType === 'card' || msgType === 'image'){
            return this.renderTxt(item);
        }else if(msgType === 'addFriend'){
            return this.renderAddFriend(item);
        }
    }

    renderAddFriend(item){
        const {item:{uniqueId,imageurl,label,time,number,lastMessage,chatId,msgType},index} = item;
        const {navigation:{navigate,goBack}} = this.props;
        const swipeoutBtns = [
            {
                text: '删除',
                onPress:() =>  {
                    AllUserMesService.delete(item.item);
                    // FriendRequestService.deleteAll();
                },
                backgroundColor:'#ff3b32',
                color:'#fff'
            }
        ];
        return(
            <Swipeout
                right={swipeoutBtns}
                rowID={index}
                autoClose = {true}
                onClose={() => this.setState({
                    isSwiping:false
                }) }
                scroll={event => console.log(event)}
            >
                <TouchableNativeFeedback   background={TouchableNativeFeedback.SelectableBackground()} onPress={() =>navigate('NewFriendScreen') }>
                    <View  style={Styles.itemBox}>
                        <View style={[Styles.listIcon]}>
                            <Image source={Images.add_new_friend}
                                   style={{width: px(80), height:  px(80), borderRadius: px(10)}}/>
                        </View>

                        <View style={[Styles.listContent]}>
                            <View style={Styles.listContentTop}>
                                <Text style={Styles.listContentTopText}>新朋友</Text>
                                <View style={Styles.listContentTopTime}>
                                    <Text style={Styles.listContentTopTimeText}>{time.toString()}</Text>
                                </View>
                            </View>
                            <View>
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <View style = {{flex:4}}>
                                        <Text style={Styles.listLastMessage} numberOfLines={1}>
                                            {lastMessage.toString()}
                                        </Text>
                                    </View>
                                    <View style = {{flex:1}}>
                                        <IconBadge
                                            MainElement={
                                                <View />
                                            }
                                            BadgeElement={
                                                <Text style={{color:'#FFFFFF'}}>{parseInt(number) > 99?'99+':number.toString()}</Text>
                                            }
                                            IconBadgeStyle={
                                                {width:px(54),
                                                    height:px(36),
                                                    backgroundColor: '#ff3b32'}
                                            }
                                            Hidden={!number && parseInt(number) === 0}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>

            </Swipeout>
        )
    }

    renderTxt(item){
        const {item:{uniqueId,imageurl,label,time,lastMessage,chatId,msgType,number},index} = item;
        console.log(number);
        const {navigation:{navigate,goBack}} = this.props;
        const swipeoutBtns = [
            {
                text: '删除',
                onPress:() =>  {
                    AllUserMesService.delete(item.item);
                    SingleMessageService.deleteAll(uniqueId);
                },
                backgroundColor:'#ff3b32',
                color:'#fff'
            }
        ];
        const text = msgType === 'txt'?lastMessage.toString():msgType === 'card'? '[名片]':msgType === 'image'?'[图片]':'';
        return(
            <Swipeout
                right={swipeoutBtns}
                rowID={index}
                autoClose = {true}
                onClose={() => this.setState({
                    isSwiping:false
                }) }
                scroll={event => console.log(event)}
            >
                <TouchableNativeFeedback   background={TouchableNativeFeedback.SelectableBackground()} onPress={() =>navigate('ChatScreen',{
                    item:{
                        imageurl:imageurl,
                        id:chatId,
                        remark:label
                    }
                }) }>
                    <View  style={Styles.itemBox}>
                        <View style={[Styles.listIcon]}>
                            <Image source={{uri:baseImgUrl+imageurl}}
                                   style={{width: px(80), height:  px(80), borderRadius: px(10)}}/>
                        </View>

                        <View style={[Styles.listContent]}>
                            <View style={Styles.listContentTop}>
                                <Text style={Styles.listContentTopText}>{label.toString()}</Text>
                                <View style={Styles.listContentTopTime}>
                                    <Text style={Styles.listContentTopTimeText}>{time.toString()}</Text>
                                </View>
                            </View>
                            <View>
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <View style = {{flex:4}}>
                                        <Text style={Styles.listLastMessage} numberOfLines={1}>
                                            {text}
                                        </Text>
                                    </View>
                                    <View style = {{flex:1}}>
                                        <IconBadge
                                            MainElement={
                                                <View />
                                            }
                                            BadgeElement={
                                                <Text style={{color:'#FFFFFF'}}>{parseInt(number) > 99?'99+':number.toString()}</Text>
                                            }
                                            IconBadgeStyle={
                                                {width:px(54),
                                                    height:px(36),
                                                    backgroundColor: '#ff3b32'}
                                            }
                                            Hidden={!number && parseInt(number) === 0}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>

            </Swipeout>
        )
    }

    _renderCancel() {
        return this.state.focused ? (
            <TouchableOpacity style={Styles.searchCancel} onPress={this.handleCancelSearch.bind(this)}>
                <View>
                    <Text>清除</Text>
                </View>
            </TouchableOpacity>
        ) : null;
    }


    _renderContent() {
        const {navigation:{navigate,goBack},payload:{imageurl}} = this.props;
        return (
            <View style={{height:px(96),width:Metrics.screenWidth,
                flexDirection:'row',backgroundColor:'#eee',paddingLeft:px(30),paddingRight:px(30),paddingTop:px(16),paddingBottom:px(16)}}>
                {/* TODO: Input */}
                <View style = {Styles.search}>
                    <View style={Styles.searchRow}>
                        <TouchableOpacity style = {{flexDirection:'row'}} onPress = {() => console.log(9)}>
                            <Ionicons name="ios-search-outline" size={18} color='#bbb'/>
                            <View style = {{width:px(16)}}/>
                            <Text style = {{color:'#bbb'}}>
                                搜索
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* TODO: longPress */}
                {/* 取消按钮，当input聚焦的时候出现 */}
                {this._renderCancel()}
                {/* 加号 */}
            </View>

        )
    }

    _keyExtractor = (item, index) => item.uniqueId;

    render() {
        const {navigation:{navigate,goBack},payload:{imageurl,id}} = this.props;
        console.log(999);
        return (
            <View style={[ApplicationStyles.mainContainer,{flex:1}]}>
                <CommonTitle
                    title = "消息"
                    leftView={
                        <TouchableOpacity activeOpacity={1} onPress={()=>{this.props.drawerOpen('DrawerOpen')}}>
                            <View >
                                {
                                    !imageurl? <Image source = {Images.default_msgimg} style={{width:px(64),height:px(64),borderRadius:px(32)}} />
                                        :<Image source = {{uri:baseImgUrl+imageurl}} style={{width:px(64),height:px(64),borderRadius:px(32)}} />
                                }


                            </View>
                        </TouchableOpacity>
                    }
                    rightView={
                        <TouchableOpacity activeOpacity={1} onPress={()=>{navigate('QrCodeScreen')}}>
                            <View >
                                <Image source = {Images.scan} style = {{height:px(42),width:px(42)}}/>
                            </View>
                        </TouchableOpacity>
                    }
                />
                {/*{this._renderContent()}*/}
                <View style = {[Styles.dtListOne,{flex:1,  backgroundColor: Colors.transparent}]}>
                    {this.state.dataSource && this.state.dataSource.length >0 ?<FlatList
                        ref={(flatList)=>this.flatList = flatList}
                        data={this.state.dataSource}
                        renderItem={this.renderItem}
                        keyExtractor={this._keyExtractor}
                        style = {{flex:1}}
                    />:<Emptypage/>}
                </View>
            </View>
        );
    }
}


const Styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#efefef',
    },
    // 头
    header: {
        height: 44,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        backgroundColor: Colors.bgGrey
    },
    search: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor:'#e6e6e6',
        borderRadius:px(6),
    },
    searchRow: {
        // color: Colors.blueyGrey,
        flex: 1,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.paleGrey,
        flexDirection: 'row'
    },
    searchInputView: {
        flexDirection: 'row'
    },
    searchInput: {
        flex: 1,
        height: 30,
        fontSize: px(28),
        paddingVertical: 5,
        color:'#bbb'
    },
    searchIcon: {

        justifyContent: 'center',
    },
    searchFocus: {
        flex: 0,
        width: 20,
        alignItems: 'center'
    },
    searchCancel: {
        width: 50,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchPlus: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // ListView
    listView: {
        flex: 1,
    },
    row: {
        marginHorizontal: 15,
        height: 50,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginHorizontal: 15,
        backgroundColor: '#CCCCCC',
    },
    rowLogo: {
        marginTop: 10,
        width: 30,
        height: 30,
        borderRadius: 15
    },
    rowName: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 5
    },
    groupHeader: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#CCCCCC'
    },
    groupHeaderTextWrapper: {
        paddingLeft: 15,
        justifyContent: 'center',
    },
    groupHeaderText: {
        fontSize: 15,
    },
    groupHeaderIcon: {
        flex: 1,
        paddingRight: 16,
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    noticeHeaderWrapper: {
        height: 40,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: Colors.denim
    },
    noticeHeaderText: {
        color: Colors.snow,
        textAlign: 'left',
    },
    noticeHeaderLeft: {
        width: 45,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    noticeHeaderRight: {
        flex: 1,
        justifyContent: 'center',
    },
    noticeHeaderMiddle: {
        flex: 1,
        justifyContent: 'center',
    },
    noticeHeaderTextRight: {
        textAlign: 'right',
        paddingRight: 15
    },
    buttonGroup: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    accept: {
        height: 40,
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: Colors.buttonGreen,
        marginRight: 5,
    },
    decline: {
        height: 40,
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: Colors.buttonGrey,
    },
    itemBox: {
        flexDirection: 'row',
        flex:1,
        backgroundColor:'#fff',
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#eee'
    },
    listIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        overflow: 'hidden'
    },
    listContent: {
        flex: 1,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10
    },
    listContentTop: {
        flexDirection: 'row',
        marginBottom: 5
    },
    listContentTopText: {
        flex: 1,
        color: '#333',
        fontSize: px(32)
    },
    listContentTopTime: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    listContentTopTimeText: {
        color: '#999',
        fontSize: px(26)
    },
    listLastMessage: {
        fontSize: px(26),
        color: '#999'
    },
    dtListOne: {
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: '#ddd',
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#ddd'
    }

});