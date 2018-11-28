/**
 * Created by yjy on 2017/12/2.
 */
import {Modal,View} from 'react-native'
import React,{ Component } from 'react';
export default class MyModal extends Component {
    render() {
        const {onRequestClose,modalVisible} = this.props;
        return (
            <Modal
                visible={modalVisible}
                animationType={'slide'}
                transparent={true}
                onRequestClose={() => onRequestClose()}
            >
                <View style={
                    {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        flex: 1,
                        justifyContent: 'center'
                    }
                }>
                    {this.props.children}
                </View>
            </Modal>
        )
    }
}
