/**
 * Created by yjy on 2017/11/14.
 */
/**
 * Created by yjy on 2017/10/9.
 */

import React, { Component } from 'react';
import { View,Text,TouchableOpacity,Image,TextInput,StyleSheet,ScrollView,ToastAndroid,Animated,Keyboard,StatusBar} from 'react-native';
import {connect,store} from "react-redux";
import {NavigationActions} from 'react-navigation';
import {Images} from "../themes"
import {px,width,height} from "../libs/CSS"
import {InputBoard,Button} from "../components"
import Utils from "../utils/Utils"
import InputItemStyle from 'antd-mobile/lib/input-item/style/index.native'
import LoginActions from '../redux/LoginRedux'
const newStyle = {};
for (const key in InputItemStyle) {
    if (key === 'input') {
       for(const i in InputItemStyle['input']){
           if(i === "fontSize" || i === "color"){
               continue
           }
           newStyle[i] = InputItemStyle['input'][i];
       }
    }
}

@connect(
    state =>({

    }),
    {
        login:LoginActions.login
    }
)
export default class LoginScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            phone:'',
            password:''
        }
        this.imageHeight = new Animated.Value(px(204));
        this.imageWidth = new Animated.Value(px(204));
    }

    static navigationOptions = {
        header:null
    };

    componentWillMount () {
        // this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
        // this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
    }

    componentWillUnmount() {
        // this.keyboardWillShowSub.remove();
        // this.keyboardWillHideSub.remove();
    }

    keyboardWillShow = (event) =>{
        Animated.timing(this.imageHeight, {
            duration:300,
            toValue: px(150),
        }).start();
        Animated.timing(this.imageWidth, {
            duration: 300,
            toValue: px(150),
        }).start();
    };

    keyboardWillHide= (event) =>{
        Animated.timing(this.imageHeight, {
            duration: 300,
            toValue: px(204),
        }).start();
        Animated.timing(this.imageWidth, {
            duration: 300,
            toValue: px(204),
        }).start();
    };

    _toMain = () => {
        const {password,phone} = this.state;
        const {login} = this.props;
        if(Utils.isEmpty(password) ||  Utils.isEmpty(phone) ){
            ToastAndroid.show('手机号或密码不能为空',ToastAndroid.SHORT);
            return;
        }
        if(!/^1[3|4|5|7|8]\d{9}$/.test(phone)){
            ToastAndroid.show('请检查手机号码格式是否正确',ToastAndroid.SHORT);
            return;
        }
        login(phone,password,this._loginSuccess)
    };

    _loginSuccess =()=>{
        const {navigation:{navigate}} = this.props;
        const resetActions = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Home'})]
        });
        this.props.navigation.dispatch(resetActions);
    }

    render() {
        const {navigation:{navigate}} = this.props;
        const {phone,password} = this.state;
        return (
            <View style = {{flex:1}}>
                <StatusBar backgroundColor = {'#000'} />
                <ScrollView
                    contentContainerStyle={{flex:1}}
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='never'
                >
                    <Image source={Images.login_bg} style = {{flex:1,width:width,height:height,position:'absolute',top:px(0),left:px(0),right:px(0),bottom:px(0)}}>
                    </Image>
                    <InputBoard style = {{
                        paddingRight:px(30),
                        paddingLeft:px(30),
                    }}>
                        <View style = {{flexDirection:'row',justifyContent:'center',marginTop:px(150),marginBottom:px(120)}}>
                            <Image source = {Images.login_logo} style = {{height:px(204),width:px(204)}}/>
                        </View>

                        <View >
                            <TextInput placeholder = "请输入你的手机号"
                                       underlineColorAndroid='transparent'
                                       placeholderTextColor ='#999999'
                                       onChangeText = {(e) => {
                                           this.setState({
                                               phone:e
                                           })
                                       }}
                                       onSubmitEditing={Keyboard.dismiss}
                                       value = {this.state.phone}
                                       keyboardType = "numeric"
                                       style = {styles.input}/>

                        </View>
                        <View style = {{marginTop:px(56)}}>
                            <TextInput placeholder = "请输入你的密码"
                                       onChangeText = {(e) => {
                                           this.setState({
                                               password:e
                                           })
                                       }}
                                       onSubmitEditing={Keyboard.dismiss}
                                       keyboardType = "numeric"
                                       value = {this.state.password}
                                       underlineColorAndroid='transparent'
                                       secureTextEntry = {true}
                                       placeholderTextColor = '#999999' style = {styles.input}/>

                        </View>
                        <TouchableOpacity style = {{marginTop:px(56)}} activeOpacity={0.6}>
                            <Button  onPress = {() => this._toMain()}/>
                        </TouchableOpacity>
                        <View style = {{flexDirection:'row',marginTop:px(30),justifyContent:'flex-end'}}>

                            <View>
                                <TouchableOpacity onPress = {() => navigate("PhoneCheckScreen",{
                                    type:'RegisterScreen'
                                })} activeOpacity={0.6}>
                                    <Text  style = {styles.text}>
                                        注册
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style = {{marginRight:px(32),marginLeft:px(32)}}>
                                <TouchableOpacity onPress = {() => navigate("PhoneCheckScreen",{
                                    type:'ForgetPasswordScreen'
                                })} activeOpacity={0.6}>
                                    <Text style = {styles.text}>
                                        忘记密码
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </InputBoard>

                </ScrollView>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    input:{
        height:px(88),
        width:'100%',
        backgroundColor:'#fff',
        opacity:0.7,
        borderBottomWidth:0,
        paddingLeft:px(32),
        borderBottomLeftRadius:px(44),
        borderBottomRightRadius:px(44),
        borderTopLeftRadius:px(44),
        borderTopRightRadius:px(44),
        fontSize:px(32)
    },
    text:{
        fontSize:px(36),
        color:'#3399ff'
    }
});