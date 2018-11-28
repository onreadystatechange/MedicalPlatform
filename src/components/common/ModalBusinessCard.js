/**
 * Created by yjy on 2017/12/2.
 */
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
import  Images from '../../themes/Images'

export default class ModalBusinessCard extends  React.Component {

    onRequestClose(){
        this.props.onRequestClose()
    }

    _render(){
        const {sendPerson,imageurl,personName} = this.props;
        return(
            <View style = {{paddingLeft:px(60),paddingRight:px(60),flex:1,flexDirection:'row',alignItems:'center'}}>
                <View style = {{flex:1,height:px(380),backgroundColor:'#fff',paddingLeft:px(30),paddingRight:px(30),flexDirection:'column',borderRadius:px(6)}}>
                    <View style = {{flexDirection:'row',justifyContent:'flex-start',paddingTop:px(30),paddingBottom:px(40)}}>
                        <Text style = {{fontSize:px(32),color:'#333'}}>
                            发送给
                        </Text>
                    </View>

                    <View style = {{flexDirection:'row',justifyContent:'flex-start'}}>
                        <View style = {{flex:1,flexDirection:'row',width:px(80),height:px(80),alignItems:'center'}}>
                            <View>
                                <Image source = {{uri:imageurl}} style = {{width:px(80),height:px(80),borderRadius:px(10)}}/>
                            </View>
                            <View style = {{width:px(30)}}/>
                            <View style = {{flex:1,flexDirection:'row',alignItems:'center'}}>
                                <Text style = {{fontSize:px(32),color:'#333'}}>
                                    {sendPerson}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style = {{height:px(30)}}/>
                    <View style = {{flexDirection:'row',backgroundColor:'#eee',height:px(60),borderRadius:px(6),alignItems:'center',justifyContent:'flex-start'}}>
                        <View style = {{width:px(30)}}/>
                        <View>
                            <Text style = {{color:'#999',fontSize:px(26)}}>
                                [ 个人名片 ]{personName}
                            </Text>
                        </View>
                    </View>
                    <View style = {{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                        <TouchableOpacity onPress = {() => this.onRequestClose()}>
                            <Text style = {{color:'#999',fontSize:px(32)}}>
                                取消
                            </Text>
                        </TouchableOpacity>
                        <View style = {{width:px(50)}}/>
                        <TouchableOpacity onPress = {() => this.props.handleSubmit()}>
                            <Text style = {{color:Colors.navBarColor,fontSize:px(32)}}>
                                发送
                            </Text>
                        </TouchableOpacity>
                        <View style = {{width:px(20)}}/>
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