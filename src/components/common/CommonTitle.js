import React, {Component} from 'react'
import {Text, View, StyleSheet, TouchableHighlight, Alert, Image, Platform, StatusBar} from "react-native";
import {px} from "../../libs/CSS";
import Images from "../../themes/Images"
export default class CommonTitle extends Component {

    render() {
        const {
            title,
            leftView,
            rightView,
            showBar = true,
            barBackgroundColor = '#000'
        } = this.props;

        return (
            // 外层view
            <View>
                {showBar &&  <StatusBar backgroundColor = {barBackgroundColor}  barStyle={'light-content'}/>}
                <View style={styles.status}/>
                <View style={styles.content}>
                    <View style = {styles.leftView}>
                        {leftView}
                    </View>
                    <View style = {{flex:1,flexDirection:'row',justifyContent:'center'}}>
                        <TouchableHighlight  style={styles.titleTouch} underlayColor={'transparent'}>
                            <Text style={styles.titleText} numberOfLines={1}>
                                {title}
                            </Text>
                        </TouchableHighlight>
                    </View>

                    <View style = {styles.rightView}>
                        {rightView}
                    </View>

                </View>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    title: {
        backgroundColor: '#3399ff'
    },
    status: {
        height: 0
    },
    content: {
        height: px(96),
        backgroundColor: '#3399ff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleText: {
        color: 'white',
        fontSize: px(36),
        paddingLeft: 10,
        paddingRight: 10
    },
    leftView:{
        position:'absolute',
        left:px(32),
    },
    rightView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position:'absolute',
        right:px(32),
    },
    icon: {
        tintColor: 'white',
        width: px(28),
        height: px(48)
    },
});
