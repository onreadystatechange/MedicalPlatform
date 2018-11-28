/**
 * Created by yjy on 2017/12/20.
 */
/**
 * Created by yjy on 2017/12/19.
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    WebView,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ToastAndroid,
    ActivityIndicator,
    TouchableWithoutFeedback
} from 'react-native';
import Web from 'react-native-webview2';
export default class MyWebView extends Component{
    constructor(props) {
        super(props);
        this.onLoad = this.onLoad.bind(this);
        this.onLoadStart = this.onLoadStart.bind(this);
        this.onLoadEnd = this.onLoadEnd.bind(this);
        this.onError = this.onError.bind(this);
        this.onContentSizeChange = this.onContentSizeChange.bind(this);
        this.renderError = this.renderError.bind(this);
        this.renderLoading = this.renderLoading.bind(this);
        this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
        this.reload = this.reload.bind(this);
        this.evalReturn = this.evalReturn.bind(this);
        this.state = {
            js: ''
        };
    }

    onLoad(e) {
        // console.log('onLoad');
        // console.log(e.nativeEvent);
    }

    onLoadStart(e) {
        // console.log('onLoadStart');
        // console.log(e.nativeEvent);
    }

    onLoadEnd(e) {
        // console.log('onLoadEnd');
        // console.log(e.nativeEvent);
    }

    onError(e) {
        // this.setState({
        //     errmsg: 'Loading error...'
        // });
    }

    onContentSizeChange(e) {
        // console.log('onContentSizeChange');
        // console.log(e.nativeEvent);
    }

    renderError(errorDomain, errorCode, errorDesc) {
        ToastAndroid.show("Loading Failed...", ToastAndroid.SHORT);
        return (
            <TouchableWithoutFeedback onPress={this.reload} style={{padding:9}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Text>网络不给力！点击重新加载...sorry, reload please...</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    evalReturn(r) {
        eval(r);
    }

    go() {
        this.web.go('https://github.com/open-source');
    }

    reload() {
        this.web.reload();
    }

    goForward() {
        this.web.goForward();
    }

    goBack() {
        this.web.goBack();
    }

    test() {
        this.web.evalJs(`var t = document.title; returnEval('this.setText("' + t + '")')`);
    }

    setText(t) {
        this.setState({txt: t});
    }

    onNavigationStateChange(navState) {
        // console.log('onNavigationStateChange');
        // console.log(navState);
    }

    renderLoading() {
        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: Dimensions.get('window').height, backgroundColor: 'white'}}>
                <ActivityIndicator size="small" color="gray" /><Text>加载中...Loading...</Text>
            </View>
        );
    }


    render() {
        const {uri} = this.props;
        return (
            <ScrollView
                style = {{flex:1,flexDirection:'column'}}
            >
                <Web
                    mixedContentMode = 'always'
                    ref={(c) => {this.web = c}}
                    evalReturn={this.evalReturn}
                    //  evalReturn={((r) => {eval(r)}).bind(this)}
                    source={{uri: uri}}
                    style={{width: Dimensions.get('window').width}}
                    startInLoadingState={true}
                    onLoad={this.onLoad}
                    onLoadStart={this.onLoadStart}
                    onLoadEnd={this.onLoadEnd}
                    renderError={this.renderError}
                    renderLoading={this.renderLoading}
                    onNavigationStateChange={this.onNavigationStateChange}
                    onContentSizeChange={this.onContentSizeChange}
                    injectedJavaScript={this.state.js}
                    scalesPageToFit = {true}
                />
            </ScrollView>
        );
    }
}
