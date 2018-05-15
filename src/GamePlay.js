import React, { Component } from 'react';
import { Form, Button } from 'reactstrap';
import NebPay from 'nebpay/nebpay.js';
import Nebulas from 'nebulas';

class GamePlay extends Component {
  constructor() {
    super();
    this.state = {
      teamName: '',
      mgrName: '',
      nebPay: null,
      nebHeight: 0
    }
  }
  componentWillMount() {
    this.setState({nebPay: new NebPay()});
    var Neb = Nebulas.Neb;
    var neb = new Neb();
    neb.setRequest(new Nebulas.HttpRequest("https://testnet.nebulas.io"));
    var height = 0;
    neb.api.getNebState().then((state) => {
        console.log("= neb state: " + JSON.stringify(state));
        console.log("= height :" + state.height);
        height = state.height;
        this.setState({nebHeight: height});
    }).catch(function (err) {
        console.log(err);
    })
    
  }
  inputTeamNameHandler(event) {
    this.setState({ teamName: event.target.value});
  }
  inputMgrNameHandler(event) {
    this.setState({ mgrName: event.target.value});
  }
  joinTeamHandler() {
    console.log("=state: " + JSON.stringify(this.state));
    console.log("=contract addr: " + this.props.contractAddr);
    //console.log("=nebpay: " + this.state.nebPay);
    var to = this.props.contractAddr;
    var value = "0.01";
    var callFunction = "deposit";
    // var height=
    var callArgs = "[\"" + this.state.nebHeight + "\"]"; 
    this.state.nebPay.call(to, value, callFunction, callArgs, {
        listener: this.callReturn
    });
  }
  callReturn(resp) {
    console.log("=response of deposit: " + JSON.stringify(resp.result));
  }

  render() {
    return (
      <div className='new-team'>
        <Form>
          <Button onClick={this.joinTeamHandler.bind(this)}>Pay to Join</Button>
        </Form>
      </div>
    );
  }
}

export default GamePlay
