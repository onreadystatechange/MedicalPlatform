/**
 * Created by yjy on 2017/11/29.
 */
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Dimensions,
    PixelRatio,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import {px} from '../../libs/CSS';
import Images from '../../themes/Images';
import  {baseImgUrl} from '../../configs/BaseConfig'
const ListItem = (props)=>
    <View
        style = {{width:width,backgroundColor:'#fff'}}
    >
        <TouchableOpacity style = {{
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'flex-start',
            height:px(130),
            paddingRight:px(30),paddingLeft:px(30),
        }} onPress = {() => props.onPress()}>
            <View>
                {!!props.imageurl?
                    <Image source = {{uri:baseImgUrl + props.imageurl}} style = {{width:px(80),height:px(80),borderRadius:px(10)}}/>:
                    <Image source = {Images.default_hdimg} style = {{width:px(80),height:px(80),borderRadius:px(10)}}/>
                }
            </View>
            <View style = {{width:px(30)}}/>
            <View style = {{flex:1,flexDirection:'row',alignItems:'center'}}>
                <Text style = {{fontSize:px(32),color:'#333'}}>
                    {props.name}
                </Text>
            </View>
        </TouchableOpacity>
        <View style = {{height:px(1),backgroundColor:'#eee'}}/>
    </View>
;
export default ListItem;