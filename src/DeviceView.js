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
import { Badge, Toolbar, ActionButton, RippleFeedback, Drawer, Avatar, COLOR, ThemeProvider } from "react-native-material-ui";

import ChartView from "./ChartView";

import monitor_manager from "./rig/MonitorManager";
import HashrateUtils from "./rig/HashrateUtils";

export default class DeviceView extends React.Component {
  constructor(props) {
    super(props);

    this.monitor = props.monitor;
    this.mounted = false;
    this.listeners = [];

    this.state = {
      last: "waiting",
      data: undefined
    }

    this.onData =  (object) => {
      if(this.mounted) {
        const data = object.data;

        this.setState({
          last: object.last,
          data: object.data || this.state.data
        });
      }
    };
  }

  componentDidMount() {
    this.mounted = true;
    monitor_manager.on(this.monitor._id, this.onData);
  }

  componentWillUnmount() {
    this.mounted = false;
    monitor_manager.removeListener(this.monitor.name, this.onData);
  }

  getColorFromLast() {
    switch(this.state.last) {
      case "ok": return ok;
      case "error": return error;
      default: return waiting;
    }
  }

  getTextFromLast() {
    switch(this.state.last) {
      case "ok": return "ok";
      case "error": return "error";
      default: return "waiting";
    }
  }

  toggle() {
    this.setState({
      expand: this.state.expand ? false : true
    });
  }

  edit() {
    this.props.onEdit(this.monitor);
  }

  render() {
    if(!this.chartview) this.chartview = (<ChartView monitor={this.monitor}/>);
    var gpu_index = 0;
    const monitor = this.monitor;
    const { last, data } = this.state;

    return (
      <RippleFeedback key={monitor.name}  onPress={() => this.toggle()} onLongPress={() => this.edit()}>
        <Card containerStyle={styles.cardList}
          flexDirection="row">
            <View style={{flex: 1, width:"100%"}}>

            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Badge text=" " style={this.getColorFromLast()}>
                  <Text style={styles.rippledText}>{monitor.name}</Text>
                  </Badge>
                </View>
                {
                  data &&

                      <View style={{flex: 1, width:'100%',alignItems: 'stretch', flexDirection: 'column', justifyContent: 'space-between'}}>
                        <View style={chart.container} pointerEvents="none">
                        <View style={{flex: 1, position: "absolute", top: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
                          <Text style={styles.halfSizeText}>Hashrate : </Text>
                          <Text style={styles.halfSizeText}>{HashrateUtils.sanitizeHashrate(data.total.eth.hashrate)}</Text>
                        </View>
                        { this.chartview }
                        </View>
                        { this.state.expand &&
                          data.gpus.map(gpu =>
                            <View style={{flex: 1, flexDirection: 'column'}}>
                              <View style={styles.gpuStatus} flexDirection="row">
                                <Text style={styles.gpuStatus}>GPU{++gpu_index} : </Text>
                              </View>
                              <View style={styles.gpuStatusList} containerStyle={styles.cardBlue} flexDirection="row">
                                <Text style={styles.halfSizeText}>Hashrate : </Text>
                                <Text style={styles.halfSizeText}>{HashrateUtils.sanitizeHashrate(gpu.hashrate)}</Text>
                              </View>
                            </View>)
                        }
                      </View>
                }
            </View>
        </Card>
      </RippleFeedback>
    )
  }
}

const waiting = {
  container: {
    backgroundColor: "gray",
    marginLeft: -8,
    marginTop: -8
  }
}
const ok = {
  container: {
    backgroundColor: "green",
    marginLeft: -8,
    marginTop: -8
  }
}
const error = {
  container: {
    backgroundColor: "red",
    marginLeft: -8,
    marginTop: -8
  }
}
var chart = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpuStatus: {
    margin: 0,
    padding: 0,
    paddingTop: 4,
    paddingLeft: 4
  },
  gpuStatusList: {
    margin: 0,
    padding: 0,
    paddingLeft: 8,
  },
  padding: {
    paddingBottom: 20
  },
  cardList: {
    padding: 0,
  },
  cardBlue: {
    padding:0,
    backgroundColor: "blue"
  },
  rippledText: {
    margin: 8
  },
  halfSizeText: {
    margin: 8,
  },
});

DeviceView.propTypes = {
  monitor: PropTypes.shape({
    _id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    port: PropTypes.number.isRequired
  }).isRequired,
  database: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired
}
