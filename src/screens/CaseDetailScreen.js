/**
 * Created by yjy on 2017/12/13.
 */
/**
 * Created by yjy on 2017/12/13.
 */

import React, { Component } from 'react';
import { View,Text,TouchableOpacity,Image,ScrollView} from 'react-native';
import {connect} from "react-redux";
import {Images,Colors} from  '../themes';
import  {CommonTitle,ImageView}from '../components'
import  {baseImgUrl} from '../configs/BaseConfig'

const select = state => ({});
const  Content = (props) =>
     <View style = {{flex:1,backgroundColor:'#fff'}}>
       <View style = {{height:px(80),flexDirection:'row',alignItems:'center',backgroundColor:'#eee',paddingLeft:px(30),paddingRight:px(30)}}>
            <Text style = {{fontSize:px(32),color:'#333'}}>
                {props.title}
            </Text>
       </View>

     <View style = {{minHeight:px(90),flexDirection:'row',paddingTop:px(10),paddingBottom:px(20),paddingLeft:px(30),paddingRight:px(30)}}>
        <Text style = {{fontSize:px(28),color:'#666',lineHeight:px(50)}}>
            {!!props.content?props.content:'无'}
        </Text>
     </View>
    </View>;
//家庭史
const  FamilyHistory = (props) =>
    <View style = {{flex:1,backgroundColor:'#fff'}}>
        <View style = {{height:px(80),flexDirection:'row',alignItems:'center',backgroundColor:'#eee',paddingLeft:px(30),paddingRight:px(30)}}>
            <Text style = {{fontSize:px(32),color:'#333'}}>
                {props.title}
            </Text>
        </View>

        <View style = {{minHeight:px(90),flexDirection:'row',paddingTop:px(10),paddingBottom:px(20),paddingLeft:px(30),paddingRight:px(30)}}>
            <Text style = {{fontSize:px(28),color:'#666',lineHeight:px(50)}}>
                {!!props.content?props.content:'无'}
            </Text>
        </View>
    </View>;
//体格检查
const HealthCheckup = (props) =><View style = {{flex:1,backgroundColor:'#fff'}}>
    <View style = {{height:px(80),flexDirection:'row',alignItems:'center',backgroundColor:'#eee',paddingLeft:px(30),paddingRight:px(30)}}>
        <Text style = {{fontSize:px(32),color:'#333'}}>
            {props.title}
        </Text>
    </View>
    <View style = {{backgroundColor:'#fff',paddingLeft:px(30),paddingRight:px(30)}}>
        <View style = {{minHeight:px(90),flexDirection:'row',justifyContent:'space-between',paddingTop:px(10),paddingBottom:px(20)}}>
            <Text style = {{fontSize:px(28),color:'#666',lineHeight:px(50)}}>
                体温
            </Text>
            <Text style = {{fontSize:px(28),color:'#666',lineHeight:px(50)}}>
                {!!props.temperature?props.temperature:'无'}
            </Text>
        </View>
        <View style = {{height:px(1),backgroundColor:'#eee'}}/>
    </View>
    <View style = {{backgroundColor:'#fff',paddingLeft:px(30),paddingRight:px(30)}}>
        <View style = {{minHeight:px(90),flexDirection:'row',justifyContent:'space-between',paddingTop:px(10),paddingBottom:px(20)}}>
            <Text style = {{fontSize:px(28),color:'#666',lineHeight:px(50)}}>
                脉搏
            </Text>
            <Text style = {{fontSize:px(28),color:'#666',lineHeight:px(50)}}>
                {!!props.pulse?props.pulse:'无'}
            </Text>
        </View>
        <View style = {{height:px(1),backgroundColor:'#eee'}}/>
    </View>
    <View style = {{backgroundColor:'#fff',paddingLeft:px(30),paddingRight:px(30)}}>
        <View style = {{minHeight:px(90),flexDirection:'row',justifyContent:'space-between',paddingTop:px(10),paddingBottom:px(20)}}>
            <Text style = {{fontSize:px(28),color:'#666',lineHeight:px(50)}}>
                呼吸
            </Text>
            <Text style = {{fontSize:px(28),color:'#666',lineHeight:px(50)}}>
                {!!props.breathing?props.breathing:'无'}
            </Text>
        </View>
        <View style = {{height:px(1),backgroundColor:'#eee'}}/>
    </View>
    <View style = {{backgroundColor:'#fff',paddingLeft:px(30),paddingRight:px(30)}}>
        <View style = {{minHeight:px(90),flexDirection:'row',justifyContent:'space-between',paddingTop:px(10),paddingBottom:px(20)}}>
            <Text style = {{fontSize:px(28),color:'#666',lineHeight:px(50)}}>
                血压
            </Text>
            <Text style = {{fontSize:px(28),color:'#666',lineHeight:px(50)}}>
                {!!props.pressure?props.pressure:'无'}
            </Text>
        </View>
        <View style = {{height:px(1),backgroundColor:'#eee'}}/>
    </View>

    {!!props.pressureimage && <View style = {{flexDirection:'row',justifyContent:'flex-start',
        paddingBottom:px(30),
        paddingLeft:px(30),
        flexWrap:'wrap'
    }}>
        {
            !!props.pressureimage && Array.isArray(props.pressureimage)&& props.pressureimage.map((item,index) =>
                <TouchableOpacity onPress = {()=>props.onPress()(index)}  key = {index}>
                    <Image

                        source = {{uri:baseImgUrl + item}}
                        style = {{width:px(200),height:px(200),marginBottom:px(24),marginTop:px(24),marginRight:px(30)}}/>
                </TouchableOpacity>
            )

        }
    </View>}

</View>;
//辅助检查
const AuxiliaryExamination = (props) =>
    <View style = {{flex:1,backgroundColor:'#fff'}}>
        <View style = {{height:px(80),flexDirection:'row',alignItems:'center',backgroundColor:'#eee',paddingLeft:px(30),paddingRight:px(30)}}>
            <Text style = {{fontSize:px(32),color:'#333'}}>
                {props.title}
            </Text>
        </View>

        <View style = {{minHeight:px(90),flexDirection:'row',paddingTop:px(10),paddingBottom:px(20),paddingLeft:px(30),paddingRight:px(30)}}>
            <Text style = {{fontSize:px(28),color:'#666',lineHeight:px(50)}}>
                {!!props.content?props.content:'无'}
            </Text>
        </View>
        {!!props.imageArr && <View style = {{flexDirection:'row',justifyContent:'flex-start',
            paddingBottom:px(30),
            paddingLeft:px(30),
            flexWrap:'wrap'
        }}>
            {
                !!props.imageArr && Array.isArray(props.imageArr)&& props.imageArr.map((item,index) =>
                    <TouchableOpacity onPress = {()=>props.onPress()(index)}  key = {index}>
                        <Image

                            source = {{uri:baseImgUrl + item}}
                            style = {{width:px(200),height:px(200),marginBottom:px(24),marginTop:px(24),marginRight:px(30)}}/>
                    </TouchableOpacity>
                )
            }
        </View>}
    </View>;

//诊断结果
const Diagnosis = (props) =>
    <View style = {{flex:1,backgroundColor:'#fff'}}>
        <View style = {{height:px(80),flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#eee',paddingLeft:px(30),paddingRight:px(30)}}>
            <Text style = {{fontSize:px(32),color:'#333'}}>
                {props.title}
            </Text>
            <Text style = {{fontSize:px(32),color:'#3399ff'}}>
                医师：{props.name}
            </Text>
        </View>

        <View style = {{minHeight:px(90),flexDirection:'row',paddingTop:px(10),paddingBottom:px(20),paddingLeft:px(30),paddingRight:px(30)}}>
            <Text style = {{fontSize:px(28),color:'#666',lineHeight:px(50)}}>
                {!!props.content?props.content:'无'}
            </Text>
        </View>
    </View>;



@connect(state =>({
    payload:state.user.doctor || {},
}),{

})
export default class CaseDetailScreen extends Component {
    state = {
        images:[],
        index:0
    }

    componentDidMount(){

    }

    _onPress = (images) =>(index) =>{
        const imagesArr = [];
        images.map((item) => imagesArr.push({
            url:baseImgUrl+item
        }));
        console.log(imagesArr);
        this.setState({
            images:imagesArr,
            index
        },()=>{
            this._ImageView.open()
        })
    }

    render() {
        const caseDetail = this.props.navigation.state.params.item;
        const {allow,medicalHistoryVO:{
            diagnoseState,item,modtime,tentativeDiagnosis,treatmentSuggestion,datas
        },attendingDoctor} = caseDetail;
        const data = JSON.parse(datas);
        const {chiefComplaint,hpi,pMedicalh,historyAllergy,hospital,badHabits,marital,marriage,mate,temperature,pulse,breathing,
            pressure,pressureimage,examination,examinationimage,doctorId,familyHistory,doctorName} = data;
        const {navigation:{goBack,navigate}} = this.props;
        const id = this.props.payload.id;
        const showName = id === attendingDoctor?'我':doctorName;
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
                    title= '病例详情'
                />
                <ScrollView style = {{flex:1}}>
                    <Content title = "主诉" content = {chiefComplaint}/>
                    <Content title = "现病史" content = {hpi}/>
                    <Content title = "既往史" content = {pMedicalh}/>
                    <Content title = "个人史" content = {hospital+';'+badHabits}/>
                    <Content title = "婚姻史" content = {marital+';'+marriage+';'+mate}/>
                    <FamilyHistory
                        title = "家族史"
                        familyHistory = {familyHistory}
                    />
                    <HealthCheckup
                        title = "体格检查"
                        temperature = {temperature}
                        pulse = {pulse}
                        breathing = {breathing}
                        pressure = {pressure}
                        pressureimage = {pressureimage}
                        onPress = {()=>this._onPress(pressureimage)}
                        />
                    <AuxiliaryExamination
                        title = "辅助检查"
                        imageArr = {examinationimage}
                        content = {examination}
                        onPress = {()=>this._onPress(examinationimage)}
                        />
                    {diagnoseState === 2 &&
                        <View>
                            <Diagnosis
                                title = "诊断结果"
                                content = {tentativeDiagnosis}
                                name = {showName}
                            />
                            <Diagnosis
                                title = "医生建议"
                                content = {treatmentSuggestion}
                                name = {showName}
                            />
                        </View>
                    }
                </ScrollView>
                <ImageView
                    images = {this.state.images}
                    ref = {(ref) => this._ImageView = ref}
                    index = {this.state.index}
                />
            </View>
        );
    }
}