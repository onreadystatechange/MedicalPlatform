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
import { View,Text,TouchableOpacity,Image,ScrollView,FlatList,TouchableNativeFeedback} from 'react-native';
import {connect} from "react-redux";
import {Images,Colors} from  '../themes';
import  {CommonTitle,HeadPortrait,Emptypage}from '../components';
import { ListView } from 'realm/react-native';
import  http from '../libs/fetch'
import  GetFriendListType from '../redux/GetFriendList';
import Swipeout from 'react-native-swipeout';
import  FriendRequestService from '../realm/service/FriendRequestService'
import repository from '../realm/repository'
import AllUserMesService from '../realm/service/AllUserMesService'
@connect(
    state =>({
        payload:state.user.doctor || {},
    }),
    {
        getPfriendList:GetFriendListType.getPfriendList,
        getDfriendList:GetFriendListType.getDfriendList
    }
)
export default class NewFriendScreen extends Component {
    constructor (props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {dataSource: this.ds.cloneWithRows(FriendRequestService.filter(this.props.payload.id))}
    }


    componentDidMount(){
        AllUserMesService.changeAll(this.props.payload.id);
        repository.objects('FriendReqSchema').addListener(() => {
            this.setState({ dataSource:  this.ds.cloneWithRows(FriendRequestService.filter(this.props.payload.id))})
        });
    }

    press(item){
        FriendRequestService.update(item);
        if(item.role === 'patient'){
            http(`friend/add/patient/${item.fromId}`,{
                body:{
                    userid:item.fromId,
                    remark:item.content
                },
                method:'post'
            })
        }else{
            http(`friend/add/doctor/${item.fromId}`,{
                body:{
                    userid:item.fromId,
                    remark:item.content
                },
                method:'post'
            })
        }
    }

    componentWillUnmount(){
        repository.removeAllListeners();
    }

    renderItem = (item,sectionID, rowID)=>{
        const swipeoutBtns = [
            {
                text: '删除',
                onPress:() =>  FriendRequestService.delete(item),
                backgroundColor:'#ff3b32',
                color:'#fff'
            }
        ];

        return(
            <Swipeout
                right={swipeoutBtns}
                close={!(this.state.sectionID === sectionID && this.state.rowID === rowID)}
                onOpen={(sectionID, rowID) => {
                    this.setState({
                        sectionID,
                        rowID,
                        isSwiping:true
                    })
                }}
                rowID={rowID}
                sectionID={sectionID}
                autoClose = {true}
                scroll={event => console.log(event)}
            >
                <TouchableNativeFeedback   background={TouchableNativeFeedback.SelectableBackground()} onPress={() => console.log('press children')}>
                    <View style={{backgroundColor:'#fff',paddingLeft:px(30),paddingRight:px(30)}} >
                        <View style = {{
                            alignItems:'center',flexDirection:'row',flex:1,paddingTop:px(30),paddingBottom:px(30),justifyContent:'flex-start'
                        }}>
                            <HeadPortrait imageurl = {item.imageurl}/>
                            <View style = {{width:px(30)}}/>
                            <View style = {{flexDirection:'column'}}>
                                <Text style = {{color:'#333',fontSize:px(32)}}>
                                    {item.fromname}
                                </Text>
                                <View style = {{height:px(5)}}/>
                                <Text style = {{fontSize:px(28),color:'#999'}}>
                                    {item.content}
                                </Text>
                            </View>
                            <View style = {{flex:1,justifyContent:'flex-end',flexDirection:'row'}}>
                                {item.status === 0 &&<TouchableOpacity style = {{alignSelf:'center',width:px(110),height:px(50),
                                    flexDirection:'row',alignItems:'center',borderColor:Colors.navBarColor,borderRadius:px(25),
                                    borderWidth:px(1),justifyContent:'center'}} onPress  ={()=> this.press(item)}>
                                    <Text style = {{fontSize:px(28),color:Colors.navBarColor}}>
                                        同意
                                    </Text>
                                </TouchableOpacity>}
                                {item.status === 1 && <Text style = {{fontSize:px(28),color:'#999'}}>
                                    已同意
                                </Text>}
                            </View>

                        </View>
                        <View style = {{height:px(1),backgroundColor:'#eee'}}/>
                    </View>
                </TouchableNativeFeedback>
            </Swipeout>

        )
    }


    render() {
        const {navigation:{goBack,navigate}} = this.props;
        console.log(this.state.dataSource);
        const data = FriendRequestService.filter(this.props.payload.id);
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
                    title= '新的朋友'
                />
                {
                    !!data && data.length === 0 ? <Emptypage /> : <ListView
                        ref={(List_View)=>this.List_View = List_View}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderItem}
                        enableEmptySections={true}
                    />
                }
            </View>
        );
    }
}