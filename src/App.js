import React, { Component } from 'react';
import './App.css';
import {  
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink} from 'reactstrap';
import { Link, Route } from 'react-router-dom';
import GamePlay from './GamePlay';
import Leaderboard from './Leaderboard';

/* Home component */
const Home = () => (
  <div>
    <h2>Proof of Niubility</h2>
    <p>这是一个基于星云（Nebulas）的小游戏，进入游戏的方法是点击右上角的 “<Link to="/gamePlay">Play The Game</Link>"。 最小投入 0.01 NAS。 投入以后，在您后面进入游戏的玩家投入的 10% 会根据您的余额在游戏里的占比分配给您。您就牛逼了！Proof of Niubility!</p>
  </div>
)

const contractAddr = "n21QT3oy5D2cfUe2M1h3ym7JLtsxxm4AKQL"

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


class App extends Component {
  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    this.state = {
      extensionState: "loading",
      isOpen: false
    }
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
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

  render() {
    return (
      <div className="App">
        <div className="container">
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/">PoNB</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink>
                    <Link to="/leaderboard">Leaderboard</Link> 
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink>
                    <Link to="/gamePlay">Play The Game</Link>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink>About</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
         
          <div className="jumbotron">
            <Route exact={true} path="/" component={Home}/>
            <Route path="/leaderboard" component={MyLeaderboard}/>
            <Route path="/gamePlay" render={MyGamePlay}/>
          </div>
          
        </div> 
      </div>
    );
  }
}

export default App;
