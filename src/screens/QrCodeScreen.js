/**
 * Created by yjy on 2017/12/5.
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

import React, { Component } from 'react';
import {connect} from "react-redux";
import Images from  '../themes/Images';
import { View,Text,TouchableOpacity,Image,AsyncStorage ,BackAndroid,ToastAndroid,StatusBar} from 'react-native';
import  {CommonTitle}from '../components'
import {QRScannerView} from 'ac-qrcode';
import {baseQrcodeUrl} from '../configs/BaseConfig'
import  {parseQueryString} from '../utils/DataDict'
import CheckUtils from '../utils/CheckUtils'
import  http from '../libs/fetch'
import CountEmitter from './../libs/CountEmitter';
@connect(state =>({
    payload:state.user.doctor || {},
}),{

})
export default class QrCodeScreen extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerLeft: (
            <TouchableOpacity activeOpacity={1} onPress={()=>{navigation.goBack(null)}}>
                <View style={{paddingLeft:px(32)}}>
                    <Image source = {Images.back} style = {{width:px(28),height:px(48)}} />
                </View>
            </TouchableOpacity>
        ),
        title: '二维码扫描',
        headerRight: ( <View style={{paddingRight:px(10)}}>

            </View>
        )
    })

    componentDidMount(){

    }



    barcodeReceived(e) {
        // ToastAndroid.show('Type: ' + e.type + '\nData: ' + e.data,ToastAndroid.SHORT);
        const {navigation:{goBack,navigate},payload} = this.props;
        // if(CheckUtils.checkURL(e.data)){
        //     navigate('WebViewScreen',{
        //         uri:e.data
        //     });
        //     return;
        // }
        console.log(e.data);
        if(e.data.includes(baseQrcodeUrl)){
            const item = parseQueryString(e.data.split('?')[1]);
            if(item.id === payload.id){
                return;
            }
            http(`friend/search/qrcode/${item.id}`).then(data =>{
                if(!!data && data.hasOwnProperty('doctor')){
                    return CountEmitter.emit('gopage',item.id,'doctor');
                    // navigate('SearchResultDoctor',{
                    //     item:item.id
                    // });
                    // return;
                }else{
                    return CountEmitter.emit('gopage',item.id,'patient');
                    // navigate('SearchResultPatient',{
                    //     item:item.id
                    // });
                    //
                    // return;
                }
            })
        } else if(CheckUtils.checkURL(e.data)){
            navigate('WebViewScreen',{
                uri:e.data
            });
            return;
        }else{
            ToastAndroid.show('Type: ' + e.type + '\nData: ' + e.data,ToastAndroid.SHORT);
        }
    }

    render() {
        const {navigation:{goBack,navigate}} = this.props;
        return (
                < QRScannerView
                    cornerBorderLength={80}
                    cornerBorderWidth={6}
                    rectWidth={280}
                    rectHeight={280}
                    scanBarImage={null}
                    cornerColor='#1DA1F266'
                    cornerOffsetSize={0}
                    borderWidth={0}
                    hintTextPosition={70}
                    maskColor='#0000004D'
                    bottomMenuHeight={80}
                    bottomMenuStyle={{backgroundColor:'#0000004D',height:80}}
                    onScanResultReceived={this.barcodeReceived.bind(this)}
                    isShowScanBar={false}
                    renderTopBarView={() => {
                        return (
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
                                title='二维码扫描'
                            />)
                    }}

                    renderBottomMenuView={() => <View>

                    </View>}
                />
        );
    }
}