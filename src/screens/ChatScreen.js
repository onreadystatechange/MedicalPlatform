/**
 * Created by yjy on 2018/1/4.
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
import { View,Text,TouchableOpacity,Dimensions,Keyboard,ListView,RecyclerViewBackedScrollView,
    Image,PixelRatio,TouchableWithoutFeedback,StyleSheet,TouchableNativeFeedback,FlatList,ToastAndroid,ScrollView,RefreshControl} from 'react-native';
import {connect} from "react-redux";
import  {CommonTitle,HeadPortrait,ImageView,ModalBusinessCard,ChatBottomBar,MoreView}from '../components';
import {Colors,Images} from '../themes'
import {isEmpty} from '../utils/Utils'
import {px} from '../libs/CSS'
const {width} = Dimensions.get('window');
import {baseImgUrl} from '../configs/BaseConfig'
const MSG_LINE_MAX_COUNT = 15;
import TimeUtil from '../utils/TimeUtil';
import WebIM from '../libs/WebIM';
import repository from '../realm/repository';
import SingleMessageService from '../realm/service/SingleMessageService'
import AllUserMesService from '../realm/service/AllUserMesService'
import {uploadImage} from '../services/UserService'
import {isEqual} from 'lodash';
import CountEmitter from './../libs/CountEmitter';
import EmojiPanel from 'react-native-emoji-panel';
@connect(state =>({
    payload:state.user.doctor || {},
}),{

})
export default class ChatScreen extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const item = this.props.navigation.state.params.item;
        const {pname,imageurl,id,sex,pnickname,remark} = item;
        this.state = {
            showEmojiView: false,
            showMoreView:false,
            height:0,
            msg:'',
            visible:false,
            selectItems:{},
            dataSource: this.ds.cloneWithRows(SingleMessageService.filter(this.props.payload.id+'-'+item.id)),
            imgArr:[],
            index:0,
            listHeight:0,
            isRefreshing:false,
            footerY:0,
        };
    }

    componentDidMount(){
        const item = this.props.navigation.state.params.item;
        const {pname,imageurl,id,sex,pnickname,remark} = item;
        AllUserMesService.changeAll(this.props.payload.id+'-'+item.id);
        repository.objects('ChatMessageSchema').addListener((puppies, changes) => {
            this.messageChange();
        });
        this.scrollToEnd();
        // console.log(SingleMessageService.filter(this.props.payload.id+'-'+item.id));
        // repository.addListener('change',this.messageChange);
    }

    componentWillUnmount(){
        const item = this.props.navigation.state.params.item;
        AllUserMesService.changeAll(this.props.payload.id+'-'+item.id);
        repository.removeAllListeners();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!isEqual(this.props, nextProps)) {
            return true;
        }
        if (!isEqual(this.state, nextState)) {
            return true;
        }
        return false;
    }


    messageChange = ()=>{
        const item = this.props.navigation.state.params.item;
        const {pname,imageurl,id,sex,pnickname,remark} = item;
        this.setState({
            dataSource:  this.ds.cloneWithRows(SingleMessageService.filter(this.props.payload.id+'-'+item.id))
        },()=>this.scrollToEnd())
    };




    shouldShowTime(item,index) { // 该方法判断当前消息是否需要显示时间
        const items = this.props.navigation.state.params.item;
        if (index == 0) {
            // 第一条消息，显示时间
            return true;
        }
        if (index > 0) {
            let messages = SingleMessageService.filter(this.props.payload.id+'-'+items.id);
            if (!isEmpty(messages) && messages.length > 0) {
                let preMsg = messages[index - 1];
                let delta = parseInt(item.time) - parseInt(preMsg.time);
                if (delta > 3 * 60) {
                    return true;
                }
            }
            return false;
        }
    }

    // 当str长度超过某个限定值时，在str中插入换行符
    spliceStr(str) {
        var len = str.length;
        if (len > MSG_LINE_MAX_COUNT) {
            var pageSize = parseInt(len / MSG_LINE_MAX_COUNT) + 1;
            var result = '';
            var start, end;
            for (var i = 0; i < pageSize; i++) {
                start = i * MSG_LINE_MAX_COUNT;
                end = start + MSG_LINE_MAX_COUNT;
                if (end > len) {
                    end = len;
                }
                result += str.substring(start, end);
                result += '\n';
            }
            return result;
        } else {
            return str;
        }
    }

    renderReceivedTextMsg(item,index) { // 接收的文本消息
        const {id, content,msgType,fromname,imageurl,read,time,uniqueId} = item;
        return (
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                {
                    this.shouldShowTime(item,index) ? (
                        <Text style={listItemStyle.time}>{TimeUtil.formattimeStamp(parseInt(time))}</Text>
                    ) : (null)
                }
                <View style={listItemStyle.container}>
                    <HeadPortrait imageurl = {imageurl}/>
                    <View style={listItemStyle.msgContainer}>
                        <Text style={[listItemStyle.msgText,{color:'#333'}]}>{this.spliceStr(content)}</Text>
                    </View>
                </View>
            </View>
        );
    }

    renderSendTextMsg(item,index) { // 发送出去的文本消息
        const {id, content,msgType,fromname,imageurl,read,time,uniqueId} = item;
        // 发送出去的消息
        console.log(content);
        return (
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                {
                    this.shouldShowTime(item,index) ? (
                        <Text style={listItemStyle.time}>{TimeUtil.formattimeStamp(parseInt(time))}</Text>
                    ) : (null)
                }
                <View style={listItemStyle.containerSend}>
                    <View style={listItemStyle.msgContainerSend}>
                        <Text style={[listItemStyle.msgText,{color:'#fff'}]}>{this.spliceStr(content)}</Text>
                    </View>
                    <HeadPortrait imageurl = {imageurl}/>
                </View>
            </View>
        );
    }

    renderReceivedImgMsg(item,index) { // 接收的图片消息
        const {id, content,msgType,fromname,imageurl,read,time,uniqueId} = item;
        return (
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                {
                    this.shouldShowTime(item,index) ? (
                        <Text style={listItemStyle.time}>{TimeUtil.formattimeStamp(parseInt(time))}</Text>
                    ) : (null)
                }
                <View style={listItemStyle.container}>
                   <HeadPortrait imageurl = {imageurl}/>
                    <TouchableOpacity onPress = {()=>{
                        const imgArr = [];
                        imgArr.push({url:baseImgUrl+content});
                        this.setState({
                            imgArr:imgArr
                        },()=>this.imgView.open());
                    }} >
                        <View style={[listItemStyle.msgContainer, {paddingLeft: 0, paddingRight: 0}]}>
                            <Image
                                source={{uri:baseImgUrl+content}}
                                style={{width: 150, height: 150,borderRadius: 3}}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    renderSendImgMsg(item,index) { // 发送的图片消息
        const {id, content,msgType,fromname,imageurl,read,time,uniqueId} = item;
        const url =  id === 'test-2018'?content:baseImgUrl+content;
        return (
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                {
                    this.shouldShowTime(item,index) ? (
                        <Text style={listItemStyle.time}>{TimeUtil.formattimeStamp(parseInt(time))}</Text>
                    ) : (null)
                }
                <View style={listItemStyle.containerSend}>
                    <TouchableOpacity onPress = {()=>{
                        const imgArr = [];
                        imgArr.push({url:url});
                        this.setState({
                            imgArr:imgArr
                        },()=>this.imgView.open());
                    }}>
                        <View style={[listItemStyle.msgContainerSend, {paddingLeft: 0, paddingRight: 0}]}>
                            <Image
                                source={{uri:url}}
                                style={{width: 150, height: 150,borderRadius: 3}}
                            />
                        </View>
                    </TouchableOpacity>

                    <HeadPortrait imageurl = {imageurl}/>
                </View>
            </View>
        );
    }

    renderSendCard(item,index){
        const {content,msgType,fromname,read,time,uniqueId} = item;
        const {pname,dname,imageurl,id} = JSON.parse(content);
        const type = dname?'doctor':'patient';
        return(
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                {
                    this.shouldShowTime(item,index) ? (
                        <Text style={listItemStyle.time}>{TimeUtil.formattimeStamp(parseInt(time))}</Text>
                    ) : (null)
                }
                <View style={listItemStyle.containerSend}>
                    <View style={[listItemStyle.msgContainer, {marginRight:px(20),paddingLeft: 0, paddingRight: 0}]}>
                       <TouchableOpacity style = {{width:px(420),height:px(200)}} onPress = {() =>  CountEmitter.emit('gopage',id,type)}>
                           <View style = {{padding:px(30),flexDirection:'row',alignItems:'center'}}>
                               {/*{!!imageurl?*/}
                               {/*<Image source = {{uri:baseImgUrl + imageurl}} style = {{width:px(80),height:px(80),borderRadius:px(10)}}/>:*/}
                               {/*<Image source = {Images.default_hdimg} style = {{width:px(80),height:px(80),borderRadius:px(10)}}/>*/}
                               {/*}*/}
                               <Image source = {{uri:baseImgUrl +imageurl}} style = {{width:px(70),height:px(70),borderRadius:px(10)}}/>
                               <View style = {{width:px(20)}}/>
                               <Text style = {{color:'#333',fontSize:px(32)}}>
                                   {pname || dname}
                               </Text>
                           </View>
                           <View style = {{width:'100%',height:px(1),backgroundColor:'#d5d5d5'}}/>
                           <View style = {{paddingLeft:px(30),flexDirection:'row',flex:1,alignItems:'center'}}>
                                <Text style = {{color:'#999',fontSize:px(24)}}>
                                    个人名片
                                </Text>
                           </View>
                       </TouchableOpacity>
                    </View>
                    <HeadPortrait imageurl = {item.imageurl}/>
                </View>
            </View>
        )
    }

    renderReceiveCard(item,index){
        const {content,msgType,fromname,read,time,uniqueId} = item;
        const {pname,dname,imageurl,id} = JSON.parse(content);
        const type = dname?'doctor':'patient';
        return (
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                {
                    this.shouldShowTime(item,index) ? (
                        <Text style={listItemStyle.time}>{TimeUtil.formattimeStamp(parseInt(time))}</Text>
                    ) : (null)
                }
                <View style={listItemStyle.container}>
                    <HeadPortrait imageurl = {item.imageurl}/>
                    <View style={[listItemStyle.msgContainer, {paddingLeft: 0, paddingRight: 0}]}>
                        <TouchableOpacity style = {{width:px(420),height:px(200)}} onPress = {() =>  CountEmitter.emit('gopage',id,type)}>
                            <View style = {{padding:px(30),flexDirection:'row',alignItems:'center'}}>
                                {/*{!!imageurl?*/}
                                {/*<Image source = {{uri:baseImgUrl + imageurl}} style = {{width:px(80),height:px(80),borderRadius:px(10)}}/>:*/}
                                {/*<Image source = {Images.default_hdimg} style = {{width:px(80),height:px(80),borderRadius:px(10)}}/>*/}
                                {/*}*/}
                                <Image source = {{uri:baseImgUrl +imageurl}} style = {{width:px(70),height:px(70),borderRadius:px(10)}}/>
                                <View style = {{width:px(20)}}/>
                                <Text style = {{color:'#333',fontSize:px(32)}}>
                                    {pname || dname}
                                </Text>
                            </View>
                            <View style = {{width:'100%',height:px(1),backgroundColor:'#d5d5d5'}}/>
                            <View style = {{paddingLeft:px(30),flexDirection:'row',flex:1,alignItems:'center'}}>
                                <Text style = {{color:'#999',fontSize:px(24)}}>
                                    个人名片
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
    updateView =(emoji, more) =>{
        this.setState({
            showEmojiView: emoji,
            showMoreView: more,
        })
    }

    handleSendBtnClick = (msg) => {
        this.sendTextMessage(msg,'txt');
        this.setState({
            msg:''
        })
    }

    sendTextMessage(txt,type) { // 发送文本消息
        const item = this.props.navigation.state.params.item;
        const {pname,imageurl,id,sex,pnickname,remark,dname} = item;
        let error = false;
        const textId = WebIM.conn.getUniqueId();                 // 生成本地消息id
        const msg = new WebIM.message('txt', textId);// 创建文本消息
        let  message={};
        message.type='text';
        let identity;
       !!this.props.payload.pname?identity = 'patient':identity = 'doctor';
        message.content={
            type:type,
            data:txt,
            identity,
            time:TimeUtil.currentTime()
        };
        let data=JSON.stringify(message);
        console.log(txt);
        msg.set({
            msg: data,                  // 消息内容
            to:id,                    // 接收消息对象（用户id）
            roomType: false,
            success:  (id, serverMsgId) =>{
                error = false;
                if(type === 'card'){
                    txt = JSON.stringify(txt);
                }
                if(type === 'image'){
                    const cools = SingleMessageService.filterId('test-2018');
                    SingleMessageService.delete(cools,{
                        id:msg.body.id,
                        content:txt,
                        msgType:type,
                        fromname:'我',
                        fromId:this.props.payload.id,
                        imageurl:this.props.payload.imageurl,
                        read:true,
                        time:TimeUtil.currentTime(),
                        uniqueId:this.props.payload.id+'-'+item.id,
                        error
                    });
                    this.changeView();
                }else{
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
                            uniqueId:this.props.payload.id+'-'+item.id,
                            error
                        }
                    );
                }
                if(!error){
                    AllUserMesService.save({
                        id:this.props.payload.id,
                        label:remark || pname || dname,
                        lastMessage:txt,
                        time:TimeUtil.formattimeStamp(TimeUtil.currentTime()),
                        number:0,
                        imageurl:imageurl,
                        msgType:type,
                        uniqueId:this.props.payload.id+'-'+item.id,
                        isMe:true,
                        chatId:item.id
                    })
                }
                if(type !== 'image'){
                    this.changeView();
                }
                console.log('发送成功',message,serverMsgId,id);
            },
            fail: (e)=>{
                error = true;
                console.log("发送失败");
                ToastAndroid.show("发送失败",ToastAndroid.SHORT);
            }
        });
        msg.body.chatType = 'singleChat';
        WebIM.conn.send(msg.body);
        console.log(msg.body);

    }

    afterUploadImg = (img)=>{
        const item = this.props.navigation.state.params.item;
        const {pname,imageurl,id,sex,pnickname,remark,dname} = item;
        this.sendTextMessage(img,"image");
        // this.setState({
        //     dataSource:this.ds.cloneWithRows(SingleMessageService.filter(this.props.payload.id+'-'+item.id))
        // });
    };

   sendImageMessage = (image)=> {
       const item = this.props.navigation.state.params.item;
       const {pname,imageurl,id,sex,pnickname,remark,dname} = item;
       SingleMessageService.save({
           id:'test-2018',
           content:image.uri,
           msgType:'image',
           fromname:'我',
           fromId:this.props.payload.id,
           imageurl:this.props.payload.imageurl,
           read:true,
           time:TimeUtil.currentTime(),
           uniqueId:this.props.payload.id+'-'+item.id,
           error:false
       });
       this.setState({
           dataSource:this.ds.cloneWithRows(SingleMessageService.filter(this.props.payload.id+'-'+item.id))
       });
        uploadImage(image,this.afterUploadImg);
        console.log(image);
    };

    changeView(){
        this.setState({
            showMoreView:false,
            showEmojiView:false
        },()=>{
            this.scrollToEnd();
            Keyboard.dismiss();
        })
    }

    inputChange =(text)=>{
        this.setState({
            msg:text
        })
    };

    showCard(selectItems){
        this.setState({
            visible:true,
            selectItems
        })
    }

    close(){
        this.setState({
            visible:false
        })
    }

    changeText = (emoji)=>{
        this.inputChange(this.state.msg+emoji);
    };

    renderItem = (rowData, sectionID, rowID, highlightRow)=>{
        let item = rowData;
        const {id, content,msgType,fromname,imageurl,read,time,uniqueId} = item;
        if(msgType === 'txt'){
            if(fromname === '我'){
                return this.renderSendTextMsg(item,rowID);
            }else{
                return this.renderReceivedTextMsg(item,rowID);
            }
        }else if (msgType === 'image') {
            // 图片消息
            if(fromname === '我'){
                return this.renderSendImgMsg(item,rowID);
            }else{
                return this.renderReceivedImgMsg(item,rowID);
            }
        }else if(msgType === 'card'){
            // 名片消息
            if(fromname === '我'){
                return this.renderSendCard(item,rowID);
            }else{
                return this.renderReceiveCard(item,rowID);
            }
        }
    };

    handleRefresh() {
        this.setState({isRefreshing: true});
        // TODO: 刷新成功/刷新失败
        setTimeout(() => {
            this.setState({isRefreshing: false})
        }, 0)
    }

    scrollToEnd() {
        console.log(111);
        if ( "listHeight" in this.state &&
            "footerY" in this.state &&
            this.state.footerY > this.state.listHeight) {
            let scrollDistance = this.state.listHeight - this.state.footerY;
            console.log(scrollDistance,2222);
            this.list.scrollTo({y: -scrollDistance, animated: true});
        }
    }

    render() {
        const {navigation:{goBack,navigate}} = this.props;
        const moreView = [];
        const item = this.props.navigation.state.params.item;
        const {pname,imageurl,id,sex,pnickname,remark,dname} = item;
        const {selectItems} = this.state;
        // console.log(item);
        if (this.state.showMoreView) {
            moreView.push(
                <View key={"more-view-key"}>
                    <View style={{width: width, height: 1 / PixelRatio.get(), backgroundColor: '#D3D3D3'}}/>
                    <View style={{height:160}}>
                        <MoreView
                            navigation = {this.props.navigation}
                            sendImageMessage={this.sendImageMessage}
                            showCard = {this.showCard.bind(this)}
                            item = {item}
                        />
                    </View>
                </View>
            );
        }
        if (this.state.showEmojiView) {
            moreView.push(
                <View key={"emoji-view-key"}>
                    <View style={{width: width, height: 1 / PixelRatio.get(), backgroundColor: '#D3D3D3'}}/>
                    <View style={{height:160}}>
                        <EmojiPanel onPick={this.changeText} bgColor = {'#f7f7f7'} showSwitchMenu = {true}/>
                    </View>
                </View>
            );
        }
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
                        <TouchableOpacity>

                        </TouchableOpacity>
                    }
                   title= {remark || pname || dname}
                />
                <View style = {styles.content}>
                    <ListView
                        ref={(list)=>this.list = list}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.handleRefresh.bind(this)}
                                tintColor="#3399ff"
                                title="Loading..."
                                titleColor="#fff"
                                colors={['#3399ff', '#3399ff', '#3399ff']}
                                progressBackgroundColor="#fff"
                            />
                        }
                        keyboardShouldPersistTaps={'never'}
                        keyboardDismissMode = {'on-drag'}
                        onContentSizeChange = {(w,h)=>this.list.scrollToEnd()}
                        showsVerticalScrollIndicator = {false}
                        renderScrollComponent={props => <ScrollView {...props} />}
                        initialListSize={20}
                        enableEmptySections={true}
                        dataSource={this.state.dataSource}
                        renderRow={ this.renderItem}
                        onLayout={(event) => {
                            this.setState({
                                listHeight: event.nativeEvent.layout.height
                            })
                        }}
                        renderFooter={() => {
                            return (<View onLayout={(event) => {
                                this.setState({
                                    footerY: event.nativeEvent.layout.y
                                })
                            }}/>)
                        }}
                    />
                    <View style={[styles.bottomBar]}>
                        <ChatBottomBar
                            updateView={this.updateView}
                            handleSendBtnClick={this.handleSendBtnClick}
                            ref={(r) => { this._chatBottomBar = r }}
                            inputChange = {this.inputChange}
                            value = {this.state.msg}
                        />
                    </View>
                    {moreView}
                </View>

                  <ModalBusinessCard
                      modalVisible = {this.state.visible}
                      onRequestClose = {()=>this.close()}
                      sendPerson = {remark || pname || dname}
                      personName = {selectItems.pname || selectItems.dname}
                      handleSubmit = {() => {
                          this.sendTextMessage(selectItems,'card')
                          this.close();
                      }}
                      imageurl = {baseImgUrl+imageurl}
                  />
                <ImageView
                    ref={(imgView)=>this.imgView = imgView}
                    index = {0}
                    images = {this.state.imgArr}
                />
            </View>
        );
    }
}
const listItemStyle = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        flexDirection: 'row',
        padding: px(30),
    },
    avatar: {
        width: 40,
        height: 40,
    },
    msgContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: px(6),
        paddingLeft: px(20),
        paddingRight: px(20),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: px(20),
    },
    msgContainerSend: {
        backgroundColor: '#90c3f7',
        borderRadius: px(6),
        paddingLeft:  px(20),
        paddingRight: px(20),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: px(20),
    },
    msgText: {
        fontSize: 15,
        lineHeight: 24,
    },
    containerSend: {
        flex: 1,
        width: width,
        flexDirection: 'row',
        padding: px(30),
        justifyContent: 'flex-end',
    },
    time: {
        backgroundColor: '#D4D4D4',
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 5,
        color: '#FFFFFF',
        marginTop: 10,
        fontSize: 11,
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: Colors.transparent
    },
    bottomBar: {
        flexDirection:'row',
        backgroundColor:'#f7f7f7'
    },
    divider: {
        width: width,
        height: 1 / PixelRatio.get(),
        backgroundColor: '#D3D3D3',
    },
    emojiPicker:{
        height: 800,
        backgroundColor: '#f4f4f4'
    }
});


