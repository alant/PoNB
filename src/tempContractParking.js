





var Jackpot = function (text) {
  if (text) {
    var obj = JSON.parse(text);
    this.amount = obj.amount;
    this.winner = obj.winner;
  } else {
    this.amount = new BigNumber(0);
    this.winner = "";
  }
};

Jackpot.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};






  LocalContractStorage.defineMapProperty(this, "jackpot", {
    parse: function (text) {
      return new Jackpot(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  });



 // _passThreshold: function (amount) {
  //   var minDeposit = this.gameConfig.get("minDeposit");
  //   throw new Error("minDeposit: " + minDeposit);
  //   if (amount.lt(minDeposit)) {
  //     throw new Error("amount: " + amount + "bigger than: " + minDeposit);
  //     return true;
  //   } else {
  //     throw new Error("amount: " + amount + "smaller than: " + minDeposit);
  //     return false;
  //   }
  },
  // deposit: function (to, amount) {
  //   var reward = amount.times(0.5);
  //   var deposit = amount.minus(reward);
  //   this.bankVault.put(from, deposit);
  //   this.rewardPool.add(reward);
  // },
  // joinTeam: function (memberName, teamName) {
  //   teamName = teamName.trim();
  //   memberName = memberName.trim();
  //   if (teamName === "") {
  //     throw new Error("Team name cannot be empty");
  //   }
  //   var nbTeam = this.team.get(teamName);
  //   if (!nbTeam) {
  //     throw new Error("This team does not exist. Try create one");
  //   }

  //   var from = Blockchain.transaction.from;
  //   nbTeam.members.push(from);
  //   nbTeam.count += 1;
  //   this.team.set(teamName, nbTeam);

  //   if (!this._memberExists(from)) {
  //     this._createMember(memberName, from);
  //   }

  //   var contribution = Blockchain.transaction.value;
  //   if (!this._passThreshold(contribution)) {
  //     throw new Error("Must transfer the minium amount to join a team");
  //   }

  //   var prizeMoney = contribution.times(0.5);
  //   this.rewardPool.add(prizeMoney);

  //   var teamMoney = contribution.minus(prizeMoney);
  //   _distribute(teamMoney, teamName);
  // },
  // _distrubute: function (amount, teamName) {
  //   var nbTeam = this.team.get(teamName);
  //   if (!nbTeam) {
  //     throw new Error("internall call failed, wrong teamName in _distribute()");
  //   }
  //   var perPerson = amount.dividedBy(nbTeam.count);
  //   var teamMembers = nbTeam.members;
  //   teamMembers.forEach((addr) => {
  //     var member = this.member.get(addr);
  //     member.balance.plus(perPerson);
  //   });
  // },
  
  getRewardPool: function () {
    return this.gameConfig.get("rewardPool");
  },
  getRewardPercent: function () {
    return this.rewardPercent;
  },
  getMinDeposit: function () {
    return this.gameConfig.get("minDeposit");
  },
  getBalance: function (addr) {
    var member = this.member.get(addr);
    if (member) {
      return member.balance;
    } else {
      throw new Error("no such member");
    }
  },
  getTeamNames: function () {
    return this.teamNames.get("teamNames");
  },
  getTeam: function (name) {
    name = name.trim();
    return this.team.get(name);
  },
  getMe: function () {
    var from = Blockchain.transaction.from;
    return this.members.get(from);
  },