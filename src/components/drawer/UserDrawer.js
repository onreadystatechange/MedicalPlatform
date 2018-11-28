/**
 * Created by yjy on 2017/11/27.
 */
import React from 'react';
import {
    View,
    Image,
    Text,
    Button,
    FlatList,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    PixelRatio,
    Platform,
} from 'react-native';
import {connect} from "react-redux";
import  ApplicationStyles from '../../themes/ApplicationStyles'
import  Images from '../../themes/Images'
import ModalLoginout from '../common/ModalLoginout'
import LoadingView from '../common/LoadingView'
import ModalBusinessCard from '../common/ModalBusinessCard'
import ModalControllaDomande from '../common/ModalControllaDomande'
import {NavigationActions} from 'react-navigation';
import { setStore ,getStore, clearStore} from '../../libs/Storage'
import {uploadAvatar,baseImgUrl} from '../../configs/BaseConfig'
import LoginActions from '../../redux/LoginRedux'
import  WebIM from '../../libs/WebIM'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
const DrawerHeader = (props) => (
    <View style={{marginBottom:px(24),height:px(400)}}>
        <Image  source = {Images.leftnav_bg} style = {[ApplicationStyles.backgroundImage,{width:px(560),zIndex:-100,height:px(400),flex:1}]}>
        </Image>
        <View style = {{position:'absolute',height:px(96),width:'100%',justifyContent:'center',alignItems:'flex-end'}}>
            <TouchableOpacity onPress = {() => props.navigate('MyQrScreen')} >
                <Image source = {Images.code} style = {{height:px(42),width:px(42),marginRight:px(32)}} />
            </TouchableOpacity>
        </View>

        <View style = {{position:'absolute',marginTop:px(40),flex:1,width:'100%',justifyContent:'center',alignItems:'center'}}>

            <View style = {{width:px(170),height:px(170),
                borderRadius:px(85),position:'relative'}}>
                <View style = {{opacity:0.5,width:px(170),backgroundColor:'#fff',height:px(170),
                    borderRadius:px(85),position:'absolute',top:px(0),left:px(0),zIndex:10}}>
                </View>
                <View style = {{height:px(150),width:px(150),borderRadius:px(75),opacity:1,position:'absolute',top:px(10),left:px(10),zIndex:100}} >
                    {!props.imageurl?
                        <Image source = {Images.default_hdimg} style = {{height:px(150),width:px(150),borderRadius:px(75)}} />
                        : <Image source = {{uri:baseImgUrl+props.imageurl}} style = {{height:px(150),width:px(150),borderRadius:px(75)}} />
                    }
                </View>
            </View>
            <View style = {{height:px(20)}}/>
            <View style = {{flexDirection:'row',flex:1,justifyContent:'center'}}>
                <View>
                    <Text style = {{color:'#fff',fontSize:px(40)}}>
                        {props.dname}
                    </Text>
                </View>
            </View>
            <View style = {{height:px(20)}}/>
            <View style = {{flexDirection:'row',flex:1,justifyContent:'center'}}>
                <View>
                    <Text style = {{fontSize:px(28),color:'#fff'}}>
                        {props.phone}
                    </Text>
                </View>
            </View>
        </View>
    </View>
);

@connect(state =>({
    payload:state.user.doctor || {}
}),{
    logout:LoginActions.logout
})

export default class UserDrawer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible:false
        }
    }

    _onpress = () =>{
        this.setState({
            visible:true
        })
    }

    onOk = ()=>{
        const {navigation:{navigate},payload:{phone,imageurl,dname}} = this.props;
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

    onRequestClose = ()=>{
        this.setState({
            visible:false
        })
    }

    render() {
        const {navigation:{navigate},payload:{phone,imageurl,dname}} = this.props;
        return (
            <ScrollView style = {{flex:1,backgroundColor:'#fff',width:px(560)}}>
                <DrawerHeader navigate = {navigate} phone = {phone} imageurl={imageurl} dname = {dname}/>
                <TouchableOpacity
                    style = {{height:px(96),backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}}
                    onPress = {() => navigate('PersonalDataScreen')}
                >
                    <Image source = {Images.persion_data} style = {{height:px(50),width:px(50),marginLeft:px(50),marginRight:px(30)}}/>
                    <Text style = {{fontSize:px(36),color:'#333'}}>
                        个人资料
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style = {{height:px(96),backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}}
                    onPress = {() => navigate('ChangePhoneNumberScreen')}
                >
                    <Image source = {Images.change_phone} style = {{height:px(50),width:px(50),marginLeft:px(50),marginRight:px(30)}}/>
                    <Text style = {{fontSize:px(36),color:'#333'}}>
                        改绑手机
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style = {{height:px(96),backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}}
                    onPress = {() => navigate('ChangePasswordScreen')}
                >
                    <Image source = {Images.change_psd} style = {{height:px(50),width:px(50),marginLeft:px(50),marginRight:px(30)}}/>
                    <Text style = {{fontSize:px(36),color:'#333'}}>
                        修改密码
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style = {{height:px(96),backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}}
                    onPress = {() => navigate('DndModeScreen')}
                >
                    <Image source = {Images.donot_disturb} style = {{height:px(50),width:px(50),marginLeft:px(50),marginRight:px(30)}}/>
                    <Text style = {{fontSize:px(36),color:'#333'}}>
                        勿扰模式
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style = {{height:px(96),backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}}
                    onPress = {() => navigate('VersionUpdatingScreen')}
                >
                    <Image source = {Images.donot_disturb} style = {{height:px(50),width:px(50),marginLeft:px(50),marginRight:px(30)}}/>
                    <Text style = {{fontSize:px(36),color:'#333'}}>
                        版本更新
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style = {{height:px(96),backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}}
                    onPress = {() => navigate('WebViewScreen',{
                        title:'关于我们',
                        uri:'http://www.amdolla.com.cn/about.html'
                    })}
                >
                    <Image source = {Images.about_us} style = {{height:px(50),width:px(50),marginLeft:px(50),marginRight:px(30)}}/>
                    <Text style = {{fontSize:px(36),color:'#333'}}>
                        关于我们
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style = {{height:px(96),backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}}
                    onPress = {this._onpress}
                >
                    <Image source = {Images.layout} style = {{height:px(50),width:px(50),marginLeft:px(50),marginRight:px(30)}}/>
                    <Text style = {{fontSize:px(36),color:'#333'}}>
                        退出登录
                    </Text>
                </TouchableOpacity>
                <ModalLoginout
                    modalVisible={this.state.visible}
                    onRequestClose={this.onRequestClose}
                    onPress = {this._onpress}
                    onOk = {this.onOk}
                />
            </ScrollView>
        );
    }
};

