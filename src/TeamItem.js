import React, { Component } from 'react';

class TeamItem extends Component {
  static defaultProps = {
    teamsNames: []
  }
  constructor() {
    super();
    this.state = {
      nebPay: null,
      teams: []
    }
  }
  render() {
    return(
      <div className='team-list'>
        {this.props.teams.map(
          (team,i) => {
            return(
              <div key={i}>
                <div className='team'>
                  <div className='team-name'>
                    <span>{team.name}</span>
                    <span>{team.balance}</span>
                    <span>{team.manager}</span>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    );
  }
}

export default TeamItem
