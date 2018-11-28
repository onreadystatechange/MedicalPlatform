/**
 * Created by yjy on 2017/12/13.
 */
/**
 * Created by yjy on 2017/11/28.
 */
import React,{Component} from 'react';
import {Image,Text,View,TextInput} from 'react-native';
import {px} from '../../libs/CSS'

export default class TextareaInput extends Component {

    render() {
        const {title,text,onChangeText,defaultValue,placeholder,noTitle = false} = this.props;
        return(
            <View style  = {{backgroundColor:'#fff',flexDirection:'column',paddingLeft:px(30),paddingRight:px(30)}}>
                {!noTitle && <View style = {{flexDirection:'row',alignItems:'center',paddingTop:px(30),paddingBottom:px(30),justifyContent:'flex-start'}}>
                    <Text style = {{color:'#333',fontSize:px(32)}}>
                        {title}
                    </Text>
                </View>}
                <View style = {{flexDirection:'row',flex:1,borderColor:'#d5d5d5',
                    borderWidth:px(2),backgroundColor:'#eee',borderRadius:px(9)}}>
                    <TextInput
                        onChangeText = {onChangeText}
                        multiline = {true}
                        underlineColorAndroid="transparent"
                        defaultValue = {!!defaultValue?defaultValue:''}
                        placeholder = {!!placeholder?placeholder:''}
                        placeholderTextColor = "#999"
                        style = {{
                            padding:px(20),
                            textAlignVertical: 'top',
                            color:'#666',
                            height:px(300),
                            width:'100%'
                        }}
                        {...this.props}
                    />
                </View>
                <View style = {{height:px(40)}}/>
            </View>
        )
    }

}
