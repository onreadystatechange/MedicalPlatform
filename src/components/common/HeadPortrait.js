/**
 * Created by yjy on 2017/12/15.
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
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import {px} from '../../libs/CSS';
import Images from '../../themes/Images';
import  {baseImgUrl} from '../../configs/BaseConfig'
const HeadPortrait = ({imageurl,onPress = null})=>
        <TouchableWithoutFeedback onPress={onPress}>
            {!!imageurl?
                <Image source = {{uri:baseImgUrl + imageurl}} style = {{width:px(80),height:px(80),borderRadius:px(10)}}/>:
                <Image source = {Images.default_hdimg} style = {{width:px(80),height:px(80),borderRadius:px(10)}}/>
            }
        </TouchableWithoutFeedback>
;
export default HeadPortrait;