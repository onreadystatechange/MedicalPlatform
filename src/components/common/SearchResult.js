/**
 * Created by yjy on 2017/12/12.
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView
} from 'react-native';
import ListItem from './ListItem'
import CountEmitter from './../../libs/CountEmitter';
class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {entries:[]};
    }

    renderRow (item,index) {
        const {pname,imageurl,id,dname} = item;
        const type  = !!pname?'patient':'doctor';
        console.log(item);
        const {navigate} = this.props;
        return (
            <ListItem
                onPress = {()=>CountEmitter.emit('gopage',id,type)}
                imageurl = {imageurl}
                name = {pname || dname}
                key = {index}
            />
        )
    }

    render() {
        return (
            <ScrollView>
                {
                    this.props.dataSource.length>0? this.props.dataSource.map((item,index) => (
                        this.renderRow(item,index)
                    )):<View style = {{flexDirection:'row',justifyContent:'center'}}>
                        <Text style = {{fontSize:px(30)}}>
                            无搜索结果
                        </Text>
                    </View>
                }
            </ScrollView>
        )
    }
}
export default SearchResult;