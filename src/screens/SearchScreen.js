/**
 * Created by yjy on 2017/12/2.
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
import { View,Text,TouchableOpacity,Image,StyleSheet,TextInput} from 'react-native';
import {connect} from "react-redux";
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import  {px} from '../libs/CSS'
import {SearchResult} from '../components'
import http from '../libs/fetch'

@connect(state =>({
    payload:state.user.doctor || {}
}),{

})
export default class SearchScreen extends Component {
    type = ''
    state = {
        search:'',
        focused:false,
        data:[]
    }
    componentDidMount(){
        this.type = this.props.navigation.state.params.search;
    }

    handleSelectSearch() {
        this.refs.search && this.refs.search.focus()
        this.setState({focused: true})
    }

    handleChangeSearch(text) {
        this.setState({
            search:text
        },()=>{
            if(!!text && text.length >0 && text.replace(/(^\s*)|(\s*$)/g, "").length !== 0){
                this.updateList(this.state.search)
            }else{
                this.setState({
                    data:[]
                })
        }})
    }




    async updateList(text){
        const {payload:{id}} = this.props
        let data = await http(`friend/search/${this.type}`,{
            method:'get',
            body:{
                keyword:text
            }
        },true);
        data = data&&data.patient || data && data.doctor;
        const dataList = data.length >0 && data.filter((item,index) => {
            return item.id !== id;
        })
        this.setState({
            data:dataList
        })
    }

    handleFocusSearch() {
        this.setState({focused: true})
    }

    handleBlurSearch() {
        this.refs.search.blur()
        this.setState({focused: false})
    }

    handleCancelSearch() {
        this.refs.search.blur()
        this.setState({
            focused: false,
            search: null,
        })
    }

    render() {
        const {navigation:{navigate,goBack}} = this.props;
        return (
            <View style={{flex: 1}}>
                <View style = {{height:px(100),flexDirection:'row',
                    backgroundColor:'#fff',paddingLeft:px(30),justifyContent:'flex-start',
                    alignItems:'center',paddingRight:px(30),paddingTop:px(15),paddingBottom:px(15)}}>
                    <TouchableOpacity style = {{flexDirection:'row',alignItems:'center'}} onPress = {()=>goBack(null)}>
                        <Ionicons name="ios-arrow-back" size={30} color='#b8b8b8'/>
                    </TouchableOpacity>
                    <View style  ={{width:px(30)}}/>
                    <View style = {{flex:1,height:px(70),flexDirection:'row',alignItems:'center',borderRadius:px(6),backgroundColor:'#eee'}}>
                        <View style = {{width:px(20)}}/>
                        {!this.state.search && <Ionicons name="ios-search-outline" size={20} color='#bbb'/>}
                        <TextInput
                            ref='search'
                            style={Styles.searchInput}
                            value={this.state.search}
                            editable={true}
                            keyboardType='default'
                            returnKeyType='go'
                            autoCapitalize='none'
                            autoCorrect={false}
                            onFocus={this.handleFocusSearch.bind(this)}
                            onBlur={this.handleBlurSearch.bind(this)}
                            onChangeText={this.handleChangeSearch.bind(this)}
                            underlineColorAndroid='transparent'
                            onSubmitEditing={() => this.refs.search.focus()}
                            placeholder={this.props.navigation.state.params.search === 'patient'?'添加病人好友':'添加医生好友'}
                            placeholderTextColor='#aaa'
                            selectionColor={Styles.selectionColor}
                        />
                    </View>
                    <View style = {{width:px(30)}}/>
                </View>
                <View style = {{height:px(30)}}/>
                <SearchResult navigate = {navigate} dataSource={this.state.data}/>
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    searchInput: {
        flex: 1,
        height: 30,
        fontSize: px(28),
        paddingVertical: 5,
        color:'#bbb'
    },
});
