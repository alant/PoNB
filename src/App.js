import React, { Component } from 'react';
import Button from 'antd/lib/button';
import './App.css';
import NebPay from 'nebpay/nebpay.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      extensionState: "loading"
    }
  }
  componentWillMount() {
    if (typeof(webExtensionWallet) === "undefined") {
      console.log("webExtensionWallet not found");
      this.setState({ extensionState: "notFound" });
    } else {
      console.log("webExtensionWallet found");
      this.setState({ extensionState: "found" });
    }
  }
  checkStatus() {
    console.log("click happened");
    var nebPay = new NebPay();
    var dappAddress = "n1tMicsrXs7m3fmtywC9zjMDVUBYJBAg5p3";
    var to = dappAddress;
    var value = "0";
    var callFunction = "getCount";
    var callArgs = "[]"; //in the form of ["args"]
    nebPay.simulateCall(to, value, callFunction, callArgs, {    //使用nebpay的simulateCall接口去执行get查询, 模拟执行.不发送交易,不上链
        listener: this.callReturn
    });
  }
  callReturn(resp) {
    console.log("response of getCount: " + JSON.stringify(resp.result));
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Button onClick={this.checkStatus.bind(this)} type="primary">Button</Button>
      </div>
    );
  }
}

export default App;
