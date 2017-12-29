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

import DataRetriever from "./DataRetriever";

export default class DeviceView extends React.Component {
  constructor(props) {
    super(props);

    this.monitor = props.monitor;

    this.data_retriever = new DataRetriever(this.monitor);

    this.state = {
      last: "waiting",
      data: undefined
    }
  }

  componentDidMount() {
    console.warn("mounted " + this.monitor.name);
    const code = Math.random();
    this.code = code;

    setTimeout(() => {
      this.callHost();
    }, 100);
  }

  componentWillUnmount() {
    console.warn("unmounted " + this.monitor.name);
    this.code = Math.random();
  }

  callHost() {
    const code = this.code;
    this.setState({
      last: "waiting"
    });

    this.data_retriever.call()
    .then(data => {
      if(!data) throw "error";
      this.setState({
        last: "ok",
        data: data
      });
      this.recall(code);
    })
    .catch(err => {
      this.setState({
        last: "error",
        data : undefined
      });

      this.recall(code);
    })
  }

  recall(code) {
    setTimeout(() => {
      if(this.code == code) {
        this.callHost();
      }
    }, 5000);
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

  render() {
    const monitor = this.monitor;
    const { last, data } = this.state;
    return (
      <RippleFeedback key={monitor.name}  onPress={() => {}}>
        <Card containerStyle={styles.cardList}
          flexDirection="row">
          <Badge text=" " style={this.getColorFromLast()}>
            <View style={{flex: 1}}>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.rippledText}>{monitor.name}</Text>
                </View>
                {
                  data &&
                  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.halfSizeText}>Hashrate : </Text>
                    <Text style={styles.halfSizeText}>{data.total.eth.hashrate}</Text>
                  </View>
                }
            </View>
          </Badge>
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
  halfSizeText: {
    margin: 8,
  },
  textMenu: {
    flex:1,
    paddingLeft: 10,
    paddingRight: 10
  },
  iconMenu: {
  }
});

DeviceView.propTypes = {
  monitor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    port: PropTypes.number.isRequired
  }).isRequired
}
