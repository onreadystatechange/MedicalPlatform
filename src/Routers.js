import React from 'react';
import {StackNavigator,NavigationActions,addNavigationHelpers} from 'react-navigation';
import Storage from 'react-native-storage';
import { AsyncStorage ,BackAndroid,ToastAndroid,View,Platform,StatusBar,InteractionManager,NetInfo,Alert} from 'react-native';
import { px, width, height } from './libs/CSS';
import Stack from './Stack';
import {connect} from 'react-redux';
import CountEmitter from './libs/CountEmitter';
import SplashScreen from 'react-native-splash-screen'
import WebIM from './libs/WebIM'
import  {clearStore} from './libs/Storage'
@connect(
    state => ({
        nav:state.nav,
        fetching:state.ui.common.fetching
    })
)
export default class Routers extends React.Component {
    constructor(props) {
        super(props);
        this.init();
        this.lastBackPressed = 0;
        this.state = {
            first:true,
            isConnected: null,
            connectionInfo: null
        }
        this.timer = null;
    }

   componentDidMount() {
       console.disableYellowBox = true;
       SplashScreen.hide();
        this.timer = setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                SplashScreen.hide();
            });
        }, 1000);
        BackAndroid.addEventListener('hardwareBackPress', this.onBackPress);
        CountEmitter.addListener('loginout', this.listenLoginOut);
       NetInfo.isConnected.fetch().done((isConnected) => {
           this.setState({isConnected});
       });

       //检测网络连接信息
       NetInfo.fetch().done((connectionInfo) => {
           this.setState({connectionInfo});
       });

       //监听网络变化事件
       NetInfo.addEventListener('change', (networkType) => {
           this.setState({isConnected: networkType})
       })
    }

    componentWillUnmount(){
        clearTimeout(this.timer);
        CountEmitter.removeListener('loginout', this.listenLoginOut);
        BackAndroid.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    listenLoginOut = (fn) =>{
        const resetActions = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'LoginScreen'})]
        });
        clearStore('AccessToken');
        if (WebIM.conn.isOpened()) {
            WebIM.conn.close('logout');
        }
        fn&&fn(resetActions);
    }

    onBackPress = () => {
        const { dispatch, nav } = this.props;
        if (nav.index === 0) {
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                //最近2秒内按过back键，可以退出应用。
               return false;
            }
            this.lastBackPressed = Date.now();
            ToastAndroid.show('再按一次退出应用',ToastAndroid.SHORT);
            return true;
        }else{
            dispatch(NavigationActions.back());
            return true;
        }
    };


    init() {
        global.storage = new Storage({
            size: 100000,
            storageBackend: AsyncStorage,
            defaultExpires: null,
            enableCache: true,
            sync: null, //require('你可以另外写一个文件专门处理sync')
        });
        global.px = px;
        global.width = width;
        global.height = height;
    }

    render(){
        const { dispatch, nav } = this.props;
        return(
            <View style={{ flex: 1 }}>
                <Stack
                    navigation={addNavigationHelpers({ dispatch, state: nav })}
                />
            </View>
        )
    }

}