"use strict";

var NBTeam = function(text) {
  if (text) {
    var obj = JSON.parse(text);
    this.name = obj.name;
    this.manager = obj.manager;
    this.balance = obj.balance;
    this.members = obj.members;
    this.count = obj.count; //used to quickly distribute new member fees
  } else {
    this.name = "";
    this.manager = "";
    this.balance = new BigNumber(0);
    this.members = [];
    this.count = 0;
  }
};

NBTeam.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var NBMember = function(text) {
  if (text) {
    var obj = JSON.parse(text);
    this.name = obj.name;
    this.balance = obj.balance;
    this.team = obj.team;
  } else {
    this.name = "";
    this.balance = new BigNumber(0);
    this.team = "";
  }
};

NBMember.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var Nickname = function(text) {
  if (text) {
    var obj = JSON.parse(text);
    this.name = obj.name;
  } else {
    this.name = "";
  }
};

Nickname.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var Jackpot = function(text) {
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

var PoNBContract  = function () {
    LocalContractStorage.defineMapProperty(this, "team", {
        parse: function (text) {
            return new NBTeam(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineMapProperty(this, "member", {
        parse: function (text) {
            return new NBMember(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineMapProperty(this, "nicknames", {
        parse: function (text) {
            return new Nickname(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineMapProperty(this, "jackpot", {
        parse: function (text) {
            return new Jackpot(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineProperties(this, {
      depositRequirement: null, 
      rewardPercent: null,
      rewardPool: null,
      devFund: null,
      daBoss: null,
      teamNames: null
    });
};

PoNBContract.prototype = {
  init: function () {
    var dReq = new BigNumber(10000000000000000);// 0.01 NAS
    var teamNamesArray = [];
    var rPecent = 0.05;
    var dFund = new BigNumber(0);
    var bigBoss = "n1UziJREeLNgTQPDK8AAfZdutJdBvHVhXQ5";
    
    this.depositRequirement = dReq;
    this.teamNames = teamNamesArray;
    this.rewardPercent = rPecent;
    this.rewardPool = new BigNumber(0);
    this.devFund = dFund;
    this.daBoss = bigBoss;
  },
  newTeam: function (teamName, mgrName) {
    teamName = teamName.trim();
    mgrName = mgrName.trim();
    if (teamName === "") {
      throw new Error("Team name cannot be empty");
    }
    var nbTeam = this.team.get(teamName);
    if (nbTeam){
      throw new Error("This team name already taken. Pick another name");
    }
    var contribution = Blockchain.transaction.value;
    if (!this._passThreshold(contribution)) {
      throw new Error("Must transfer the minium amount to create a new team");
    }
    var from = Blockchain.transaction.from;

    if (!this._memberExists(from)) {
      this._createMember(mgrName, from);
    }
    if (this._hasTeam(from)) {
      throw new Error("quit your current team before creating a new team");
    }
    nbTeam = new NBTeam();
    nbTeam.name = teamName;
    nbTeam.manager = from;
    this.team.put(teamName, nbTeam);
 
    this.teamNames.push(teamName);

    nbTeam.members.push(from);
    nbTeam.count += 1;
    this.team.put(teamName, nbTeam);
  
    var prizeMoney = contribution.times(0.5);
    var rewardMoney = new BigNumber(this.rewardPool);
    this.rewardPool = rewardMoney.plus(prizeMoney);
    // rewardBalance.plus(prizeMoney);
    // this.rewardPool = rewardBalance;

    // var teamMoney = contribution.minus(prizeMoney);
  },
  _passThreshold: function (amount) {
    if (amount >= this.depositRequirement) {
      return true;
    } else {
      return false;
    }
  },
  _memberExists: function (addr) {
    var member = this.member.get(addr);
    if (member) {
      return true;
    } else {
      return false;
    }
  },
  _hasTeam: function (addr) {
    var member = this.member.get(addr);
    if (member) {
      if (member.team !== "") {
        return true;
      }
    } else {
      throw new Error("internal error _hasTeam, should create member first");
    }
    return false;
  },
  _createMember: function (nickname, addr) {
    var memberObj = new NBMember();
    if (nickname) {
      memberObj.name = nickname;
      var nicknameObj = new Nickname();
      nicknameObj.name = nickname;
      this.nicknames.put(addr, nicknameObj);
    } else {
      memberObj.name = addr;
    }
    this.member.put(addr, memberObj);
  },
  deposit: function (to, amount) {
    var reward = amount.times(0.5);
    var deposit = amount.minus(reward);
    this.bankVault.put(from, deposit);
    this.rewardPool.add(reward);
  },
  joinTeam: function (memberName, teamName) {
    teamName = teamName.trim();
    memberName = memberName.trim();
    if (teamName === "") {
      throw new Error("Team name cannot be empty");
    }
    var nbTeam = this.team.get(teamName);
    if (!nbTeam){
      throw new Error("This team does not exist. Try create one");
    }

    var from = Blockchain.transaction.from;
    nbTeam.members.push(from);
    nbTeam.count += 1;
    this.team.set(teamName, nbTeam);

    if (!this._memberExists(from)) {
      this._createMember(memberName, from);
    }

    var contribution = Blockchain.transaction.value;
    if (!this._passThreshold(contribution)) {
      throw new Error("Must transfer the minium amount to join a team");
    }
    
    var prizeMoney = contribution.times(0.5);
    this.rewardPool.add(prizeMoney);

    var teamMoney = contribution.minus(prizeMoney);
    _distribute(teamMoney, teamName);
  },
  _distrubute: function(amount, teamName) {
    var nbTeam = this.team.get(teamName);
    if (!nbTeam){
      throw new Error("internall call failed, wrong teamName in _distribute()");
    }
    var perPerson = amount.dividedBy(nbTeam.count);
    var teamMembers = nbTeam.members;
    teamMembers.forEach((addr) => {
      var member = this.member.get(addr);
      member.balance.plus(perPerson);
    });
  },
  getBalance: function(addr) {
    var member = this.member.get(addr);
    if (member) {
      return member.balance;
    } else {
      throw new Error("no such member");
    }
  },
  getTeamNames: function() {
    return this.teamNames;
  },
  getTeam: function(name) {
    return this.team.get(name);
  }
};

module.exports = PoNBContract;
