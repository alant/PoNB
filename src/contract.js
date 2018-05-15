"use strict";

var NBTeam = function (text) {
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

var NBMember = function (text) {
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

var Nickname = function (text) {
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

var TeamName = function (text) {
  if (text) {
    var obj = JSON.parse(text);
    this.names = obj.names;
  } else {
    this.names = [];
  }
};

TeamName.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var PoNBContract = function () {
  LocalContractStorage.defineMapProperty(this, "gameConfig", {
    stringify: function (obj) {
        return obj.toString();
    },
    parse: function (str) {
        return new BigNumber(str);
    }
  });
  LocalContractStorage.defineMapProperty(this, "teams", {
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
  LocalContractStorage.defineMapProperty(this, "teamNames", {
    stringify: function (obj) {
        return obj.toString();
    },
    parse: function (str) {
        return new TeamName(str);
    }
  });
  LocalContractStorage.defineProperties(this, {
    rewardPercent: null,
    daBoss: null,
    prizeRatio: null
  });
};

PoNBContract.prototype = {
  init: function () {
    this.gameConfig.put("minDeposit", "10000000000000000");// 0.01 NAS;
    this.gameConfig.put("rewardPool", "0");

    this.daBoss = "n1UziJREeLNgTQPDK8AAfZdutJdBvHVhXQ5";
    this.prizeRatio = 0.5;
    this.rewardPercent = 0.05;
  },
  newTeam: function (teamName, mgrName) {
    teamName = teamName.trim();
    mgrName = mgrName.trim();
    if (teamName === "") {
      throw new Error("Team name cannot be empty");
      // throw new Error("Team name must be empty");
    }
    var nbTeam = this.teams.get(teamName);
    if (nbTeam) {
      throw new Error("This team name already taken. Pick another name");
    }
    var contribution = Blockchain.transaction.value;
    var minDeposit = this.gameConfig.get("minDeposit");
    // throw new Error("contribution: " + contribution + "minDeposit: " + minDeposit);
    if (contribution.lt(minDeposit)) {
      throw new Error("deposit too low"+ "; contribution: " + contribution + "; minDeposit: " + minDeposit);
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
    nbTeam.members.push(from);
    nbTeam.count += 1;


    var myTeamNames = this.teamNames.get("teamNames");
    if (!myTeamNames) {
      myTeamNames = new TeamName();
    }
    myTeamNames.names.push(teamName);
    this.teamNames.put("teamNames", myTeamNames);
    // throw new Error("not a number?: " + this.prizeRatio + " and boss: " + this.daBoss);

    var prizeMoney = contribution.times(new BigNumber(this.prizeRatio));
    var rewardPool = this.gameConfig.get("rewardPool");
    rewardPool = rewardPool.plus(prizeMoney);
    this.gameConfig.set("rewardPool", rewardPool);

    var myMember = this.member.get(from);
    myMember.balance = (new BigNumber(myMember.balance)).plus(contribution.minus(prizeMoney));
    myMember.team = teamName;
    this.member.put(from, myMember);

    nbTeam.balance = myMember.balance;
    this.teams.put(teamName, nbTeam);
  },
  joinTeam: function (nickName, teamName) {
    teamName = teamName.trim();
    nickName = nickName.trim();
    if (teamName === "") {
      throw new Error("Team name cannot be empty");
      // throw new Error("Team name must be empty");
    }
    var contribution = Blockchain.transaction.value;
    var minDeposit = this.gameConfig.get("minDeposit");
    // throw new Error("contribution: " + contribution + "minDeposit: " + minDeposit);
    if (contribution.lt(minDeposit)) {
      throw new Error("deposit too low"+ "; contribution: " + contribution + "; minDeposit: " + minDeposit);
    }

    var prizeMoney = contribution.times(new BigNumber(this.prizeRatio));
    var rewardPool = this.gameConfig.get("rewardPool");
    rewardPool = rewardPool.plus(prizeMoney);
    this.gameConfig.set("rewardPool", rewardPool);

    var from = Blockchain.transaction.from;
    if (!this._memberExists(from)) {
      this._createMember(mgrName, from);
    }
    if (this._hasTeam(from)) {
      throw new Error("quit your current team before joining a new team");
    }
    var myMember = this.member.get(from);
    var afterPot = contribution.minus(prizeMoney);
    var forTeam = afterPot.times(new BigNumber(this.prizeRatio));
    _distribute(teamName, forTeam);
    var forMe = afterPot.minus(forTeam);
    myMember.team = teamName;
    myMember.balance = myMember.balance.plus(forMe);
    this.member.put(from, myMember);

    var nbTeam = this.teams.get(teamName);
    if (!nbTeam) {
      throw new Error("This team does not exist. Please create it, if you'd like");
    }
    nbTeam.members.push(from);
    nbTeam.count += 1;
    nbTeam.balance = nbTeam.balance.plus(forTeam);
    this.teams.put(teamName, nbTeam);
  },
  _memberExists: function (addr) {
    var member = this.member.get(addr);
    if (member) {
      return true;
    } else {
      return false;
    }
  },
  _createMember: function (nickname, addr) {
    var memberObj = new NBMember();
    if (nickname) {
      memberObj.name = nickname;
      // add to nicknames
      var nicknameObj = new Nickname();
      nicknameObj.name = nickname;
      this.nicknames.put(addr, nicknameObj);
    } else {
      memberObj.name = addr;
    }
    this.member.put(addr, memberObj);
  },
  _hasTeam: function (addr) {
    var member = this.member.get(addr);
    if (member) {
      if (member.team !== "") {
        return true;
      } else {
        return false;
      }
    } else {
      throw new Error("internal error _hasTeam, should create member first");
    }
  },
  _distrubute: function (teamName, amount) {
    var nbTeam = this.teams.get(teamName);
    if (!nbTeam) {
      throw new Error("internall call failed, wrong teamName in _distribute()");
    }
    var teamMembers = nbTeam.members;
    teamMembers.forEach((addr) => {
      var member = this.member.get(addr);
      var ratio = member.balance.dividedBy(nbTeam.balance);
      var money = member.balance.times(ratio);
      member.balance.plus(perPerson);
      this.member.set(addr, member);
    });
  },
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
    return this.teams.get(name);
  },
  getMe: function () {
    var from = Blockchain.transaction.from;
    return this.member.get(from);
  }
};

module.exports = PoNBContract;