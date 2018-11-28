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
import { View,Text,TouchableOpacity,Image,TouchableWithoutFeedback,StyleSheet,TouchableNativeFeedback,ListView,ScrollView,RefreshControl} from 'react-native';
import {connect} from "react-redux";
import  {CommonTitle,DashLine}from '../components';
import {Colors,Images} from '../themes'
import  GetDiscussType from '../redux/GetDiscussList';
import {cutString} from '../utils/Utils'
import  AllUserMesService from '../realm/service/AllUserMesService'
@connect(state =>({
    payload:state.user.doctor || {},
    myOwner:state.discuss.list.myOwner || [],
    myJoin:state.discuss.list.myJoin || [],
}),{
    getDiscuss:GetDiscussType.getDiscussList
})
export default class CommunityScreen extends Component {
    ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    state = {
        publish:true,
        isRefreshing:false
    }

    componentDidMount(){
        // const id = this.props.payload.id;
        // this.props.getDiscuss(id);
        // console.log(this.props.content);
    }

    _handleClick(boolean){
        this.setState({
            publish:boolean
        })
    }

    _handleRefresh() {
        this.setState({isRefreshing: true});
        // TODO: 刷新成功/刷新失败
        const id = this.props.payload.id;
        this.props.getDiscuss(id);
        setTimeout(() => {
            this.setState({isRefreshing: false})
        }, 0)
    }

    _renderRow = (rowData, sectionID, rowID, highlightRow)=>{
        const {navigation:{goBack,navigate}} = this.props;
        const {item,confirmresults,hxgroupid,id,owner,disscussPatientPO:{historyId,patientId,disscussId}} = rowData;
        const number = AllUserMesService.getNum(this.props.payload.id+'-'+disscussId);
        const lastMsg = AllUserMesService.getLastMsg(this.props.payload.id+'-'+disscussId);
        const {msgType,time,lastMessage,label} = lastMsg;
        return(
            <View>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.SelectableBackground()}
                    onPress = {()=>navigate('GroupChatScreen',{
                        item:{id:disscussId,patientId,historyId,owner},
                        keys:{ A_key:this.props.navigation.state.key}
                    })}
                >
                    <View  style = {{paddingLeft:px(30),backgroundColor:'#fff',paddingRight:px(30)}}>
                        <View style = {{height:px(70),flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                            <Text>
                                <Text style = {{color:'#333',fontSize:px(30)}}>
                                    {item? cutString(item,20):''}
                                </Text>
                                <Text style = {{color:Colors.navBarColor,fontSize:px(28),opacity:0.5}}>
                                    {!!confirmresults?'(已结束)':''}
                                </Text>
                            </Text>
                            {number > 0 && <Text style = {{color:'#ff3b32',fontSize:px(60)}}>
                                .
                            </Text>}
                        </View>
                        <View style = {{height:px(1),width:width - px(60)}}>
                            <Image style = {{height:px(1),width:width - px(60)}} source = {Images.line}/>
                        </View>
                        <View style = {{paddingTop:px(10),paddingBottom:px(20)}}>
                            <Text style = {{color:'#666',fontSize:px(28),lineHeight:px(50)}}>
                                {label?label+':':''}{msgType === 'image'?'[图片]': cutString(lastMessage ? lastMessage:'',100)}
                            </Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <View style = {{height:px(20)}}/>
            </View>

        )
    }

    _renderTabs(){
        return(
            <View style = {{width:px(520),
                height:px(60),
                flexDirection:'row',
                borderBottomRightRadius:px(28),
                borderTopRightRadius:px(28),
                borderTopLeftRadius:px(28),
                borderBottomLeftRadius:px(28),
                alignItems:'center'}}>

                <TouchableWithoutFeedback
                    onPress = {()=>this._handleClick(true)}

                >
                    <View
                        style = {{
                            flex:1,
                            borderTopLeftRadius:px(28),
                            borderBottomLeftRadius:px(28),
                            backgroundColor:this.state.publish?Colors.navBarColor:'#fff',
                            borderWidth:px(1),
                            height:px(60),
                            alignItems:'center',
                            borderColor:Colors.navBarColor,
                            justifyContent:'center',
                        }}
                    >
                        <Text
                            style = {[this.state.publish?styles.activeTextColor:styles.defaultTextColor]}
                        >
                            我发布的
                        </Text>
                    </View>

                </TouchableWithoutFeedback>


                <TouchableWithoutFeedback
                    onPress = {()=>this._handleClick(false)}
                >
                    <View
                        style = {{
                            flex:1,
                            borderColor:Colors.navBarColor,
                            borderBottomRightRadius:px(28),
                            borderWidth:px(1),
                            borderTopRightRadius:px(28),
                            backgroundColor:!this.state.publish?Colors.navBarColor:'#fff',
                            height:px(60),
                            alignItems:'center',
                            justifyContent:'center',
                        }}
                    >
                        <Text
                            style = {[!this.state.publish?styles.activeTextColor:styles.defaultTextColor]}
                        >
                            我参与的
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    render() {
        const {navigation:{goBack,navigate}} = this.props;
        const {myOwner,myJoin} = this.props;
        const data = this.state.publish?myOwner:myJoin;
        return (
            <View style={{flex: 1,backgroundColor:Colors.transparent}}>
                <CommonTitle
                    leftView = {
                        <TouchableOpacity activeOpacity={1} onPress={()=>{goBack(null)}}>

                        </TouchableOpacity>
                    }
                    rightView = {
                        <TouchableOpacity>

                        </TouchableOpacity>
                    }
                    title= '社区'
                />
                <View style = {{width:width,height:px(100),flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}>
                    {this._renderTabs()}
                </View>
                {this.state.publish?<ListView
                    ref={(list)=>this.list = list}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._handleRefresh.bind(this)}
                            tintColor="#3399ff"
                            title="Loading..."
                            titleColor="#fff"
                            colors={['#3399ff', '#3399ff', '#3399ff']}
                            progressBackgroundColor="#fff"
                        />
                    }
                    enableEmptySections={true}
                    dataSource={this.ds.cloneWithRows(myOwner)}
                    renderRow={ this._renderRow}
                    renderHeader={() => {
                        return (  <View style = {{height:px(20)}}/>)
                    }}
                />:
                <ListView
                    ref={(list)=>this.list = list}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._handleRefresh.bind(this)}
                            tintColor="#3399ff"
                            title="Loading..."
                            titleColor="#fff"
                            colors={['#3399ff', '#3399ff', '#3399ff']}
                            progressBackgroundColor="#fff"
                        />
                    }
                    enableEmptySections={true}
                    dataSource={this.ds.cloneWithRows(myJoin)}
                    renderRow={ this._renderRow}
                    renderHeader={() => {
                        return (  <View style = {{height:px(20)}}/>)
                    }}
                />}

                <View style = {{flex:1}}>
                    {(!!data && data.length ===0)  &&
                    <View style = {{flex:1,alignItems:'center',justifyContent:'flex-start'}}>
                        <Text style = {{color:'#999',fontSize:px(30)}}>
                            暂无主题
                        </Text>
                    </View>}
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    activeStyle:{
        backgroundColor:Colors.navBarColor
    },
    activeTextColor:{
        color:'#fff'
    },
    defaultTextColor:{
        color:Colors.navBarColor
    },
    defaultStyle:{
        backgroundColor:'#fff'
    }
});