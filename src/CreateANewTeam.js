import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Col, Button } from 'reactstrap';
import NebPay from 'nebpay/nebpay.js';

class NewTeam extends Component {
  constructor() {
    super();
    this.state = {
      teamName: '',
      mgrName: '',
      nebPay: null
    }
  }
  componentWillMount() {
    this.setState({nebPay: new NebPay()});
  }
  inputTeamNameHandler(event) {
    this.setState({ teamName: event.target.value});
  }
  inputMgrNameHandler(event) {
    this.setState({ mgrName: event.target.value});
  }
  newTeamHandler() {
    console.log("state: " + this.state);
    console.log("contract addr: " + this.props.contractAddr);
    console.log("nebpay: " + this.state.nebPay);
    var to = this.props.contractAddr;
    var value = "0.01";
    var callFunction = "newTeam";
    var callArgs = "[\"" + this.state.teamName + "\",\"" + this.state.mgrName + "\"]"; 
    this.state.nebPay.call(to, value, callFunction, callArgs, {
        listener: this.setReturn
    });
  }
  callReturn(resp) {
    console.log("response of getCount: " + JSON.stringify(resp.result));
  }

  render() {
    return (
      <div className='new-team'>
        <Form>
          <FormGroup row>
            <Label for="teamName" sm={2}>Team Name</Label>
            <Col sm={6}>
              <Input 
                value={this.state.teamName}
                onChange={this.inputTeamNameHandler.bind(this)}
                type="text" name="teamName" id="teamName" placeholder="choose an unique team name" />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="mgrName" sm={2}>Your name</Label>
            <Col sm={6}>
              <Input value={this.state.mgrName}
              onChange={this.inputMgrNameHandler.bind(this)}
              type="text" name="nickname" id="mgrName" placeholder="type in your name" />
            </Col>
          </FormGroup>
          <Button onClick={this.newTeamHandler.bind(this)}> Submit</Button>
        </Form>
      </div>
    );
  }
}

export default NewTeam
