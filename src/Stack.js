/**
 * Created by yjy on 2017/11/21.
 */
/**
 * Created by yjy on 2017/10/18.
 */
import React from 'react';
import {StackNavigator,TabNavigator,DrawerNavigator,NavigationActions} from 'react-navigation';
import {
    ChangePasswordScreen,
    LoginScreen,
    RegisterScreen,
    ForgetPasswordScreen,
    PhoneCheckScreen,
    AddressListScreen,
    CommunityScreen,
    MessageScreen,
    SickListScreen,
    AboutUsScreen,
    ChangePhoneNumberScreen,
    PersonalDataScreen,
    DndModeScreen,
    MyQrScreen,
    QrCodeScreen,
    HomeScreen,
    SplashScreen,
    SearchScreen,
    SearchResultPatient,
    NewFriendScreen,
    PatientFriendDetailScreen,
    CaseReportScreen,
    DiagnoseScreen,
    PublishResultScreen,
    AffirmDiscussResultScreen,
    GroupInfoScreen,
    FriendRequestScreen,
    PatientDetails,
    WebViewScreen,
    DoctorFriendDetailScreen,
    SearchResultDoctor,
    CaseDetailScreen,
    CaseEditScreen,
    ChatScreen,
    ChooseSCPersonScreen,
    GroupChatScreen,
    DiscussResultScreen,
    VersionUpdatingScreen
} from './screens';
import {Easing,Animated,TouchableOpacity,View,Platform,Image,StyleSheet}from 'react-native';
import {px} from "./libs/CSS"


/*
* 从上至下动画
* */
const forVerticalTop = (sceneProps)=>{
    const { layout, position, scene } = sceneProps;
    const index = scene.index;
    const height = layout.initHeight;
    const width = layout.initWidth;
    const opacity = position.interpolate({
        inputRange: [
            index - 1,
            index - 0.99,
            index,
            index + 0.99, index + 1],
        outputRange: [1, 1, 1, 0.85, 0]
});

    const translateX = 0;
    const translateY = position.interpolate({
        inputRange: [index, index+1, index + 1],
        outputRange: [0,height,height]
});

    return {
        opacity,
        transform: [{ translateX }, { translateY }],
    };

};

/*
 * 从左至右动画
 * */
const forHorizontalLeft = (sceneProps)=>{
    const { layout, position, scene } = sceneProps;

    const index = scene.index;
    const inputRange = [index - 1, index, index + 1];

    const width = layout.initWidth;
    const outputRange = [width, 0, -width * 0.3];

    const opacity = position.interpolate({
        inputRange: ([
            index - 1,
            index - 0.99,
            index,
            index + 0.99,
            index + 1,
        ]),
    outputRange: ([0, 1, 1, 0.85, 0]),
});

    const translateY = 0;
    const translateX = position.interpolate({
        inputRange,
        outputRange,
    });

    return {
        opacity,
        transform: [{ translateX }, { translateY }],
    };
};

//实现定义某个页面的动画效果
const TransitionConfiguration = () => {
    return {
        transitionSpec: {
            duration: 300,
            easing: Easing.linear(),
            timing: Animated.timing,
        },
        screenInterpolator: (sceneProps) => {
            const {scene } = sceneProps;
            const { route,index } = scene;
            const params = route.params || {};
            const transition = params.transition || 'forHorizontal';
            switch (transition){
                case 'forVerticalTop':
                    return forVerticalTop(sceneProps);
                case 'forHorizontalLeft':
                    return forHorizontalLeft(sceneProps);
                default:
                    return forHorizontalLeft(sceneProps);
            }
        },
    };
};

//
// //定义TabNavigator
// const MainScreenNavigator = TabNavigator({
//     MessageScreen: {
//         screen: MessageScreen,
//         navigationOptions: {
//             title:'消息',
//             tabBarLabel: '消息',
//             tabBarIcon:({focused,tintColor}) => (
//                 <TabBarItem
//                     tintColor={tintColor}
//                     style={[{tintColor: tintColor},styles.icon]}
//                     focused={focused}
//                     normalImage={Images.home_news}
//                     selectedImage={Images.message_focus}
//                 />
//             )
//         }
//     },
//     SickListScreen: {
//         screen: SickListScreen,
//         navigationOptions: {
//             title:'病人',
//             tabBarLabel: '病人',
//             tabBarIcon:({focused,tintColor}) => (
//                 <TabBarItem
//                     tintColor={tintColor}
//                     style={[{tintColor: tintColor},styles.icon]}
//                     focused={focused}
//                     normalImage={Images.home_patient}
//                     selectedImage={Images.patient_focus}
//                 />
//             )
//         }
//     },
//     CommunityScreen: {
//         screen: CommunityScreen,
//         navigationOptions: {
//             title:'社区',
//             tabBarLabel: '社区',
//             tabBarIcon:({focused,tintColor}) => (
//                 <TabBarItem
//                     tintColor={tintColor}
//                     style={[{tintColor: tintColor},styles.icon]}
//                     focused={focused}
//                     normalImage={Images.home_community}
//                     selectedImage={Images.community_focus}
//                 />
//             )
//         }
//     },
//     AddressListScreen: {
//         screen: AddressListScreen,
//         navigationOptions: {
//             tabBarLabel: '通讯录',
//             tabBarIcon:({focused,tintColor}) => (
//                 <TabBarItem
//                     tintColor={tintColor}
//                     style={[{tintColor: tintColor},styles.icon]}
//                     focused={focused}
//                     normalImage={Images.address_list_focus}
//                     selectedImage={Images.address_list_focus}
//                 />
//             )
//         }
//     }
// }, {
//     animationEnabled: true, // 切换页面时不显示动画
//     tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
//     swipeEnabled: true, // 禁止左右滑动
//     backBehavior: 'none', // 按 back 键是否跳转到第一个 Tab， none 为不跳转
//     tabBarOptions: {
//         lazy:true,
//         showLabel:true,//是否显示 标签页
//         upperCaseLabel:false,//标签（英文）文字是否大写
//         pressColor: '#ccc',
//         activeTintColor: '#3399ff', // 文字和图片选中颜色
//         inactiveTintColor: '#999', // 文字和图片默认颜色
//         showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
//         indicatorStyle: {height: px(1),backgroundColor:'#d2d2d2'}, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了
//         style: {
//             backgroundColor: '#fff', // TabBar 背景色
//             height:px(96)
//         },
//         labelStyle: {
//             fontSize: px(24), // 文字大小
//             marginTop:-px(2)
//         },
//     }
// });



const NavApp =  StackNavigator({
    LoginScreen:{
        screen:LoginScreen
    },
    ChangePasswordScreen:{
        screen:ChangePasswordScreen
    },
    RegisterScreen:{
        screen:RegisterScreen
    },
    ForgetPasswordScreen:{
        screen:ForgetPasswordScreen
    },
    PhoneCheckScreen:{
        screen:PhoneCheckScreen
    },
    PersonalDataScreen:{
        screen:PersonalDataScreen
    },
    ChangePhoneNumberScreen:{
        screen:ChangePhoneNumberScreen
    },
    DndModeScreen:{
        screen:DndModeScreen
    },
    MyQrScreen:{
        screen:MyQrScreen
    },
    QrCodeScreen:{
        screen:QrCodeScreen
    },
    Home:{
        screen:HomeScreen
    },
    SplashScreen:{
        screen:SplashScreen
    },
    SearchScreen:{
        screen:SearchScreen
    },
    SearchResultPatient:{
        screen:SearchResultPatient
    },
    NewFriendScreen:{
        screen:NewFriendScreen
    },
    PatientFriendDetailScreen:{
        screen:PatientFriendDetailScreen
    },
    CaseReportScreen:{
        screen:CaseReportScreen
    },
    DiagnoseScreen:{
        screen:DiagnoseScreen
    },
    PublishResultScreen:{
        screen:PublishResultScreen
    },
    AffirmDiscussResultScreen:{
        screen:AffirmDiscussResultScreen
    },
    GroupInfoScreen:{
        screen:GroupInfoScreen
    },
    FriendRequestScreen:{
        screen:FriendRequestScreen
    },
    PatientDetails:{
        screen:PatientDetails
    },
    WebViewScreen:{
        screen:WebViewScreen
    },
    DoctorFriendDetailScreen:{
        screen:DoctorFriendDetailScreen
    },
    SearchResultDoctor:{
        screen:SearchResultDoctor
    },
    CaseDetailScreen:{
        screen:CaseDetailScreen
    },
    CaseEditScreen:{
        screen:CaseEditScreen
    },
    ChatScreen:{
        screen:ChatScreen
    },
    ChooseSCPersonScreen:{
        screen:ChooseSCPersonScreen
    },
    GroupChatScreen:{
        screen:GroupChatScreen
    },
    DiscussResultScreen:{
        screen:DiscussResultScreen
    },
    AboutUsScreen:{
        screen:AboutUsScreen
    },
    VersionUpdatingScreen:{
        screen:VersionUpdatingScreen
    }
},{
    headerMode: 'none',
    // navigationOptions: {
    //     gesturesEnabled: false,
    // },
    // navigationOptions: ({navigation}) => StackOptions({navigation}),
    initialRouteName:'SplashScreen',
    // return {screenInterpolator: Transitioner}   //navigator水平切换

    transitionConfig:TransitionConfiguration
    ,
});



const styles = StyleSheet.create({
    icon: {
        height: px(44),
        width: px(44),
        resizeMode: 'contain',
        marginTop:-px(10)
    }
});

// const Routers = DrawerNavigator({
//     Home: {
//         screen:  StackNavigator({
//             Home:{
//                 screen:NavApp
//             }
//         },{
//             headerMode: 'none',
//         }),
//     }
// },{
//     contentComponent: props => (<UserDrawer items={props} />),
//     drawerWidth:px(560),
//     drawerPosition:'left',
//     activeTintColor:'#c6c6c6',
//     activeBackgroundColor:'#efefef',
//     drawerLockMode:"locked-closed"
// });

export default NavApp;


// drawerWidth - 抽屉的宽度
// drawerPosition - 选项是左或右。 默认为左侧位置
// contentComponent - 用于呈现抽屉内容的组件，例如导航项。 接收抽屉的导航。 默认为DrawerItems
// contentOptions - 配置抽屉内容
//
// initialRouteName - 初始路由的routeName
// order - 定义抽屉项目顺序的routeNames数组。
//     路径 - 提供routeName到路径配置的映射，它覆盖routeConfigs中设置的路径。
//     backBehavior - 后退按钮是否会切换到初始路由？ 如果是，设置为initialRoute，否则为none。 默认为initialRoute行为
//
// DrawerItems的contentOptions属性
//
// activeTintColor - 活动标签的标签和图标颜色
// activeBackgroundColor - 活动标签的背景颜色
// inactiveTintColor - 非活动标签的标签和图标颜色
// inactiveBackgroundColor - 非活动标签的背景颜色
// 内容部分的样式样式对象
// labelStyle - 当您的标签是字符串时，要覆盖内容部分中的文本样式的样式对象