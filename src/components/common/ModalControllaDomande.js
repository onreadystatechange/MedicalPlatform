
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

export default class ModalControllaDomande extends  React.Component {

    state = {
        visible:false
    }

    open(){
        this.setState({
            visible:true
        })
    }

    close(){
        this.setState({
            visible:false
        })
    }

    onRequestClose(){
        this.close()
    }


    _render(){
        return(
            <View style = {{paddingLeft:px(60),paddingRight:px(60),flex:1,flexDirection:'row',alignItems:'center'}}>
                <View style = {{flex:1,backgroundColor:'#f1f1f1',flexDirection:'column',borderRadius:px(6)}}>

                    <View style = {{flexDirection:'row',justifyContent:'center',alignItems:'center'
                        ,paddingTop:px(40),paddingBottom:px(40)}}>
                        <Image
                            source = {Images.confim_friend}
                            style = {{height:px(100),width:px(100)}}
                        />
                    </View>

                    <View style = {{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Text style = {{fontSize:px(32),color:'#333'}}>
                            查看申请已提交
                        </Text>
                    </View>

                    <View style = {{height:px(30)}}/>

                    <View style = {{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Text style = {{color:'#999',fontSize:px(26)}}>
                           等待患者同意后可查看详情
                        </Text>
                    </View>
                    <View style = {{height:px(30)}}/>
                    <View style = {{height:px(1),backgroundColor:'#d5d5d5'}}/>
                    <View style = {{height:px(80),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity onPress = {() => this.onRequestClose()}>
                            <Text style = {{color:Colors.navBarColor,fontSize:px(32)}}>
                                确定
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }


    render(){
        return(
            <MyModal
                modalVisible = {this.state.visible}
                onRequestClose={()=> this.onRequestClose()}
            >
                {
                    this._render()
                }
            </MyModal>

        )
    }
}