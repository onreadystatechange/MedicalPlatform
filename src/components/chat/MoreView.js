/**
 * Created by yjy on 2018/1/9.
 */
import React, {Component} from 'react';
import Global from '../../utils/Global';
import Utils from '../../utils/Utils';
import ImagePicker from 'react-native-image-crop-picker';
import ImagePickerManager from 'react-native-image-picker'
import {Dimensions, Image, PixelRatio, StyleSheet, Text, TouchableOpacity, View,Platform} from 'react-native';

const {width} = Dimensions.get('window');

const icons = [
    require('../../images/ic_more_gallery.png'),
    require('../../images/ic_more_movie.png'),
    require('../../images/ic_more_card.png')
];

const iconTexts = [
    "相册", "拍摄", "名片"
];
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
export default class MoreView extends Component {
    render() {
        let page = [];
        let row = [];
        for (let j = 0; j < 3; j++) {
            row.push(
                <Cell
                    key={ j}
                    icon={icons[j]}
                    text={iconTexts[ j]}
                    index={j}
                    sendImageMessage={this.props.sendImageMessage}
                    navigation = {this.props.navigation}
                    showCard = {this.props.showCard}
                    item = {this.props.item}
                />
            );
        }
        page.push(
            <View key={1} style={styles.rowContainer}>{row}</View>
        );
        return (
            <View style={styles.moreViewContainer}>
                {page}
            </View>
        );
    }
}

class Cell extends Component {
    state = {
        selectItems:null
    }
    render() {
        return (
            <TouchableOpacity style={styles.cellContainer} activeOpacity={0.6} onPress={() => this.handleClick()}>
                <View style={styles.cellContainer}>
                    <View style={styles.cellImgContainer}>
                        <Image style={styles.cellImage} source={this.props.icon}/>
                    </View>
                    <Text numberOfLines={1} style={styles.cellText}>{this.props.text}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    handleClick() {
        let index = this.props.index;
        switch (index) {
            case 0:
                this.chooseImage();
                break;
            case 1:
                this.launchCamera();
                break;
            case 2:
                this.sendCard();
                break;
            default:
        }
    }

    chooseImage() { // 从相册中选择图片发送
        ImagePickerManager.launchImageLibrary(options, (response)  => {
            // Same code as in above section!
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePickerManager Error: ', response.error);
            }
            else if (response.customButton) {
                // 这是当用户选择customButtons自定义的按钮时，才执行
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // You can display the image using either data:
                if (Platform.OS === 'android') {
                    let source = {uri: response.uri, isStatic: true};
                    this.props.sendImageMessage(response);
                } else {
                    let source = {
                        uri: response.uri.replace('file://', ''),
                        isStatic: true
                    };
                    this.props.sendImageMessage(response);
                }

            }
        });
    }

    launchCamera(){
        ImagePickerManager.launchCamera(options, (response)  => {
            // Same code as in above section!
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePickerManager Error: ', response.error);
            }
            else if (response.customButton) {
                // 这是当用户选择customButtons自定义的按钮时，才执行
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // You can display the image using either data:
                if (Platform.OS === 'android') {
                    let source = {uri: response.uri, isStatic: true};
                    this.props.sendImageMessage(response);
                } else {
                    let source = {
                        uri: response.uri.replace('file://', ''),
                        isStatic: true
                    };
                    this.props.sendImageMessage(response);
                }
            }
        });
    }

    onSelect = selectItems => {
        this.setState(selectItems);
        this.props.showCard(selectItems);
        console.log(selectItems);
    };

    sendCard(){
        console.log(this.props);
        const {navigation:{goBack,navigate},item} = this.props;
        navigate('ChooseSCPersonScreen',{ onSelect: this.onSelect,items:item});
    }

}

const styles = StyleSheet.create({
    moreViewContainer: {
        width: width,
        height: 160,
        flexDirection: 'column',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#F4F4F4'
    },
    rowContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        height: 80,
    },
    cellContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
    },
    cellImgContainer: {
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FBFBFB',
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#DFDFDF',
        borderRadius: 10,
    },
    cellImage: {
        width: 35,
        height: 35,
    },
    cellText: {
        fontSize: 12,
        width: 55,
        textAlign: 'center'
    }
});
