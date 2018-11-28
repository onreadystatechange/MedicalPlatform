/**
 * Created by yjy on 2017/12/12.
 */
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
    TouchableWithoutFeedback
} from 'react-native';
import {px} from '../../libs/CSS'

const ListItemDndMode = (props)=>
    <View style = {{flexDirection:'row',flex:1,backgroundColor:'#fff',justifyContent:'space-between',alignItems:'center',height:px(100),paddingLeft:px(30),paddingRight:px(30)}}>
        <View style = {{flexDirection:'row',justifyContent:'flex-start'}}>
            {props.left}
        </View>
        <View style = {{flexDirection:'row',justifyContent:'flex-start'}}>
            {props.right}
        </View>
    </View>
;
export default ListItemDndMode;