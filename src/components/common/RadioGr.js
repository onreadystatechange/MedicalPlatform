/**
 * Created by yjy on 2017/12/13.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'

export default class RadioGr extends Component{
    render(){
        const {data,onSelect,style = {}} = this.props;
        return(
            <RadioGroup
                onSelect = {onSelect}
                style = {style}
            >
                {!!data && data.map((item,index) => (
                    <RadioButton value={item.results} key = {index} style = {{marginTop:px(20),paddingLeft:px(30)}} >
                        <Text style = {{color:'#333',fontSize:px(33)}}>{item.results}</Text>
                    </RadioButton>
                ))}
            </RadioGroup>
        )
    }
}

