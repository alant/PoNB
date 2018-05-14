import React, { Component } from 'react';
import NebPay from 'nebpay/nebpay.js';

class MyTeam extends Component {
  constructor() {
    super();
    this.state = {
      nebPay: null
    }
  }
  componentWillMount() {
    this.setState({nebPay: new NebPay()});
  }
  componentDidMount() {
    console.log("myTeam using contract addr: " + this.props.contractAddr);
    var to = this.props.contractAddr;
    var value = "0";
    var callFunction = "getTeamNames";
    var callArgs = "[]";
    this.state.nebPay.simulateCall(to, value, callFunction, callArgs, {
        listener: this.callReturn1
    });
    callFunction = "getMe";
    callArgs = "[]";
    this.state.nebPay.simulateCall(to, value, callFunction, callArgs, {
        listener: this.callReturn2
    });
  }
  callReturn1(resp) {
    console.log("=== call return : " + JSON.stringify(resp.result));
  }
  callReturn2(resp) {
    console.log("=== call return : " + JSON.stringify(resp.result));
  }
  render() {
    return (
      <div>
        my Team tab
      </div>
    )
  }
}

export default MyTeam