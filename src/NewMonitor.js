import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-animatable'

import CustomButton from './components/CustomButton'
import CustomTextInput from './components/CustomTextInput'

export default class NewMonitor extends Component {
  static propTypes = {
    onCreatePress: PropTypes.func.isRequired,
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

  render () {
    const { host, name, port } = this.state;
    const { onCreatePress } = this.props;
    const isValid = host !== '' && name !== '' && port !== '';

    return (
      <View style={styles.container}>
        <View style={styles.form} ref={(ref) => this.formRef = ref}>
          <CustomTextInput
            ref={(ref) => this.nameInputRef = ref}
            placeholder={'Name'}
            returnKeyType={'next'}
            blurOnSubmit={false}
            withRef={true}
            onSubmitEditing={() => this.hostInputRef.focus()}
            onChangeText={(value) => this.setState({ name: value })}
          />
          <CustomTextInput
            ref={(ref) => this.hostInputRef = ref}
            placeholder={'Host name/ip'}
            returnKeyType={'next'}
            blurOnSubmit={false}
            withRef={true}
            onSubmitEditing={() => this.portInputRef.focus()}
            onChangeText={(value) => this.setState({ host: value })}
          />
          <CustomTextInput
            ref={(ref) => this.portInputRef = ref}
            placeholder={'Port'}
            returnKeyType={'done'}
            keyboardType="numeric"
            withRef={true}
            onChangeText={(value) => this.setState({ port: value })}
          />
        </View>
        <View style={styles.footer}>
          <View ref={(ref) => this.buttonRef = ref} animation={'bounceIn'} duration={600} delay={400}>
            <CustomButton
              onPress={() => onCreatePress(name, host, port)}
              enabled={isValid}
              isEnabled={isValid}
              buttonStyle={styles.createMonitorButton}
              textStyle={styles.createMonitorButtonText}
              text={'Create new Monitor'}
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
