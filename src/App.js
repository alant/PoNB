import React, { Component } from 'react';
import './App.css';
import {  
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Alert} from 'reactstrap';
import { Link, Route } from 'react-router-dom';
import GamePlay from './GamePlay';
import Leaderboard from './Leaderboard';

class App extends Component {
  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      extensionAvail: false
    }
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  componentWillMount() {    
    if (typeof(webExtensionWallet) === "undefined") {
      // console.log("===webExtensionWallet not found===");
      this.setState({ extensionAvail: false });
    } else {
      // console.log("===webExtensionWallet found===");
      this.setState({ extensionAvail: true });
    }
  }
  render() {
    
    // //test
    // const contractAddr = "n1kxNPQvyvMa8D14bPLMiKawKMDZwm5kbUf"
 
    // //production
    const contractAddr = "n1fVEB7VgHLnx6ZRKFjMzQNN8G4NKuonD1A"
 
    // //old production, get the 0.01 nas out some day
    // const contractAddr = "n236B5EFnRcWNfZRAFyUUoPQ23w3QrMtEaW"

    /* Home component */
    const Home = function (props) {
      console.log("====home prop extension avail:" + props.extensionAvail);
      return (
        <div>
          {
            !props.extensionAvail && (
              <Alert color="warning">
                Unfortunately, Nebulas WebExtensionWallet is not detected. You need WebExtensionWallet to use this DApp.
                You can find installation instructions here: <a href="https://github.com/ChengOrangeJu/WebExtensionWallet">https://github.com/ChengOrangeJu/WebExtensionWallet </a>
                If you believe this warning is a mistake, drop me a line would you? Thanks.
              </Alert>
          )}
          <h2>Proof of Niubility</h2>
          <p>Google search result for <i>Niubility</i>: </p>
          <blockquote>
            <p>
              Impressive ability to perform and finish a task. “Niubi” has been a popular word in Chinese for the recent decade, meaning “awesome, impressive”. The English word niubility is a noun formed by blending “niubi” and ability.
            </p>
          </blockquote>
          <p>
            As the name Proof of Niubility or <b>PoNB</b> suggests, this is a game built on Nebulas blockchain (NAS) inspired by Proof of Weak Hands and many other PoXX spinoffs based on ETH. 
            Currently, the minimum buy in is 0.01 NAS. 10% of what's put in get distributed propotionally to the balance one has in the game. That's it!
          </p>
          {
            props.extensionAvail && (
              <p>Click “<Link to="/gamePlay">Play The Game</Link>" on top right corner to give PoNB a try and you too can be proven to be 牛逼!</p>
          )}
          <p>这是一个基于星云（Nebulas）的小游戏，玩法和以太坊上的 PoWH 相似。 
            具体规则是：最小投入 0.01 NAS。 投入以后，在您后面进入游戏的玩家投入的 10% 会根据您的余额在游戏里的占比分配给您。您就牛逼了！Proof of Niubility!
          </p>
          {
            props.extensionAvail && (
              <p> 进入游戏的方法是点击右上角的 ”<Link to="/gamePlay">Play The Game</Link>"。 </p>
          )}          
        </div>
      );
    } 
    const MyHome = (props) => {
      return (
        <Home
          extensionAvail={this.state.extensionAvail}
          {...props}
        />
      );
    }

    /* About component */
    const About = () => (
      <div>
        <p>
          Many thanks to helpful folks such as Oliver and Marcus on Slack and many others to make this Dapp happen.
        </p>
        <p>
          这个 DApp 主要用了 ReactJS，Reactstrap 和 nebPay 这几个库。
          写的过程中比较感谢宋鹏程，React.js 小书交流群（3群）里的 @李良知 @永春 @熠翊。
          当然最最需要感谢的还是支持我的家人和美丽的小仙女。在此一并谢过了。
        </p>
        <p>
          其实 PoNB 这个游戏还挺像梭哈老头的感觉。要放得开，进的早。给大家看看梭哈老头的照片。图片来自网络。 
        </p>
        <div>            
          <img className="suohaImage" alt="suoha old man" src={ require('./img/suoha.jpg') } />
        </div>
      </div>
    )

    const MyGamePlay = (props) => {
      return (
        <GamePlay 
          contractAddr={contractAddr}
          {...props}
        />
      );
    }

    const MyLeaderboard = (props) => {
      return (
        <Leaderboard 
          contractAddr={contractAddr}
          {...props}
        />
      );
    }
    return (
      <div className="App">
        <div className="container">
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/">PoNB</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
              {
                this.state.extensionAvail && (
                  <NavItem>
                    <NavLink href="/leaderboard">
                      Leaderboard
                    </NavLink>
                  </NavItem>
              )}
              {
                this.state.extensionAvail && (
                  <NavItem>
                    <NavLink href="/gamePlay">
                      Play The Game
                    </NavLink>
                  </NavItem>
              )}        
                <NavItem>
                  <NavLink href="/about">
                    About
                  </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
          <div className="jumbotron" id="myJumbotron">
            <Route exact={true} path="/" render={MyHome}/>
            {this.state.extensionAvail && (
              <Route path="/leaderboard" render={MyLeaderboard}/>)}
            {this.state.extensionAvail && (
              <Route path="/gamePlay" render={MyGamePlay}/>)}
            <Route path="/about" component={About}/>
          </div>
          <footer>
            <Row>
              <Col sm="12" md="12" lg="12">
                <p className="align-self-center">
                  Made with &#10084; by <a href="http://ahtang.com">Alan 汤包</a>
                </p>
              </Col>
            </Row>
          </footer>
        </div> 
      </div>
    );
  }
}

export default App;
