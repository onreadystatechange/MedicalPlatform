/**
 * Created by yjy on 2017/12/20.
 */
/**
 * Created by yjy on 2017/11/22.
 */
import React ,{Component} from 'react';
import { View, TouchableOpacity,TextInput,Text, Image,StyleSheet } from 'react-native';
import {Images} from '../../themes'
import {px,width,height} from '../../libs/CSS'

export default class Emptypage extends Component{
    render(){
        return (
            <View style = {[{flex:1,justifyContent:'center',alignItems:'center'},this.props.style && this.props.style]}>
                <Image source = {Images.nothing} style = {{width:px(420),height:px(400)}}/>
            </View>
        );
    }
};
