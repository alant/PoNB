import React, { Component } from 'react';
import {
  Row,
  Card,
  CardTitle,
  CardText,
  Col,
  Input,
  Button,
  Alert } from 'reactstrap';
import NebPay from 'nebpay';
// import Nebulas from 'nebulas';
import BigNumber from 'bignumber.js';

class GamePlay extends Component {
  constructor() {
    super();
    this.state = {
      inputAmount: 0.05,
      withdrawAmount: "",
      nebPay: null,
      nebHeight: 0,
      availBalance: null,
      withdrawErrorMsg: ""
    }
  }
  componentWillMount() {
    this.setState({ nebPay: new NebPay() });
    // var Neb = Nebulas.Neb;
    // var neb = new Neb();
    // neb.setRequest(new Nebulas.HttpRequest("https://testnet.nebulas.io"));
    // // var height = 0;
    // neb.api.getNebState().then((state) => {
    //     // console.log("= neb state: " + JSON.stringify(state));
    //     console.log("==== current height :" + state.height);
    //     // height = state.height;
    //     // this.setState({nebHeight: height});
    // }).catch(function (err) {
    //     console.log(err);
    // })
  }
  componentDidMount() {
    var to = this.props.contractAddr;
    var value = "0";
    var callFunction = "getMe";
    var callArgs = "[]";
    this.state.nebPay.simulateCall(to, value, callFunction, callArgs, {
      listener: this.balanceCallReturn.bind(this)
    });
  }
  balanceCallReturn(resp) {
    if (resp.execute_err === "") {
      var balance = new BigNumber(JSON.parse(resp.result).balance);
      balance = balance.dividedBy(new BigNumber("1000000000000000000"));
      this.setState({ availBalance: balance });
    }
  }

  inputTeamHandler(event) {
    this.setState({ inputAmount: event.target.value });
  }
  inputWithdrawHandler(event) {
    this.setState({ withdrawAmount: event.target.value });
  }
  joinTeamHandler() {
    // console.log("=state: " + JSON.stringify(this.state));
    // console.log("=contract addr: " + this.props.contractAddr);
    //console.log("=nebpay: " + this.state.nebPay);
    var to = this.props.contractAddr;
    var value = this.state.inputAmount;
    var callFunction = "deposit";
    var callArgs = "[\"" + this.state.nebHeight + "\"]";
    this.state.nebPay.call(to, value, callFunction, callArgs, {
      listener: this.joinCallReturn.bind(this)
    });
  }
  joinCallReturn(resp) {
    // console.log("=response of deposit: " + JSON.stringify(resp));
    this.setState({ inputAmount: 0.05 });
  }
  withdrawHandler() {
    this.setState({ withdrawErrorMsg: "" });
    var amount = (new BigNumber(this.state.withdrawAmount)).times(new BigNumber("1000000000000000000"));
    console.log("== withDraw: " + amount);
    if (amount.gt(new BigNumber(0))) {
      var to = this.props.contractAddr;
      var value = "0";
      var callFunction = "withdraw";
      // console.log("=== withdraw: " + amount);
      var callArgs = "[\"" + amount + "\"]";
      this.state.nebPay.call(to, value, callFunction, callArgs, {
        listener: this.withdrawReturn.bind(this)
      });
    } else {
      console.log("=== error === amount not > 0");
      this.setState({ withdrawErrorMsg: "Withdraw amount needs to be larger than 0" });
    }
  }
  withdrawReturn(resp) {
    // console.log("=response of deposit: " + JSON.stringify(resp));
  }
  render() {
    return (
      <div className='new-team'>
        <Row>
          <Col sm="6">
            <Card body>
              <CardTitle>Join the Game!</CardTitle>
              <CardText>Click the join button below to join. The unit is in NAS. Minimum is 0.01</CardText>
              <Input
                value={this.state.inputAmount}
                onChange={this.inputTeamHandler.bind(this)}
                type="text" name="amount" className="gameInput" placeholder="Minimum 0.01 NAS" />
              <Button className="gamePlayBtn" onClick={this.joinTeamHandler.bind(this)}>Join!</Button>
            </Card>
          </Col>
          <Col sm="6">
            <Card body>
              <CardTitle>Withdraw your NAS</CardTitle>
              <CardText>You'll be missing out on future earnings. :(</CardText>
              <Input value={this.state.withdrawAmount}
                onChange={this.inputWithdrawHandler.bind(this)}
                type="text" name="wamount" className="gameInput" placeholder={this.state.availBalance ? "Available amount: " + this.state.availBalance + " NAS" : "Amount to withdraw"} />
              { this.state.withdrawErrorMsg && <Alert id="withdrawWarn" color="warning">{this.state.withdrawErrorMsg}</Alert> }
              <Button className="gamePlayBtn" onClick={this.withdrawHandler.bind(this)}> Submit</Button>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default GamePlay
