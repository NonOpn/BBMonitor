import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-animatable'

import CustomButton from './components/CustomButton'
import CustomTextInput from './components/CustomTextInput'

export default class NewMonitor extends Component {
  static propTypes = {
    onCreatePress: PropTypes.func.isRequired,
    monitor: PropTypes.shape({
      _id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      host: PropTypes.string.isRequired,
      port: PropTypes.number.isRequired
    })
  }

  state = {
    host: '',
    port: '',
    name: ''
  }

  hideForm = async () => {
    if (this.buttonRef && this.formRef) {
      await Promise.all([
        this.buttonRef.zoomOut(200),
        this.formRef.fadeOut(300)
      ])
    }
  }

  constructor(props) {
    super(props);

    const { monitor } = this.props;
    this.exist_name = monitor ? ""+monitor.name : "";
    this.exist_host = monitor ? ""+monitor.host : "";
    this.exist_port = monitor ? ""+monitor.port : "";
    this.button = monitor ? "Edit" : "Create new Monitor";

    this.state = {
      name: this.exist_name,
      host: this.exist_host,
      port: this.exist_port
    };
  }

  onCreatePress(name, host, port) {
    const { monitor } = this.props;

    port = parseInt(port);
    if(monitor) {
      monitor.name = name;
      monitor.host = host;
      monitor.port = port;
    }

    this.props.onCreatePress(name, host, port, monitor);
  }

  render () {
    const { host, name, port } = this.state;
    const isValid = host !== '' && name !== '' && port !== '';

    return (
      <View style={styles.container}>
        <View style={styles.form} ref={(ref) => this.formRef = ref}>
          <CustomTextInput
            ref={(ref) => this.nameInputRef = ref}
            placeholder={'Name'}
            returnKeyType={'next'}
            blurOnSubmit={false}
            text={this.exist_name}
            withRef={true}
            onSubmitEditing={() => this.hostInputRef.focus()}
            onChangeText={(value) => this.setState({ name: value })}
          />
          <CustomTextInput
            ref={(ref) => this.hostInputRef = ref}
            placeholder={'Host name/ip'}
            returnKeyType={'next'}
            blurOnSubmit={false}
            text={this.exist_host}
            withRef={true}
            onSubmitEditing={() => this.portInputRef.focus()}
            onChangeText={(value) => this.setState({ host: value })}
          />
          <CustomTextInput
            ref={(ref) => this.portInputRef = ref}
            placeholder={'Port'}
            returnKeyType={'done'}
            keyboardType="numeric"
            text={this.exist_port}
            withRef={true}
            onChangeText={(value) => this.setState({ port: value })}
          />
        </View>
        <View style={styles.footer}>
          <View ref={(ref) => this.buttonRef = ref} animation={'bounceIn'} duration={600} delay={400}>
            <CustomButton
              onPress={() => this.onCreatePress(name, host, port)}
              enabled={isValid}
              isEnabled={isValid}
              buttonStyle={styles.createMonitorButton}
              textStyle={styles.createMonitorButtonText}
              text={this.button}
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  },
  form: {
    marginTop: 20
  },
  footer: {
    height: 100,
    justifyContent: 'center'
  },
  createMonitorButton: {
    backgroundColor: 'white'
  },
  createMonitorButtonText: {
    color: '#3E464D',
    fontWeight: 'bold'
  }
})
