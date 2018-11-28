import React, {Component} from 'react';
import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';

export default class LoadingView extends Component {

  render() {
    const {visible = true} = this.props;
    const loadingText = !this.props.loadingText ? "加载中..." : this.props.loadingText;
    return (
      <Modal
        transparent={true}
        onRequestClose = {this.props.onRequestClose}
        visible={this.props.visible}>
        <View style={styles.loading}>
          <ActivityIndicator size='large' color='#efefef'/>
          <View style = {{width:px(20)}}/>
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
      flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#efefef'
  }
});
