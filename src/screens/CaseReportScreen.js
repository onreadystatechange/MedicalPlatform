/**
 * Created by yjy on 2017/12/13.
 */
/**
 * Created by yjy on 2017/12/13.
 */
/**
 * Created by yjy on 2017/12/12.
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
import { View,Text,TouchableOpacity,Image,ScrollView} from 'react-native';
import {connect} from "react-redux";
import {Images,Colors} from  '../themes';
import  {CommonTitle}from '../components'
const select = state => ({});
@connect(select)
export default class CaseReportScreen extends Component {

    componentDidMount(){

    }

    render() {
        // const item = this.props.navigation.state.params.item;
        const {navigation:{goBack,navigate}} = this.props;
        // const {pname,imageurl,id,sex} = item;
        return (
            <View style={{flex: 1,backgroundColor:Colors.transparent}}>
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
                    title= '病史列表'
                />
                <View style = {{height:px(30)}}/>
                <ScrollView>
                    <View style = {{backgroundColor:'#fff',paddingRight:px(30),paddingLeft:px(30)}}>
                        <View style = {{flexDirection:'row',height:px(120),alignItems:'center',justifyContent:'space-between'}}>
                            <View style={{flexDirection:'column'}}>
                                <View style={{flexDirection:'column',justifyContent:'center'}}>
                                    <Text style = {{color:'#333',fontSize:px(32)}}>
                                        病例1
                                    </Text>
                                    <View style = {{height:px(6)}}/>
                                    <Text style = {{color:'#999',fontSize:px(28)}}>
                                        2017/11/09
                                    </Text>
                                </View>
                            </View>
                            {false && <TouchableOpacity style = {{height:px(100),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                <Text style = {{color:Colors.navBarColor,fontSize:px(32)}}>
                                    申请查看
                                </Text>
                            </TouchableOpacity>}
                            { <TouchableOpacity style = {{height:px(100),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                <Text style = {{color:Colors.navBarColor,fontSize:px(32),opacity:0.5}}>
                                    等待同意
                                </Text>
                            </TouchableOpacity>}
                            {false &&<TouchableOpacity style = {{height:px(100),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                                <Text style = {{color:'#999',fontSize:px(32)}}>
                                    查看详情
                                </Text>
                            </TouchableOpacity>}
                        </View>
                        <View style = {{height:px(1),backgroundColor:'#eee'}}/>
                    </View>
                </ScrollView>


            </View>

        );
    }
}