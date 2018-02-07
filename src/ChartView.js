import React from 'react';
import PropTypes from 'prop-types';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    processColor
} from 'react-native';
import update from 'immutability-helper';

import _ from 'lodash';
import {
    VictoryAxis,
    VictoryChart,
    VictoryLine,
    VictoryTheme,
} from "victory-native";

import HashrateUtils from "./rig/HashrateUtils";
import monitor_manager from "./rig/MonitorManager";

export default class ChartView extends React.Component {

    constructor(props) {
      super(props);
      this.mounted = false;
      this.monitor = props.monitor;

      this.axis_style = {
        tickLabels: {
          fontSize: 5,
          padding: 5
        }
      };

      this.chart_style = {
        data: {
            stroke: "#c43a31"
        },
        parent: {
            border: "1px solid #ccc"
        },
        paddingTop: 100
      };

      this.state = {
        data: [],
        domain: [0, 10]
      }

      this.onData =  (object) => {
        if(this.mounted && object.points) {
          const { points } = object;

          if(points.length > 0) {
            var min = points[0].y;
            var max = points[0].y;

            points.forEach(point => {
              if(point.y < min) min = point.y;
              if(point.y > max) min = point.y;
            });

            min *= 0.95;
            max *= 1.05;

            this.setState({
              data: points,
              domain: [min, max]
            });
          }
        }
      };
    }

    componentDidMount() {
      this.mounted = true;
      monitor_manager.on(this.monitor._id, this.onData);
    }

    componentWillUnmount() {
      this.mounted = false;
      monitor_manager.removeListener(this.monitor._id, this.onData);
    }

    render() {
        return (
          <VictoryChart theme={VictoryTheme.material} domainPadding={0} height={200}>
            <VictoryAxis style={this.axis_style} tickFormat={(x) => HashrateUtils.sanitizeHashrate(x)} dependentAxis domain={this.state.domain}/>
            <VictoryLine style={{paddingTop: 0}} interpolation="natural" style={this.chart_style} data = {this.state.data} />
          </VictoryChart>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    chart: {
        flex: 1
    }
});


ChartView.propTypes = {
  monitor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
    port: PropTypes.number.isRequired
  }).isRequired
}
