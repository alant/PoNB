import React, { Component } from 'react';
import NebPay from 'nebpay';
import { Table } from 'reactstrap';

class Leaderboard extends Component {
  constructor() {
    super();
    this.state = {
      nebPay: null,
      to: '', //contract address
      members: [],
      fetchInProgress: true
    };
  }
  componentWillMount() {
    this.setState({ nebPay: new NebPay() });
    this.setState({ to: this.props.contractAddr });
  }
  promiseSimulateCall(to, value, callFunction, callArgs) {
    return new Promise((resolve, reject) => {
      this.state.nebPay.simulateCall(to, value, callFunction, callArgs, {
        listener: (resp) => {
          console.log('====>' + JSON.stringify(resp));
          // if (resp == null || resp.execute_err !== "") {
          //   reject(Error("promiseSimulateCall broke"));
          // } else {
          //   resolve(resp);
          // }
          resolve(resp);
        }
      });
    });
  }
  componentDidMount() {
    // console.log("=Leaderboard contract addr: " + this.props.contractAddr);
    var value = '0';
    var callFunction = 'getTeam';
    var callArgs = '[]';
    this.promiseSimulateCall(this.state.to, value, callFunction, callArgs).then(
      (resp) => {
        console.log('=pSCall1 result:' + JSON.stringify(resp));
        if (resp.result) {
          var result = JSON.parse(resp.result);
          var pArray = result.members.map((addr) => {
            var value = '0';
            var callFunction = 'getBalance';
            var callArgs = '["' + addr + '"]';
            return this.promiseSimulateCall(
              this.state.to,
              value,
              callFunction,
              callArgs
            );
          });
          var promises = Promise.all(pArray);
          promises.then((results) => {
            var stateMembers = [];
            console.log('==promiseall:' + JSON.stringify(results));
            for (var i = 0; i < result.members.length; i++) {
              console.log(`result: ${i} ${result[i]}`);
              if (results[i] && results[i].result) {
                var bigB = parseFloat((parseInt(JSON.parse(results[i].result), 10) / 10 ** 18).toFixed(6));
                // bigB = bigB.dividedBy(new BigNumber("1000000000000000000"));
                stateMembers.push({
                  addr: result.members[i],
                  balance: bigB.toString()
                });
              }
            }
            this.setState({ members: stateMembers });
            this.setState({ fetchInProgress: false });
          });
        } else {
          console.log("==> =pSCall1 result empty!");
          window.location.reload();
        }
      }
    );
  }
  render() {
    const Members = this.state.members.map((member, i) => {
      return (
        <tr key={i}>
          <td>{member.addr}</td>
          <td>{member.balance}</td>
        </tr>
      );
    });
    return (
      <div>
        {this.state.fetchInProgress ? (
          <p> Loading from Nebulas blockchain... </p>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Address</th>
                <th>Balance (NAS)</th>
              </tr>
            </thead>
            <tbody>{Members}</tbody>
          </Table>
        )}
      </div>
    );
  }
}

export default Leaderboard;
