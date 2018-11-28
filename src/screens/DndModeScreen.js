/**
 * Created by yjy on 2017/12/2.
 */
/**
 * Created by yjy on 2017/11/23.
 */
/**
 * Created by yjy on 2017/11/14.
 */
/**
 * Created by yjy on 2017/10/9.
 */

import ApplicationStyles from "../themes/ApplicationStyles"
import React, { Component } from 'react';
import { View,Text,TouchableOpacity,Image,TextInput,StyleSheet,ScrollView,ToastAndroid,Animated,Keyboard} from 'react-native';
import {store} from "react-redux";
import {NavigationActions} from 'react-navigation';
import {ListItemDndMode,Switch} from "../components"
import Images from  '../themes/Images';
import {Colors} from '../themes'
import  {CommonTitle}from '../components'

export  default  class DndModeScreen extends Component {
    state = {
        value:false
    }
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerLeft: (
            <TouchableOpacity activeOpacity={1} onPress={()=>{navigation.goBack(null)}}>
                <View style={{paddingLeft:px(32)}}>
                    <Image source = {Images.back} style = {{width:px(28),height:px(48)}} />
                </View>
            </TouchableOpacity>
        ),
        title: '勿扰模式',
        headerRight: ( <View style={{paddingRight:px(10)}}>

            </View>
        )
    })



    _renderLeft(){
        return(
            <Text style = {{color:'#333',fontSize:px(32)}}>
                勿扰模式
            </Text>
        )
    }

    _handleChange(value){
       this.setState({
           value
       })
    }

    _renderRight(){
        return(
            <Switch
                width={60}
                height={30}
                value={this.state.value}
                onSyncPress={(value) => this._handleChange(value) }
            />
        )

    }

    render() {
        const {navigation:{goBack,navigate}} = this.props;
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
                    title= '勿扰模式'
                />
                <ScrollView
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='never'
                    style={ApplicationStyles.screen.container}
                >

                    <ListItemDndMode
                        left = {this._renderLeft()}
                        right = {this._renderRight()}
                    />

                </ScrollView>
            </View>


        )}
}