import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Menu,
  ScrollView,
  TextInput,
  BackHandler,
  StatusBar
} from 'react-native';
import { Card, ListItem, Icon, Button } from 'react-native-elements'
import { Toolbar, ActionButton, RippleFeedback, Drawer, Avatar, COLOR, ThemeProvider } from "react-native-material-ui";

import NewMonitor from "./NewMonitor"
import DeviceView from "./DeviceView";

const width = "100%";

const ColorPrimary = "#2196F3";

const uiTheme = {
  palette: {
    primaryColor: ColorPrimary,
    accentColor: ColorPrimary
  },
    toolbar: {
        container: {
            height: 56
        }
    }
}

export default class Monitors extends React.Component {

  constructor(props) {
    super(props)

    this.database = this.props.database;

    this.empty = <View />;
    this.state = {
      monitors: []
    }

    this.reloadDevices();

    BackHandler.addEventListener('hardwareBackPress', () => {
      return false;
    });
  }

  sort(monitors) {
    return monitors.sort((left, right) => {
      if (left.name < right.name) return -1;
      else if (left.name > right.name) return 1;
      return 0;
    });
  }

  reloadDevices() {
    this.database.getMonitors()
    .then(monitors => {
      console.warn(monitors);
      monitors = this.sort(monitors);
      this.setState({
        monitors: monitors
      });
    })
    .catch(err => {
      this.setState({
        monitors: []
      });
    });
  }

  onShowForm() {
    this.setState({
      form: true
    })
  }

  onBackCalled() {
    this.setState({
      form: false
    })
  }

  onCreatePress(name, host, port) {
    port = parseInt(port);
    this.database.addMonitor({
      name: name,
      host: host,
      port: port
    })
    .then(monitors => {
      this.onBackCalled();
      this.reloadDevices();
    })
  }

  render() {
    StatusBar.setBarStyle('light-content', true);

    const { loadingDevice } = this.state;
    var is_form = this.state.form;
    if(undefined == is_form) is_form = false;
    console.warn(is_form);

    return (
      <ThemeProvider key="one" uiTheme={uiTheme} children={this.empty}>
        <StatusBar backgroundColor="rgba(0, 0, 0, 0.2)" translucent />
        <View style={{ backgroundColor: ColorPrimary, height: 24 }} />
        <Toolbar
          leftElement={is_form ? "arrow-back" : ""}
          onLeftElementPress={() => this.onBackCalled()}
          centerElement="BB Monitor"/>
        {!is_form &&
          <ScrollView scrollsToTop={false} style={styles.list}>
            { this.state.monitors.map(monitor =>
              <DeviceView key={monitor.name} monitor={monitor}/>
            )}
            <View style={styles.padding}/>
          </ScrollView>
          }
        {!is_form &&
          <ActionButton onPress={() => this.onShowForm()} style={styles.action} icon="add" rippleColor="#ffffff"/>
        }

        {is_form &&
          <View style={{padding:16, width:"100%", height:"100%", backgroundColor: ColorPrimary}} >
            <NewMonitor onCreatePress={(n, h, p) => this.onCreatePress(n,h,p)}/>
          </View>
        }

        {is_form &&
          <View />
        }
      </ThemeProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  list: {
    flex: 1,
    height: "100%"
  },
  viewWithSearch: {
    backgroundColor: "#000000aa",
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingTop: 50,
    height: "100%",
    alignItems: 'center',
  },
  viewWithSearchEmpty: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 50,
    alignItems: 'center',
  },
  searchView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  padding: {
    paddingBottom: 20
  },
  cardList: {
    padding: 0
  },
  rippledText: {
    margin: 8
  },
  textMenu: {
    flex:1,
    paddingLeft: 10,
    paddingRight: 10
  },
  iconMenu: {
  }
});

Monitors.propTypes = {
  database: PropTypes.object.isRequired
}
