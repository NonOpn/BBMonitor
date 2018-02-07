/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Monitors from "./src/Monitors";
import Database from "./src/Database";

export default class App extends Component<{}> {

  constructor(props) {
    super(props);

    this.database = new Database();
  }

  render() {
    return ( <Monitors style={{}} database={this.database}/> );
  }
}
