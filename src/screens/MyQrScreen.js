/**
 * Created by yjy on 2017/12/4.
 */
/**
 * Created by yjy on 2017/11/27.
 */
/**
 * Created by yjy on 2017/11/14.
 */
/**
 * Created by yjy on 2017/10/9.
 */
'use strict';
import React, { Component } from 'react';
import { View,Text,TouchableOpacity,Image} from 'react-native';
import {connect} from "react-redux";
import Images from  '../themes/Images';
import Colors from '../themes/Colors';
import QRCode from 'react-native-qrcode-svg';
import  {CommonTitle}from '../components'
import {baseImgUrl,baseQrcodeUrl} from '../configs/BaseConfig'
import  {encodeSearchParams,queryString} from '../utils/DataDict'

@connect(state =>({
    payload:state.user.doctor || {}
}),{

})
export default class MyQrScreen extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(props){


    }

    render() {
        const {navigation:{goBack,navigate},payload:{id,imageurl,dname}} = this.props;
        return (
            <View style={{flex: 1}}>
                <CommonTitle
                    leftView = {
                        <TouchableOpacity activeOpacity={1} onPress={()=>{goBack(null)}}>
                            <View >
                                <Image source = {Images.back} style = {{width:px(28),height:px(48)}} />
                            </View>
                        </TouchableOpacity>
                    }
                    rightView = {
                        <View>

                        </View>
                    }
                    title='我的二维码'
                />
                <View style={{marginLeft:px(100),marginRight:px(100),backgroundColor:Colors.transparent, marginTop:px(130),flexDirection:'column',alignItems: 'center'}}>
                    <View style = {{height:px(800),width:px(520),flexDirection:'column',alignItems:'center',position:'relative',zIndex:1000}}>
                        <View style = {{position:'absolute',top:0,left:0}}>
                            <Image source  ={Images.erwei_zhuangshi} style = {{width:px(170),height:px(436)}}/>
                        </View>
                        <View style = {{marginTop:px(130)}}>
                            {
                                !imageurl?<Image source = {Images.default_hdimg} style = {{width:px(140),height:px(140),borderRadius:px(70)}}/>:
                                    <Image source = {{uri:baseImgUrl+imageurl}} style = {{width:px(140),height:px(140),borderRadius:px(70)}}/>
                            }

                        </View>
                        <View style = {{height:px(40)}}/>
                        <View>
                            <Text style = {{fontSize:px(40),color:'#333'}}>
                                {dname}
                            </Text>
                        </View>
                        <View style = {{height:px(50)}}/>
                        <View>
                            <QRCode
                                value={baseQrcodeUrl+encodeSearchParams({id:this.props.payload.id})}
                                logoSize={px(210)}
                                getRef={(c) => (this.svg = c)}
                                logoBackgroundColor='purple'
                                fgColor='white'/>
                        </View>
                        <View style = {{height:px(40)}}/>
                        <View>
                            <Text style = {{fontSize:px(28),color:'#999'}}>
                                扫一扫，加我为好友吧~
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

        );
    }
}