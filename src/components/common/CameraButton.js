/**
 * Created by yjy on 2017/12/5.
 */
import React from 'react'
import {
    TouchableOpacity,
    StyleSheet,
    Platform,
    ActivityIndicator,
    View,
    Text,
    ToastAndroid,
    Image
} from 'react-native'
import {uploadImage} from '../../services/UserService'
// import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from "react-redux";
import UploadAcatarAction from '../../redux/UploadAvatar'
import  Colors from '../../themes/Colors'
import ImagePicker from 'react-native-image-crop-picker'
import {px} from '../../libs/CSS'
import {uploadAvatar,baseImgUrl} from '../../configs/BaseConfig'
import  Utils from '../../utils/Utils'
import { setStore ,getStore, clearStore} from '../../libs/Storage'
const options = {
    title: '选择图片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '图片库',
    cameraType: 'back',
    mediaType: 'photo',
    videoQuality: 'high',
    durationLimit: 10,
    maxWidth: 600,
    maxHeight: 600,
    aspectX: 2,
    aspectY: 1,
    quality: 0.8,
    angle: 0,
    allowsEditing: false,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
@connect(
    state=>(
        {

        }
    ),{
        uploadAvatar:UploadAcatarAction.uploadAvatar
    }
)
class CameraButton extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showProgress:false,
            avatar:''
        }
        this.token = '';
    }

    async componentDidMount(){
        this.token = await getStore('AccessToken');
    }
    render() {
        const {imageurl,type} = this.props;

        return ( !this.state.showProgress ? <TouchableOpacity
                onPress={this.showImagePicker.bind(this)}
                style={[this.props.style,styles.cameraBtn]}>
                <View>
                    {!this.state.avatar && !imageurl? <Icon name="md-camera" color="#aaa" size={34}/>:
                        !this.state.avatar?<Image source = {{uri:baseImgUrl+imageurl}} style = {{width:px(84),height:px(84),borderRadius:px(42)}}/>:
                        <Image source = {{uri:baseImgUrl+this.state.avatar}} style = {{width:px(84),height:px(84),borderRadius:px(42)}}/> }
                </View>
            </TouchableOpacity>:
            <ActivityIndicator
                color={Colors.navBarColor}
                size="small"
            />)

    }

    showImagePicker() {
        console.log(this.token);
            // 修改头像
            ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
                compressImageMaxWidth:px(84),
                showCropGuidelines:false,
                cropperCircleOverlay:true
            }).then(image => {
                // image: Object {size: 34451, mime: "image/jpeg", height: 300, width: 300, path: "file:///data/user/0/com.testreactnavigation/cache/…p-picker/01b5d49d-3805-45d3-bdd7-4f49939706d0.jpg"}
                this.setState({showProgress: true});
                console.log(image);
                let path = image.path;
                let filename = path.substring(path.lastIndexOf('/') + 1, path.length);
                // let username = this.state.username;
                let formData = new FormData();
                // formData.append('username', username);
                let file = {uri: image.path, type: 'multipart/form-data', name: filename};
                formData.append('file', file);
                formData.append('dir', 'user/images/logo');
                fetch(uploadAvatar, {method: 'POST',headers: {
                    'XSS-protext-Authorization':this.token,
                }, body:
                    formData,
                })
                    .then((res) => res.json())
                    .then((json) => {
                    console.log(json)
                        this.setState({showProgress: false});
                        if (!Utils.isEmpty(json)) {
                            console.log(json);
                            if (json.retCode === '000000') {
                                this.setState({avatar: json.data.photoid});
                                this.props.onFileUpload(json.data.photoid);
                                console.log(json.data.photoid);
                                ToastAndroid.show('上传头像成功',ToastAndroid.SHORT);

                            } else {
                                console.warn(JSON.stringify(json));
                                ToastAndroid.show('' + json.msg,ToastAndroid.SHORT);
                                // console.warn('json.msg: ' + json.msg)
                            }
                        }
                    }).catch((e) => {
                    this.setState({showProgress: false});
                    ToastAndroid.show('' + e.toString(),ToastAndroid.SHORT);
                    console.warn('exception: ' + e.toString())
                })

            });
        }
    //     ImagePicker.showImagePicker(options, (response) => {
    //         if (response.didCancel) {
    //             console.log('User cancelled image picker');
    //         }
    //         else if (response.error) {
    //             console.log('ImagePicker Error: ', response.error);
    //         }
    //
    //         else {
    //
    //             let source;
    //
    //             if (Platform.OS === 'android') {
    //                 source = {uri: response.uri, isStatic: true}
    //             } else {
    //                 source = {uri: response.uri.replace('file://', ''), isStatic: true}
    //             }
    //
    //
    //
    //
    //             let file;
    //             if(Platform.OS === 'android'){
    //                 file = response.uri
    //             }else {
    //                 file = response.uri.replace('file://', '')
    //             }
    //
    //             this.setState({
    //                 loading:true
    //             });
    //             this.onFileUpload(file,response.fileName||'未命名文件.jpg')
    //                 .then(result=>{
    //                     console.log(result)
    //                     this.setState({
    //                         loading:false,
    //                         url:result.data.uploadFileInfoPO.name
    //                     })
    //                 })
    //         }
    //     });
    // }
}
const styles = StyleSheet.create({
    cameraBtn: {
        padding:5
    },
    count:{
        color:'#fff',
        fontSize:12
    },
    fullBtn:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    countBox:{
        position:'absolute',
        right:-5,
        top:-5,
        alignItems:'center',
        backgroundColor:'#34A853',
        width:16,
        height:16,
        borderRadius:8,
        justifyContent:'center'
    }
});

export default CameraButton;