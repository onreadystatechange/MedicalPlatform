
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
    Modal
} from 'react-native';
import {px,width,height} from '../../libs/CSS'
import Colors from '../../themes/Colors'

export default class CommonModal extends  React.Component {
    state = {
        visible:false
    }


    show(){
        this.setState({
            visible:true
        })
    }

    onOk(){
        this.props.onOk();
        this.onclose();
    }

    onclose(){
        this.setState({
            visible:false
        })
    }

    _render(){
        return(
            <View style = {{paddingLeft:px(60),paddingRight:px(60),flex:1,flexDirection:'row',alignItems:'center'}}>
                <View style = {{flex:1,height:px(180),backgroundColor:'#f1f1f1',flexDirection:'column',borderRadius:px(6)}}>
                    <View style = {{flexDirection:'row',justifyContent:'center',alignItems:'center',height:px(110)}}>
                        <Text style = {{fontSize:px(32),color:'#333'}}>
                            {this.props.content}
                        </Text>
                    </View>
                    <View style = {{flexDirection:'row',borderTopColor:'#d5d5d5',height:px(70),borderTopWidth:px(1)}}>
                        <View style = {{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress = {() => this.onclose()}>
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
            <Modal
                visible = {this.state.visible}
                onRequestClose={()=> this.onclose()}
                animationType={'slide'}
                transparent = {true}
            >
                <View style = {
                    {
                        backgroundColor:'rgba(0, 0, 0, 0.5)',
                        flex: 1,
                        justifyContent: 'center'
                    }
                }>
                    {
                        this._render()
                    }
                </View>

            </Modal>

        )
    }
}