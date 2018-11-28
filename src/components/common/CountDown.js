/**
 * Created by yjy on 2017/11/27.
 */
import React, {
    Component
} from 'react';
import {
    TouchableOpacity,
    Text,
    AppState,
    StyleSheet
} from 'react-native';
import {px} from '../../libs/CSS'

function fomatFloat(src, pos) {
    return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}

class CountDown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            appState: AppState.currentState,
            countdown: -1,
            disabled: false
        };
        this.backgroundTime = 0;
        this.interval = null;
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.interval && clearInterval(this.interval);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState === 'active' && nextAppState.match(/inactive|background/)) {
            this.backgroundTime = new Date().getTime() / 1000;
        }
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.backgroundTime = fomatFloat(new Date().getTime() / 1000 - this.backgroundTime,0);
        }
        this.setState({appState: nextAppState});
    }

    setCountdown =(countdown)=> {
        this.setState({
            countdown: countdown
        });
    }

    getCountdown() {
        return this.state.countdown;
    }

    startCountDown =()=> {
        this.interval = setInterval(() => {
            if (this.backgroundTime < this.getCountdown()) {
                this.setState({
                    countdown: this.getCountdown() - this.backgroundTime - 1
                },()=>{
                    this.backgroundTime = 0;
                    if (this.getCountdown() < 0) {
                        this.interval && clearInterval(this.interval);
                    }
                    if (this.getCountdown() >= 0) {
                        this.setButtonClickDisable(true);
                    } else {
                        this.setButtonClickDisable(false);
                    }
                });
            } else {
                this.setCountdown(-1);
                this.setButtonClickDisable(false);
                this.interval && clearInterval(this.interval);
            }
        }, 1000);
        this.setButtonClickDisable(true);
    }

    setButtonClickDisable(enable) {
        this.setState({
            disabled: enable
        });
    }

    onPress = () => {
        this.props.ok && this.props.ok();
    }

    countDown = () =>{
        this.setCountdown(60);
        this.startCountDown();
    }

    render() {
        // console.log(this.state.countdown);
        return (
            <TouchableOpacity disabled={this.state.disabled} onPress={this.onPress} style={!this.props.vcode?styles.vcode:this.props.vcode}>
                {this.state.countdown >= 0 ?
                    <Text style={!this.props.vcodeText?styles.vcodeText:this.props.vcodeText}>
                        {`${this.state.countdown}`}秒
                    </Text> :
                    <Text style={!this.props.vcodeText?styles.vcodeText:this.props.vcodeText}>
                        {this.props.text?this.props.text:'获取验证码'}
                    </Text>
                }
            </TouchableOpacity>
        );

    }
}
const styles = StyleSheet.create({
    vcode: {
        borderRadius: px(5),
        height:px(48),
        justifyContent: 'center',
        backgroundColor:'#3399ff',
        alignItems: 'center',
        marginLeft: 5,
        width:px(144)
    },
    vcodeText: {
        color: '#fff',
        fontSize:px(24)
    }
});

export default CountDown;