import React, { Component } from 'react';
import './App.css';
import NebPay from 'nebpay/nebpay.js';
import {  
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink} from 'reactstrap';
import { Link, Route } from 'react-router-dom';
import NewTeam from './CreateANewTeam';

/* Home component */
const Home = () => (
  <div>
    <h2>home</h2>
  </div>
)

/* Leaderboard component */
const Leaderboard = () => (
  <div>
    <h2>Leaderboard</h2>
  </div>
)

const contractAddr = "n1simWmMDk8mgy92n2GArN6hh2UJPdUfexP"

const MyNewTeam = (props) => {
  return (
    <NewTeam 
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
                    <Link to="/createANewTeam">Create a new team</Link>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink>My team</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink>About</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
         
          <div className="jumbotron">
            <Route exact={true} path="/" component={Home}/>
            <Route path="/leaderboard" component={Leaderboard}/>
            <Route path="/createANewTeam" render={MyNewTeam}/>
          </div>
          
        </div> 
      </div>
    );
  }
}

export default App;
