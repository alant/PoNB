"use strict";

var NBTeam = function(text) {
  if (text) {
    var obj = JSON.parse(text);
    this.name = obj.name;
    this.manager = obj.manager;
    this.balance = obj.balance;
    this.members = obj.members;
    this.memberCount = obj.memberCount;
    this.expiryHeight = new BigNumber(obj.expiryHeight);
  } else {
    this.name = "";
    this.manager = "";
    this.balance = new BigNumber(0);
    this.members = [];
    this.memberCount = 0;
    this.expiryHeight = new BigNumber(0);
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
    this.teams = obj.teams;
    this.expiryHeight = new BigNumber(obj.expiryHeight);
  } else {
    this.name = "";
    this.balance = new BigNumber[0];
    this.teams = [];
    this.expiryHeight = new BigNumber(0);
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
    this.amount = new BigNumber[0];
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
      depositRequirement: new BigNumber(10000000000000000), // 0.01 NAS
      rewardThreshold: 2,
      rewardPool: new BigNumber(0),
      devFund: new BigNumber(0),
      daBoss: "n1UziJREeLNgTQPDK8AAfZdutJdBvHVhXQ5"
    });
};

PoNBContract.prototype = {
  init: function () {
  },
  newTeam: function (name, nickname) {
    name = name.trim();
    // if (name === "") {
    //   throw new Error("Team name cannot be empty");
    // }
    // var from = Blockchain.transaction.from;
    // var contribution = Blockchain.transaction.value;
    // var nbTeam = new NBTeam();
    // nbTeam.name = name;
    // nbTeam.manager = from;
    // nbTeam.balance = contribution;
    // nbTeam.member.push(from);
    // this.team.put(name, nbTeam);
    // member = new NBMember();
    // nickname = nickname.trim();
    // if (nickname) {
    //   member.name = nickname;
    //   var nickN = new Nickname(nickname);
    //   this.nickname.put(from, nickN);
    // } else {
    //   member.nickname = from;
    // }
    //
    // var shortnameList = this.ownerList.get(from);
    // if (shortnameList) {
    //   shortnameList.push(shortname);
    //   this.ownerList.set(from, shortnameList);
    // } else {
    //   var shortnameList = [];
    //   shortnameList.push(shortname);
    //   this.ownerList.set(from, shortnameList);
    // }
  }
};

module.exports = PoNBContract;
