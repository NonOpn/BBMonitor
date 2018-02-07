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
import { Toolbar, ActionButton, ThemeProvider } from "react-native-material-ui";


import monitor_manager from "./rig/MonitorManager";
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

  componentDidMount() {
    monitor_manager.start();
  }

  componentWillUnmount() {
    monitor_manager.stop();
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
      monitors = this.sort(monitors);

      monitors.forEach(monitor => {
        monitor_manager.addNewWorker(""+monitor._id, monitor.host, monitor.port);
        //addWorker will start it if in started position
      });

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

  edit(monitor) {
    this.setState({
      form: true,
      editing_monitor: monitor
    })
  }

  onShowForm() {
    this.setState({
      form: true,
      editing_monitor: undefined
    })
  }

  onBackCalled() {
    this.setState({
      form: false
    })
  }

  onCreatePress(name, host, port, existing_monitor) {
    if(existing_monitor) {
      this.database.update(existing_monitor)
      .then(monitor => {
        this.onBackCalled();
        this.reloadDevices();
      })
      .catch(err => console.warn(err));
    } else {
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
  }

  render() {

    monitor_manager.start();
    StatusBar.setBarStyle('light-content', true);

    const { loadingDevice, editing_monitor } = this.state;
    var is_form = this.state.form;
    if(undefined == is_form) is_form = false;

    return (
      <ThemeProvider key="one" uiTheme={uiTheme} children={this.empty}>
        <StatusBar backgroundColor="rgba(0, 0, 0, 0.2)" translucent />
        <View style={{ backgroundColor: ColorPrimary, height: 24 }} />
        <Toolbar
          leftElement={is_form ? "arrow-back" : ""}
          onLeftElementPress={() => this.onBackCalled()}
          centerElement="BB Monitor"/>
           {
             this.state.monitors.length == 0 &&
             <View style={styles.empty_item}>
              <Text style={styles.empty_item_text}>Add a new monitor to start</Text>
             </View>
           }
        {!is_form &&
          <ScrollView scrollsToTop={false} style={styles.list}>
            { this.state.monitors.map(monitor =>
              <DeviceView database={this.database} key={""+monitor._id} monitor={monitor} onEdit={(monitor) => this.edit(monitor)}/>
            )}
            <View style={styles.padding}/>
          </ScrollView>
          }
        {!is_form &&
          <ActionButton key="add" onPress={() => this.onShowForm()} style={{position: 'absolute',right: 0,bottom: 0}} icon="add" rippleColor="#ffffff"/>
        }

        {is_form &&
          <View style={{padding:16, width:"100%", height:"100%", backgroundColor: ColorPrimary}} >
            <NewMonitor monitor={editing_monitor} onCreatePress={(n, h, p, e) => this.onCreatePress(n,h,p, e)}/>
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
  add: {
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  list: {
    flex: 1,
    height: "100%"
  },
  padding: {
    paddingBottom: 20
  },
  empty_item: {
    position: 'absolute',
    top: 0, left: 0,
    right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18
  },
  empty_item_text: {
    fontSize: 18
  }
});

Monitors.propTypes = {
  database: PropTypes.object.isRequired
}
