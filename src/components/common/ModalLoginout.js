/**
 * Created by yjy on 2017/12/2.
 */
import MyModal from "./MyModal";
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
import {px,width,height} from '../../libs/CSS'
import Colors from '../../themes/Colors'

export default class ModalLoginout extends  React.Component {

    onRequestClose(){
        this.props.onRequestClose()
    }

    onOk(){
        this.props.onOk();
        this.props.onRequestClose();
    }

    _render(){
        return(
            <View style = {{paddingLeft:px(60),paddingRight:px(60),flex:1,flexDirection:'row',alignItems:'center'}}>
                <View style = {{flex:1,height:px(180),backgroundColor:'#f1f1f1',flexDirection:'column',borderRadius:px(6)}}>
                    <View style = {{flexDirection:'row',justifyContent:'center',alignItems:'center',height:px(110)}}>
                        <Text style = {{fontSize:px(32),color:'#333'}}>
                            确定要退出登陆吗？
                        </Text>
                    </View>
                    <View style = {{flexDirection:'row',borderTopColor:'#d5d5d5',height:px(70),borderTopWidth:px(1)}}>
                        <View style = {{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress = {() => this.onRequestClose()}>
                                <Text style = {{color:Colors.navBarColor,fontSize:px(32)}}>
                                    取消
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {{width:px(1),backgroundColor:'#d5d5d5'}}/>
                        <View style = {{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress = {() => this.onOk()}>
                                <Text style = {{color:Colors.navBarColor,fontSize:px(32)}}>
                                    确定
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }


    render(){
        return(
            <MyModal
                modalVisible = {this.props.modalVisible}
                onRequestClose={()=> this.onRequestClose()}
            >
                {
                    this._render()
                }
            </MyModal>

        )
    }
}