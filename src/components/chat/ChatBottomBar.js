/**
 * Created by yjy on 2018/1/5.
 */
import React, {Component} from 'react';
import Utils from '../../utils/Utils';

import {
    Button,
    Image,
    PixelRatio,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Keyboard
} from 'react-native';
import {width,px} from '../../libs/CSS'
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
const BAR_STATE_SHOW_KEYBOARD = 1;
const BAR_STATE_SHOW_RECORDER = 2;

export default class ChatBottomBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barState: BAR_STATE_SHOW_KEYBOARD,
            showEmojiView: false,
            showMoreView: false,
            inputMsg: '',
            text:'',
            height:0
        };
    }

    render() {
        var barState = this.state.barState;
        switch (barState) {
            case BAR_STATE_SHOW_KEYBOARD:
                return this.renderKeyBoardView();
                break;
            case BAR_STATE_SHOW_RECORDER:
                return this.renderRecorderView();
                break;
        }
    }


    onChange = (event)=> {
        console.log(event.nativeEvent);
        this.setState({
            text: event.nativeEvent.text,
            height:event.nativeEvent.contentSize.height
        });
    }

    onChangeText = (text)=>{
        this.props.inputChange(text);
    }
    renderKeyBoardView() {
        return (
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={0.5} onPress={this.handlePress.bind(this, "soundBtn")}>
                    <Image style={[styles.icon,{marginRight:px(10)}]} source={require('../../images/ic_chat_sound.png')}/>
                </TouchableOpacity>

                <AutoGrowingTextInput
                    value={this.props.value}
                    onChange={(event) => this.onChange(event)}
                    onChangeText={this.onChangeText}
                    underlineColorAndroid='transparent'
                    style={styles.input}
                    enableScrollToCaret
                    ref={(r) => { this._textInput = r }}
                    onFocus = {()=>this.onFocus()}
                />

                <TouchableOpacity activeOpacity={0.5} onPress={this.handlePress.bind(this, "emojiBtn")}>
                    <Image style={[styles.icon,{marginLeft:px(10)}]} source={require('../../images/ic_chat_emoji.png')}/>
                </TouchableOpacity>
                {
                    Utils.isEmpty(this.props.value) ? (
                        <TouchableOpacity activeOpacity={0.5} onPress={this.handlePress.bind(this, "moreBtn")}>
                            <Image style={[styles.icon, {marginLeft: px(20)}]} source={require('../../images/ic_chat_add.png')}/>
                        </TouchableOpacity>
                    ) : (
                        <View style={{marginLeft: 10}}>
                            <Button color={'#3399ff'} title={"发送"} onPress={() => this.sendMsg()}/>
                        </View>
                    )
                }
            </View>
        );
    }
    onFocus(){
        this.props.updateView(false, false);
    }

    onChange(event) {
        this.setState({ inputMsg: event.nativeEvent.text || '' });
    }

    sendMsg() {
        let onSendBtnClickListener = this.props.handleSendBtnClick;
        if (!Utils.isEmpty(onSendBtnClickListener)) {
            onSendBtnClickListener(this.props.value);
        }
        this._textInput.resetHeightToMin();
    }

    renderRecorderView() {
        return (
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={0.5} onPress={this.handlePress.bind(this, "soundBtn")}>
                    <Image style={styles.icon} source={require('../../images/ic_chat_keyboard.png')}/>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} style={{flex: 1}}>
                    <View style={styles.recorder}><Text>按住 说话</Text></View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={this.handlePress.bind(this, "emojiBtn")}>
                    <Image style={styles.icon} source={require('../../images/ic_chat_emoji.png')}/>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={this.handlePress.bind(this, "moreBtn")}>
                    <Image style={[styles.icon, {marginLeft: px(20)}]} source={require('../../images/ic_chat_add.png')}/>
                </TouchableOpacity>
            </View>
        );
    }

    hideBar(){
        this.setState({
            showEmojiView: false,
            showMoreView: false,
            barState:BAR_STATE_SHOW_KEYBOARD
        });
    }

    handlePress = (tag) => {
        if ("soundBtn" == tag) {
            if (this.state.barState === BAR_STATE_SHOW_KEYBOARD) {
                this.setState({
                    barState: BAR_STATE_SHOW_RECORDER,
                    showEmojiView: false,
                    showMoreView: false,
                });
            } else if (this.state.barState === BAR_STATE_SHOW_RECORDER) {
                this.setState({
                    barState: BAR_STATE_SHOW_KEYBOARD,
                    showEmojiView: false,
                    showMoreView: false,
                });
            }
            this.props.updateView(false, false);
        } else if ("emojiBtn" == tag) {
            let showEmojiView = this.state.showEmojiView;
            console.log(showEmojiView);
            this.props.updateView(!showEmojiView, false);
            this.setState({
                showEmojiView: !showEmojiView,
                showMoreView: false,
                barState:BAR_STATE_SHOW_KEYBOARD
            })
        }else if ("moreBtn" == tag) {
            let showMoreView = this.state.showMoreView;
            let showEmojiView = this.state.showEmojiView;
            this.props.updateView(false, !showMoreView);
            this.setState({
                showEmojiView: false,
                showMoreView: !showMoreView,
                barState:BAR_STATE_SHOW_KEYBOARD
            });
        }
        Keyboard.dismiss();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:width,
        flexDirection: 'row',
        paddingTop:px(20),
        paddingBottom:px(20),
        alignItems:'center',
        backgroundColor: '#f7f7f7',
        paddingLeft: px(30),
        paddingRight: px(30),
    },
    input: {
        flex: 1,
        height:px(80),
        backgroundColor:'#fff',
        borderWidth:px(1),
        borderColor:'#eee',
        borderRadius:px(6),
        paddingTop: 0,
        paddingBottom: 0,
        lineHeight:px(36),
        fontSize:px(28)
    },
    icon: {
        width: px(50),
        height:  px(50)
    },
    recorder: {
        height:px(60),
        marginTop:px(10),
        marginBottom:px(10),
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#6E7377',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
