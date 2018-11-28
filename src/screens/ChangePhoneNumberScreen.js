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
import { View,Text,TouchableOpacity,Image,ScrollView,TextInput,Keyboard,ToastAndroid} from 'react-native';
import {connect} from "react-redux";
import {NavigationActions} from 'react-navigation'
import Images from  '../themes/Images';
import  {width} from '../libs/CSS'
import {CountDown,Button} from '../components'
import  {CommonTitle}from '../components'
import {Colors} from '../themes'
import http from '../libs/fetch'
import { clearStore} from '../libs/Storage'
import  WebIM from '../libs/WebIM'
import LoginActions from '../redux/LoginRedux'
const arrData = [
    {
        text:'验证身份',
        imgBlue:Images.verify_identity_blue,
        imgWhite:Images.verify_identity_white,
    },{
        text:'修改已验证手机',
        imgBlue:Images.change_already_phone_blue,
        imgWhite:Images.change_already_phone_white,
    },{
        text:'更换完成',
        imgBlue:Images.already_finish_blue,
        imgWhite:Images.already_finish_white,
    }

];

@connect(state =>({
    payload:state.user.doctor || {}
}),{
    logout:LoginActions.logout
})
export default class ChangePhoneNumberScreen extends Component {
    state = {
        index:0,
        code:'',
        newPhone:'',
        canScroll:false,
        nextcode:'',
        backBtnHide:false
    }

    componentDidMount(){

    }

    _renderHeader(){
        return arrData.map((item,index) =>
            <View style = {{flexDirection:'column',alignItems:'center'}} key ={index}>
                <View style = {{flexDirection:'row',backgroundColor:this.state.index === index?'#3399fe':'#fff',width:px(70),height:px(70),
                    borderRadius:px(35),alignItems:'center',justifyContent:'center'}}>
                    <Image
                        source = {
                            this.state.index === index?item.imgBlue:item.imgWhite
                        }
                        style = {{width:px(70),height:px(70)}}
                    />
                </View>
                <View style = {{height:px(30)}}/>
                <Text style = {{color:this.state.index === index?'#3399fe':'#999',fontSize:px(28)}}>
                    {item.text}
                </Text>
            </View>
        )
    }

    _handleSetUp(i){
        this.setState({
            index:i,
            canScroll:true
        },()=>{
            this.list.scrollTo({x: i*width, y: 0, animated: true});
            this.setState({
                canScroll:false
            })
        })
    }

    _resetlogin(){
        const {navigation:{navigate,goBack}} = this.props;
        const resetActions = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'LoginScreen'})]
        });
        clearStore('AccessToken');
        if (WebIM.conn.isOpened()) {
            WebIM.conn.close('logout');
        }
        this.props.logout();
        this.props.navigation.dispatch(resetActions);
    }

    _senPhoneCode(){
        const {payload:{phone}} = this.props;
        if(!this.state.code){
            ToastAndroid.show('请输入验证码',ToastAndroid.SHORT);
            return;
        }
        http('authen/smscode/check',{
            body:{
                phone,
                code:this.state.code
            }
        },true).then(data =>  {
            this._handleSetUp(1)
        });
    }

    _ok=()=>{
        const {payload:{phone}} = this.props;
        http(`authen/smscode/${phone}`).then(data =>{
                this.count.countDown();
                ToastAndroid.show('验证码发送成功',ToastAndroid.SHORT);
            }
        );
    }

    _okNext = () =>{
        const {newPhone} = this.state;
        http(`authen/smscode/${newPhone}`).then(data =>{
                this.nextCount.countDown();
                ToastAndroid.show('验证码发送成功',ToastAndroid.SHORT);
            }
        );
    }

    _checkNext(){
        const {newPhone,nextcode} = this.state;
        const {payload:{id}} = this.props;
        if(!this.state.newPhone){
            ToastAndroid.show('请输入新手机号',ToastAndroid.SHORT);
            return;
        }
        if(!this.state.nextcode){
            ToastAndroid.show('请输入验证码',ToastAndroid.SHORT);
            return;
        }
        http('authen/smscode/check',{
            body:{
                phone:newPhone,
                code:nextcode
            }
        },true).then(data =>  {
            http('doctor/resetphone',{
                body:{
                    phone:newPhone,
                    id
                },
                method:'put'
            }).then(data =>   {
                this.setState({
                    backBtnHide:true
                })
                this._handleSetUp(2);
            });
        });
    }


    _renderScrollView(){
        const {navigation:{navigate,goBack},payload:{phone}} = this.props;
        return(
            <ScrollView
                horizontal = {true}
                showsHorizontalScrollIndicator = {false}
                pagingEnabled = {true}
                ref = {(ref) => this.list = ref}
                scrollEnabled = {this.state.canScroll}
            >
                <View style = {{width:width}}>
                    <View style = {{height:px(250),paddingTop:px(46),paddingLeft:px(80),paddingRight:px(80),backgroundColor:'#fff',flexDirection:'column'}}>
                        <View style = {{flexDirection:'row',justifyContent:'flex-start'}}>
                            <Text style = {{color:"#333",fontSize:px(32)}}>
                                当前绑定手机号 {phone}
                            </Text>
                        </View>
                        <View style = {{height:px(44)}}/>
                        <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
                            <View style = {{flexDirection:'row',height:px(68),borderBottomWidth:px(1),borderBottomColor:'#3399fe',width:px(350)}}>
                                <View style = {{flexDirection:'row'}}>
                                    <Image style = {{width:px(58),height:px(58)}} source = {Images.Icon_Email}/>
                                </View>
                                <View style = {{width:px(26)}}/>
                                <View style = {{flexDirection:'row',flex:1}}>
                                    <TextInput placeholder = "请输入短信验证码"
                                               onChangeText = {(e) => {
                                                   this.setState({
                                                       code:e
                                                   })
                                               }}
                                               onSubmitEditing={Keyboard.dismiss}
                                               keyboardType = "numeric"
                                               value = {this.state.code}
                                               underlineColorAndroid='transparent'
                                               placeholderTextColor = '#aaa'
                                                style = {{flex:1,paddingVertical:5,color:'#aaa'}}
                                    />
                                </View>
                            </View>
                            <CountDown
                                vcode = {{
                                    height:px(68),
                                    width:px(178),
                                    flexDirection:'row',
                                    alignItems:'center',
                                    justifyContent:'center',
                                    borderRadius:px(34),
                                    backgroundColor:'#3399fe'
                                }}
                                ok = {this._ok} ref = {(ref)=> this.count = ref}
                                vcodeText = {{
                                    color:'#fff',
                                    fontSize:px(30)
                                }}
                                text = "验证码"
                            />
                        </View>
                    </View>
                    <View style = {{height:px(116)}}/>
                    <View style = {{paddingLeft:px(80),paddingRight:px(80)}}>
                        <Button  text = "验证" onPress = {() => this._senPhoneCode()}/>
                    </View>
                </View>


                <View style = {{width:width}}>
                    <View style = {{height:px(250),paddingTop:px(46),paddingLeft:px(80),paddingRight:px(80),backgroundColor:'#fff',flexDirection:'column'}}>
                        <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
                            <View style = {{flexDirection:'row',height:px(68),borderBottomWidth:px(1),borderBottomColor:'#3399fe',flex:1}}>
                                <View style = {{flexDirection:'row'}}>
                                    <Image style = {{width:px(58),height:px(58)}} source = {Images.Icon_Phone}/>
                                </View>
                                <View style = {{width:px(26)}}/>
                                <View style = {{flexDirection:'row',flex:1}}>
                                    <TextInput placeholder = "输入新手机号码"
                                               onChangeText = {(e) => {
                                                   this.setState({
                                                       newPhone:e
                                                   })
                                               }}
                                               onSubmitEditing={Keyboard.dismiss}
                                               keyboardType = "numeric"
                                               value = {this.state.newPhone}
                                               underlineColorAndroid='transparent'
                                               placeholderTextColor = '#aaa'
                                               style = {{flex:1,paddingVertical:5,color:'#aaa'}}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style = {{height:px(44)}}/>
                        <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
                            <View style = {{flexDirection:'row',height:px(68),borderBottomWidth:px(1),borderBottomColor:'#3399fe',width:px(350)}}>
                                <View style = {{flexDirection:'row'}}>
                                    <Image style = {{width:px(58),height:px(58)}} source = {Images.Icon_Email}/>
                                </View>
                                <View style = {{width:px(26)}}/>
                                <View style = {{flexDirection:'row',flex:1}}>
                                    <TextInput placeholder = "输入短信验证码"
                                               onChangeText = {(e) => {
                                                   this.setState({
                                                       nextcode:e
                                                   })
                                               }}
                                               onSubmitEditing={Keyboard.dismiss}
                                               keyboardType = "numeric"
                                               value = {this.state.nextcode}
                                               underlineColorAndroid='transparent'
                                               placeholderTextColor = '#aaa'
                                               style = {{flex:1,paddingVertical:5,color:'#aaa'}}
                                    />
                                </View>
                            </View>
                            <CountDown
                                vcode = {{
                                    height:px(68),
                                    width:px(178),
                                    flexDirection:'row',
                                    alignItems:'center',
                                    justifyContent:'center',
                                    borderRadius:px(34),
                                    backgroundColor:'#3399fe'
                                }}
                                ok = {this._okNext} ref = {(ref)=> this.nextCount = ref}
                                vcodeText = {{
                                    color:'#fff',
                                    fontSize:px(30)
                                }}
                                text = "验证码"
                            />
                        </View>
                    </View>

                    <View style = {{height:px(116)}}/>

                    <View style = {{paddingLeft:px(80),paddingRight:px(80)}}>
                        <Button  text = "提交" onPress = {() => this._checkNext()}/>
                    </View>
                </View>


                <View style = {{width:width}}>
                    <View style = {{height:px(216),paddingTop:px(58),alignItems:'center',backgroundColor:'#fff',flexDirection:'column'}}>
                        <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
                            <View style = {{flexDirection:'row',justifyContent:'flex-start'}}>
                                <Text style = {{color:"#333",fontSize:px(32)}}>
                                   恭喜您已成功更改了绑定手机
                                </Text>
                            </View>
                        </View>
                        <View style = {{height:px(38)}}/>
                        <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
                            <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
                                <View style = {{flexDirection:'row',justifyContent:'flex-start'}}>
                                    <Text style = {{color:"#333",fontSize:px(32)}}>
                                        手机号为： <Text style = {{color:'#3399fe',fontSize:px(32)}}>
                                        {this.state.newPhone}
                                    </Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style = {{height:px(50)}}/>

                    <View style = {{paddingLeft:px(80),paddingRight:px(80)}}>
                        <Button  text = "重新登陆" onPress = {() => this._resetlogin()}/>
                    </View>

                </View>


            </ScrollView>
        )

    }
    render() {
        const {navigation:{goBack,navigate}} = this.props;
        return (
            <View style={{flex: 1,backgroundColor:Colors.transparent}}>
                <CommonTitle
                    leftView = {
                        !this.state.backBtnHide && <TouchableOpacity activeOpacity={1} onPress={()=>{goBack(null)}}>
                            <View >
                                <Image source = {Images.back} style = {{width:px(28),height:px(48)}} />
                            </View>
                        </TouchableOpacity>
                    }
                    rightView = {
                        <View >

                        </View>
                    }
                    title = '更换绑定手机号'
                />
                <View style = {{height:px(270),paddingLeft:px(80),paddingRight:px(80),
                    flexDirection:'row',justifyContent:'space-around',paddingTop:px(80)}}>
                    {this._renderHeader()}
                </View>
                {this._renderScrollView()}
            </View>
        );
    }
}