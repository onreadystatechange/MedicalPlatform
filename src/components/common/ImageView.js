/**
 * Created by yjy on 2017/12/26.
 */

/**
 * Created by yjy on 2017/11/22.
 */
import ImageViewer from "react-native-image-zoom-viewer"
import React ,{Component} from 'react';
import { View, TouchableOpacity,TextInput,Text,ToastAndroid, Image,StyleSheet,Modal, Dimensions} from 'react-native';
const RNFS = require('react-native-fs');
import {getStore} from '../../libs/Storage'

export default class ImageView extends Component{
    state = {
        visible:false
    }

    async downloadFile(formUrl) {
        // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)

        const downloadDest = `${RNFS.ExternalDirectoryPath}/${((Math.random() * 1000) | 0)}.jpg`;
        const token = await getStore('AccessToken');
        // 文件
        // const downloadDest = `${RNFS.MainBundlePath}/${((Math.random() * 1000) | 0)}.zip`;
        // const formUrl = 'http://files.cnblogs.com/zhuqil/UIWebViewDemo.zip';

        // 视频
        // const downloadDest = `${RNFS.MainBundlePath}/${((Math.random() * 1000) | 0)}.mp4`;
        // http://gslb.miaopai.com/stream/SnY~bbkqbi2uLEBMXHxGqnNKqyiG9ub8.mp4?vend=miaopai&
        // https://gslb.miaopai.com/stream/BNaEYOL-tEwSrAiYBnPDR03dDlFavoWD.mp4?vend=miaopai&
        // const formUrl = 'https://gslb.miaopai.com/stream/9Q5ADAp2v5NHtQIeQT7t461VkNPxvC2T.mp4?vend=miaopai&';

        // 音频
        // const downloadDest = `${RNFS.MainBundlePath}/${((Math.random() * 1000) | 0)}.mp3`;
        // http://wvoice.spriteapp.cn/voice/2015/0902/55e6fc6e4f7b9.mp3
        // const formUrl = 'http://wvoice.spriteapp.cn/voice/2015/0818/55d2248309b09.mp3';
        const options = {
            fromUrl: formUrl,
            toFile: downloadDest,
            background: true,
            begin: (res) => {
                console.log('begin', res);
                console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'XSS-protext-Authorization':token,
            },
            progress: (res) => {
                let pro = res.bytesWritten / res.contentLength;
                this.setState({
                    progressNum: pro,
                });
            }
        };
        try {
            const ret = RNFS.downloadFile(options);
            ret.promise.then(res => {
                // console.log('success', res);
                ToastAndroid.show('保存成功',ToastAndroid.SHORT);
                console.log('file://' + downloadDest)

            }).catch(err => {
                console.log('err', err);
            });
        }
        catch (e) {
            console.log(error);
        }

    }

    open(){
        this.setState({
            visible:true
        })
    }

    close(){
        this.setState({
            visible:false
        })
    }

    render(){
        return (
            <Modal
                visible={this.state.visible}
                onRequestClose = {() =>this.close()}
                transparent={true}
            >
                <ImageViewer
                    index = {this.props.index}
                    imageUrls={this.props.images}
                    failImageSource={'../../images/error_image.jpg'}
                    onDoubleClick ={()=>this.close()}
                    maxOverflow = {10}
                    onSaveToCamera = {()=>{

                    }}
                     onSave = {(url)=>{
                       this.downloadFile(url);
                    }}
                />
            </Modal>
        );
    }
};
