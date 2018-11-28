/**
 * Created by yjy on 2018/1/9.
 */
/**
 * Created by yjy on 2017/12/9.
 */
import React, { Component } from 'react';
import { View,Text,TouchableOpacity,Image,TextInput,TouchableNativeFeedback,StyleSheet,ScrollView,ToastAndroid,Animated,Keyboard} from 'react-native';
import {connect} from "react-redux";
import Images from  '../themes/Images';
import Colors from '../themes/Colors';
import {StickySearchList,CommonTitle,Emptypage,HeadPortrait} from '../components';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import  {px,width} from "../libs/CSS"
import _ from 'lodash';
var Pinyinuntils = require('../utils/PinyinUntils');
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
const sortData = (arrData) =>{
    const arr = [];
    arrData && Array.isArray(arrData) && arrData.map((item,index)=> {
        arr.push( ToCapitalization(Pinyinuntils.getCamelChars( item.remark?item.remark:(item.pname||item.dname) )));
    });
    console.log(Array.from(new Set(arr)).sort());
    return  Array.from(new Set(arr)).sort();
};

const ToCapitalization = (str)=>{
    if(str.length>0){
        var first = str.substr(0,1).toUpperCase();
        return first;
    }
};

const dataDirect = (arr,arrData ) =>{
    arr = _.cloneDeep(arr);
    const arr1 = sortData(arr);
    const arr2 = [];
    for(let i = 0;i<arr1.length;i++) {
        arr2.push({});
    }
    for (let j = 0; j < arr.length; j++) {
        arr[j].checked = false;
    }

    arrData.map((item, index) => {
        for (let j = 0; j < arr.length; j++) {
            console.log(item,arr[j])
            if (item.patientid === arr[j]['id']){
                arr.remove(j);
            }
        }
    })

    for(let i = 0;i<arr1.length;i++) {
        for (let j = 0; j < arr.length; j++) {
            if (ToCapitalization(Pinyinuntils.getCamelChars(arr[j].remark ? arr[j].remark : (arr[j].pname ||arr[j].dname))) === arr1[i]) {
                if (!arr2[i][arr1[i]]) {
                    arr2[i][arr1[i]] = [];
                }
                arr2[i][arr1[i]].push(arr[j])
            }
        }
    }
    return arr2;
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



@connect(
    state =>({
        friendList:state.friendList
    }),
    {

    }
)
export default class ChooseSCPersonScreen extends Component {
    state = {
        visible:false,
        data:null,
        groupData:[],
        dataInfo:null,
        selectItems:null,
        focused:false,
        search:''
    }

    async componentDidMount(){
        const filter =  this.props.navigation.state.params.items;
        const dataInfo = this.props.friendList.patient.infos.concat(this.props.friendList.doctor.infos).filter((item)=> item.id !== filter.id);
        const arr = dataDirect(dataInfo,this.state.groupData);
        this.setState({
            dataInfo,
            data:arr
        });
    }


    _onPress = (item)=>{
      this.close(item);
    }

    _renderRow (data, sectionID, rowID, highlightRow) {
        const keys = _.keys(data)[0];
        return (
            <View
                style = {{width:width,backgroundColor:'#fff'}}
            >
                <View style = {{height:px(50), paddingRight:px(30),paddingLeft:px(30),flexDirection:'row',alignItems:'center',backgroundColor:Colors.transparent,justifyContent:'flex-start'}}>
                    <Text style={{ fontSize: px(30),color:'#333' }}>{keys}</Text>
                </View>
                {!!data[keys] && Array.isArray(data[keys]) && data[keys].map((item,index) =>
                    <TouchableOpacity key = {index}  onPress = {()=>this._onPress(item)}>
                        <View style = {{
                            flexDirection:'row',
                            alignItems:'center',
                            justifyContent:'flex-start',
                            height:px(130),
                            paddingRight:px(30),paddingLeft:px(30),
                        }} >
                            <HeadPortrait imageurl = {item.imageurl}/>
                            <View style = {{width:px(30)}}/>
                            <View style = {{flex:1,flexDirection:'row',alignItems:'center'}}>
                                <Text style = {{fontSize:px(32),color:'#333'}}>
                                    {item.remark?item.remark:(item.pname||item.dname)}
                                </Text>
                            </View>
                        </View>
                        <View style = {{height:px(1),backgroundColor:'#eee'}}/>
                    </TouchableOpacity>
                )}
            </View>
        )
    }

    close=(item)=>{
        const {navigation:{goBack,navigate}} = this.props;
        goBack(null);
        this.props.navigation.state.params.onSelect(item);
    }


    handleChangeSearch(text) {
        this.setState({
            search: text
        });
    }

    handleFocusSearch() {
        this.setState({focused: true})
    }

    handleBlurSearch() {
        this.refs.search.blur();
        this.setState({focused: false})
    }

    handleCancelSearch() {
        this.refs.search.blur();
        this.setState({
            focused: false,
            search: null,
        })
    }

    render() {
        const {selectItems,data} = this.state;
        const {navigation:{goBack,navigate}} = this.props;
        console.log(selectItems);
        const isEmpty = () => !!data && data.every((item) =>JSON.stringify(item) === "{}");
        const Empty = isEmpty();
        return (
            <View  style={{flex: 1,backgroundColor:Colors.transparent}}>
                <View>
                    <CommonTitle
                        title = "选择好友"
                        leftView = {
                            <TouchableOpacity activeOpacity={1} onPress = {()=> goBack(null)}>
                                <View >
                                    <Image source = {Images.back} style = {{width:px(28),height:px(48)}} />
                                </View>
                            </TouchableOpacity>

                        }
                    />
                </View>

                <View style = {{height:px(90),flexDirection:'row',alignItems:'center',borderRadius:px(6),backgroundColor:'#fff'}}>
                    <View style = {{width:px(40)}}/>
                    <Ionicons name="ios-search-outline" size={20} color='#bbb'/>
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
                        placeholder={'搜索'}
                        placeholderTextColor='#aaa'
                    />
                </View>

                {!Empty?<StickySearchList
                    setVerticalScrollBarEnabled = {false}
                    renderRow={this._renderRow}
                    _onPress = {this._onPress}
                    searchBarTextStyle = {{
                        color:'#333',
                        fontSize:px(28)
                    }}
                    data = {data}
                    searBarShow = {true}
                    handleClick = {(item,index) => this._handleClick(item,index)}
                />:<View style = {{justifyContent:'center',alignItems:'center',flex:1}}>
                    <Text style = {{fontSize:px(32),color:'#999'}}>
                        暂无好友
                    </Text>
                </View>}
            </View>
        );
    }
}


