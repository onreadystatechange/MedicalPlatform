/**
 * Created by yjy on 2017/11/22.
 */
import React ,{Component} from 'react';
import { View, TouchableOpacity,TextInput,Text, Image,StyleSheet } from 'react-native';
import * as _ from 'lodash'
export default class Button extends Component{

    debouncePress = onPress => {
        const clickTime = Date.now();
        if (!this.lastClickTime ||
            Math.abs(this.lastClickTime - clickTime) > 2000) {
            this.lastClickTime = clickTime;
            onPress()
        }
    }

    render(){

        const {onPress,text,style} = this.props;
        return (
            <TouchableOpacity onPress = {()=>this.debouncePress(onPress)}>
                <View style = {{height:px(88),
                    backgroundColor:'#3399ff',
                    borderBottomLeftRadius:px(44),
                    borderBottomRightRadius:px(44),
                    borderTopLeftRadius:px(44),
                    borderTopRightRadius:px(44),
                    justifyContent:'center',
                    alignItems:'center',
                    ...style
                }}>
                    <Text style = {{color:'#fefefe',fontSize:px(32)}}>
                        {text || '登陆'}
                    </Text>
                </View>

            </TouchableOpacity>
        );
    }
};
