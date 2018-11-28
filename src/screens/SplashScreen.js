/**
 * Created by yjy on 2017/12/6.
 */
/**
 * Created by yjy on 2017/12/6.
 */
import React from 'react';
import {StackNavigator,DrawerNavigator,NavigationActions} from 'react-navigation';
import {Easing,Animated,TouchableOpacity,View,Platform,Image,StyleSheet,ToastAndroid,Text}from 'react-native';
import {  getStore} from '../libs/Storage'

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    async componentWillMount(){
        let token = await getStore('AccessToken');
        console.log(token);
        let routeName= '';
        if(!!token){
            routeName = 'Home';
        }else{
            routeName = 'LoginScreen';
        }
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: routeName})
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }


    onRequestClose = ()=>{
       this.setState({
           visible:false
       })
    }

    render(){
        return (
          <View style={{flex:1}}>

          </View>
        )
    }
}
