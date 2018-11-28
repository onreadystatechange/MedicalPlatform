/**
 * Created by yjy on 2017/12/8.
 */
import React from 'react'
import {StyleSheet} from 'react-native';
import {List,InputItem,TextareaItem,Picker} from "antd-mobile";
import InputItemStyle from 'antd-mobile/lib/input-item/style/index.native'
import  {px} from '../../libs/CSS'
const newStyle = {};
for (const key in InputItemStyle) {
    if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
        // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
        newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
        if (key === 'input') {
            newStyle[key].color = '#666';
            newStyle[key].fontSize = px(32);
            newStyle[key].width = px(300);
        }
        if(key === "text"){
            newStyle[key].color = '#333';
            newStyle[key].fontSize = px(32);
        }
        if(key === "container"){
            newStyle[key].flexDirection = 'row';
            newStyle[key].height = px(98);
            newStyle[key].alignItems = 'center';
        }
    }
}

export default MyComponent = (props)=>{
    return(
        <InputItem
            styles={newStyle}
            {...props}
        />
    )
}