/**
 * Created by yjy on 2018/2/5.
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
import {
    StyleSheet,
    Platform,
    Text,
    View,
    Alert,
    TouchableOpacity,
    Linking,
    Image} from 'react-native';
import {connect} from "react-redux";
import  {CommonTitle,MyWebView,Button}from '../components'
import Images from  '../themes/Images';
import {
    isFirstTime,
    isRolledBack,
    packageVersion,
    currentVersion,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
} from 'react-native-update';
import _updateConfig from '../../update.json';
const {appKey} = _updateConfig[Platform.OS];
export default class VersionUpdatingScreen extends Component {

    componentWillMount(){

    }

    doUpdate = info => {
        downloadUpdate(info).then(hash => {
            switchVersionLater(hash);
            Alert.alert('提示', '下载完毕,下次启动时自动更新');
        }).catch(err => {
            Alert.alert('提示', '更新失败.');
        });
    };

    checkUpdate = () => {
        checkUpdate(appKey).then(info => {
            if (info.expired) {
                Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
                    {text: '确定', onPress: ()=>{info.downloadUrl && Linking.openURL(info.downloadUrl)}},
                ]);
            } else if (info.upToDate) {
                Alert.alert('提示', '您的应用版本已是最新.');
            } else {
                Alert.alert('提示', '检查到新的版本'+info.name+',是否下载?\n'+ info.description, [
                    {text: '是', onPress: ()=>{this.doUpdate(info)}},
                    {text: '否',},
                ]);
            }
        }).catch(err => {
            Alert.alert('提示', '检查更新失败.');
        });
    };

    render() {
        const {navigation:{goBack,navigate}} = this.props;
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
                        <View >

                        </View>
                    }
                    title='版本更新'
                />
                <View style = {{height:px(30)}}/>
                <View style = {{flexDirection:'row',backgroundColor:'#fff',paddingRight:px(30),paddingLeft:px(30),height:px(100),alignItems:'center',justifyContent:'space-between'}}>
                    <Text style = {{color:'#333',fontSize:px(32)}}>
                        版本号
                    </Text>
                    <TouchableOpacity style = {{height:px(100),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}
                    >
                        <Text style = {{color:'#999',fontSize:px(32)}}>
                            {packageVersion}{'\n'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style = {{height:px(1),backgroundColor:'#eee'}}/>
                <View style = {{flexDirection:'row',backgroundColor:'#fff',paddingRight:px(30),paddingLeft:px(30),height:px(100),alignItems:'center',justifyContent:'space-between'}}>
                    <Text style = {{color:'#333',fontSize:px(32)}}>
                        Hash
                    </Text>
                    <TouchableOpacity style = {{height:px(100),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}
                    >
                        <Text style = {{color:'#999',fontSize:px(32)}}>
                            {currentVersion||'(空)'}{'\n'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style = {{ paddingRight:px(32),
                    paddingLeft:px(32),marginTop:px(48)}}>
                    <Button  inline onPress={this.checkUpdate} text = "检查更新"/>
                    <View style = {{height:px(60)}}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    image : {
    },
});