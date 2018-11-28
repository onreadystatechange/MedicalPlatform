import React ,{Component} from 'react';
import { View, TextInput, Image, KeyboardAvoidingView,StyleSheet } from 'react-native';

export default class InputBoard extends Component{

    render(){
        const {style} = this.props;
        return (
            <KeyboardAvoidingView
                behavior="padding"
                style={[styles.container,style]}
            >
                {this.props.children}
            </KeyboardAvoidingView>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    }
});