import React, { Component } from 'react';
import NebPay from 'nebpay/nebpay.js';
import TeamItem from './TeamItem';

class Leaderboard extends Component {
  constructor() {
    super();
    this.state = {
      nebPay: null,
      to: "",
      teams: []
    }
  }
  componentWillMount() {
    this.setState({nebPay: new NebPay()});
    this.setState({to: this.props.contractAddr});
  }
  componentDidMount() {
    console.log("Leaderboard using contract addr: " + this.props.contractAddr);
    var value = "0";
    var callFunction = "getTeamNames";
    var callArgs = "[]";
    this.state.nebPay.simulateCall(this.state.to, value, callFunction, callArgs, {
        listener: this.callReturn1.bind(this)
    });
  }
  callReturn1(resp) {
    console.log(resp.result);
    var result = JSON.parse(resp.result);
    result.names.map((team) => {
      var value = "0";
      var callFunction = "getTeam";
      var callArgs = "[\"" + team + "\"]";
      this.state.nebPay.simulateCall(this.state.to, value, callFunction, callArgs, {
          listener: this.callReturn2
      });
    });
  }
  callReturn2(resp) {
    console.log("= callReturn2: " + resp.result);
  }
  render() {
    return (
      <div>
        coming soon
        {/* <TeamItem teams={this.state.teams} /> */}
      </div>
    )
  }
}

export default Leaderboard