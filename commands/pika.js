﻿'use strict';

const TEAM_SLOTS = 12;
const EXP_CONST = 0.2;
const EXP_REQ = {
	0: 3,
	1: 10
};

/**
 * Creates an entry for the 
 * player in the database
 *
 * @param {string} nick
 *
 * @returns {void}
 */

let createPlayer = (nick) => {
	let playerInfo = {
		level: 0,
		money: 0,
		exp: 0,
		rank: "Pichu",
		quests: 0,
		team: [],
		bag: {}
	};

	Db('pika').set(nick, playerInfo);
};

/**
 * Returns index of the min value
 *
 * @param {array} team
 *
 * @returns {integer}
 */

let getMinValueIndex = (team) => {
	let values = [];

	for (let i = 0, len = team.length; i < len; i++) {
		let value = Object.values(team[i])[0].level;
		values.push(value);
	}

	let minValue = Math.min(...values);
	let indexOfMin = values.indexOf(minValue);

	return indexOfMin;
};
let setMoney = (nick, money) => {
	let userMoney = Db('pika').get([nick, "money"]);
	userMoney += money;
	Db('pika').set([nick, "money"], userMoney);
};
let setQuests = (nick, quests) => {
	let userQuests = Db('pika').get([nick, "quests"]);
	userQuests += quests;
	Db('pika').set([nick, "quests"], userQuests);
};


/**
 * Populates the team array
 *
 * @param {string}  nick
 * @param {string}  species
 * @param {integer} level
 *
 * @returns {void}
 */

let populateTeam = (nick, species, level) => {
	let team = Db('pika').get([nick, "team"]);
	let mon = {[species]: { level: level }};

	if (team.length >= TEAM_SLOTS) {
		let minLevelIndex = getMinValueIndex(team);
		let minLevel = Object.values(team[minLevelIndex])[0].level;
		if (minLevel < level) team[minLevelIndex] = mon;
	} else {
		team.push(mon);
	}

	Db('pika').set([nick, "team"], team);
};

/**
 * Checks if the player exists 
 * in the database
 *
 * @param {string}  nick
 * @param {integer} exp
 *
 * @returns {void}
 */

let setEXP = (nick, exp) => {
	let level = Db('pika').get([nick, "level"]);
	let userEXP = Db('pika').get([nick, "exp"]);
	let requiredEXP = ((level + 1) ** 2) / EXP_CONST;
	if (level < 2) requiredEXP = EXP_REQ[level];

	console.log(exp, requiredEXP);
	let obtainedEXP = userEXP + exp;
	if (obtainedEXP > requiredEXP) {
		let remainingEXP = obtainedEXP - requiredEXP;

		while (remainingEXP !== 0) {
			level++;
			Db('pika').set([nick, "exp"], 0);
			requiredEXP = ((level + 1) ** 2) / EXP_CONST;

			if (remainingEXP > requiredEXP) {
				remainingEXP = remainingEXP - requiredEXP;
			} else {
				Db('pika').set([nick, "level"], level);
			}

				userEXP += remainingEXP;
				Db('pika').set([nick, "exp"], remainingEXP);

				remainingEXP = 0;
			}
		
	} else if (obtainedEXP === requiredEXP) {
		level++;
		Db('pika').set([nick, "exp"], 0);
		Db('pika').set([nick, "level"], level);

	} else {
		userEXP += exp;
		Db('pika').set([nick, "exp"], userEXP);
	}
};

/**
 * Checks if the player exists 
 * in the database
 *
 * @param {string} nick
 *
 * @returns {boolean}
 */

let playerExists = (nick) => {
	return Db('pika').has(nick);
};

// Working on this
// Needs to change avatar
// ranking is pichu -> pikachu -> raichu -> raichu alola
/**
 * Prepares player profile
 *
 * @param {string} nick
 *
 * @returns {string}
 */

let createProfile = (nick) => {
	let level = Db('pika').get([nick, "level"]);
	let money = Db('pika').get([nick, "money"]);
	let exp = Db('pika').get([nick, "exp"]);
	let rank = Db('pika').get([nick, "rank"]);
	let quests = Db('pika').get([nick, "quests"]);
	let team = Db('pika').get([nick, "team"]);

	let display = `<div style="padding: 5px; max-height: 200px; overflow-y: auto;"><div style="max-height: 80px; overflow-y: auto; float: right; padding: 5px; background: #DDD; border: 1px solid #AAA; border-radius: 5px;">`;

	let sebaNamingSeq = {
		pichu: "Pichu",
		pikachu: "Pikachu",
		raichu: "Raichu",
		raichualola: "RaichuAlola"
	};

	for (let i = 0, len = team.length; i < len; i++) {
		let pokemon = toId(Object.keys(team[i])[0]);
		let pkmnLevel = team[i][pokemon].level;
		let IMG = `<img src="http://pikachuvalley.bitballoon.com/icons/${sebaNamingSeq[pokemon]}_lv${Math.floor(pkmnLevel / 5) * 5}.png" width="32" height="32" title="${(i + 1)}" />`;
		if (((i + 1) % 3) === 0) {
			IMG += "<br />";
		} else {
			IMG += "&nbsp;";
		}

		display += IMG;
	}

	let requiredEXP = EXP_REQ[level] ? EXP_REQ[level] : ((level + 1) ** 2) / EXP_CONST;
	let EXP_REQ_PERCEN = ((exp / requiredEXP) * 100).toFixed(0);

	display += `</div><img style="float: left;" src="http://2.bp.blogspot.com/-gOcDY6tnw7U/Uefaeit6KLI/AAAAAAAAAho/sH3DenKbrZE/s1600/tumblr_static_pichu3-1.gif" width="80" height="80" /><strong>Player:&nbsp;</strong>${nick}<br /><strong>Level:&nbsp;</strong>${level}<br /><strong>Pok&eacute; Dollars:&nbsp;</strong><img src="https://cdn.bulbagarden.net/upload/8/8c/Pok%C3%A9monDollar.png" width="7" height="14" />&nbsp;${money}<br /><strong>Rank:&nbsp;</strong>${rank}<br /><strong>Quests Completed:&nbsp;</strong>${quests}<br /><br /><center><div style="width: 100%; height: 15px; display: inline-block; border: 1px solid #000;" title="${exp}/${requiredEXP}"><div style="float: left; width: ${EXP_REQ_PERCEN}%; height: 100%; background: #FFCC00;"></div></div><font style="float: right; font-family: monospace; font-size: 0.9em;">[${exp}/${requiredEXP}]</font></center></div>`;

	return display;
};

/**
 * #Commands#
 *
 * - @pikareg [player]                                           
 *  - Registers players. 
 *  - Requires [&, #]
 *
 * - @pikaunreg [player]                                     
 *  - Deregisters players.                                                
 *  - Requires [&, #]
 *
 * - @pikacleanse                                               
 *  - Cleans the database.                                                 
 *  - Requires ["Dragotic"]
 *
 * - @pikateam [player], [pokemon], [level]        
 *  - Populates the player's team.                                            
 *  - Requires [%, @, &, #]
 *
 * - @pikapika [player], [position], [level]            
 *  - Changes level of pokemon at the specified index.        
 *  - Requires [%, @, &, #]
 *
 * - @pikaremove [player], [position]
 *	- Removes the pokemon at the specified index.
 *	- Requires [%, @, &, #]
 * 
 * - @pikaup [player], [level]                                
 *  - Sets the player's level.                                           
 *  - Requires [%, @, &, #]
 *
 * - @pikaxp [player], [exp]                                
 *  - Awards the player with experience points.                                           
 *  - Requires [%, @, &, #]
 *
 * - @pikaprofile [player]                                   
 *  - Displays the player's profile.                                    
 *  - Requires [%, @, &, #]
 */

exports.commands = {
	pikareg: function (arg, user, room) {
		if (!this.can('pikareg')) return this.reply("``&`` required to use this command!");

		let player = toId(arg);
		if (!player) return this.reply("Help: ``" + this.cmdToken + "pikareg [player]``");
		if (playerExists(player)) return this.reply(`${player} is already registered`);

		createPlayer(player);

		return this.reply(`${player} has been registered`);
	},

	pikadereg: function (arg, user, room) {
		if (!this.can('pikareg')) return this.reply("``&`` required to use this command!");

		let player = toId(arg);
		if (!player) return this.reply("Help: ``" + this.cmdToken + "pikadereg [player]``");
		if (!playerExists(player)) return this.reply(`${player} doesn't exists`);

		Db('pika').delete(player);

		return this.reply(`${player} has been deregistered`);
	},

	pikacleanse: function (arg, user, room) {
		if (!this.isExcepted) return;

		let db = Db('pika').object();
		let players = Object.keys(db);

		for (let i = 0, len = players.length; i < len; i++) {
			Db('pika').delete(players[i]);
		}

		return this.reply("The database has been cleansed!");
	},

	pikateam: function (arg, user, room) {
		if (!this.can('wall')) return this.reply("``%`` required to use this command!");

		let params = arg.split(",");
		if (params.length < 3) return this.reply("Help: ``" + this.cmdToken + "pikateam [player], [pokemon], [level]``");

		let player = toId(params[0]);
		let pokemon = toId(params[1]);
		let level = Number(params[2]);
		if (!playerExists(player)) return this.reply(player + " doesn't exist, register them with ``" + this.cmdToken + "pikareg [player]``");
		if (!Number.isInteger(level)) return this.reply("The [level] value must be positive integers!");
		if (level < 10 || level > 100) return this.reply("The level range is ``10-100``!");

		populateTeam(player, pokemon, level);

		return this.reply(player + " caught a Lv.: ``" + level + "`` ``" + pokemon + "``!");
	},

	pikapika: function (arg, user, room) {
		if (!this.can('wall')) return this.reply("``%`` required to use this command!");
		if (!arg) return this.reply("Help: ``" + this.cmdToken + "pikapika [player], [position], [level]``");

		let params = arg.split(",");
		if (params.length < 3) return this.reply("Help: ``" + this.cmdToken + "pikapika [player], [position], [level]``");

		let player = toId(params[0]);
		let position = Number(params[1]);
		let raisedTo = Number(params[2]);
		if (!playerExists(player)) return this.reply(player + " doesn't exist, register them with ``" + this.cmdToken + "pikareg [player]``");
		if (!Number.isInteger(position) || !Number.isInteger(raisedTo)) return this.reply("The [position] and [level] values must be positive integers!");
		if (position < 1 || position > 12) return this.reply("The position value must be in between ``1-12``");
		if (raisedTo < 1 || raisedTo > 100) return this.reply("The level range is ``1-100``");

		position -= 1;

		let team = Db('pika').get([player, "team"]);
		if (!team.length) return this.reply(`${player} has no pokémons`);
		if (team.length < position) return this.reply("No pokémon found at that position");

		let pokemon = Object.keys(team[position])[0];
		let level = team[position][pokemon].level;
		if (level === raisedTo) return this.reply(pokemon + " is already ``Lv. " + level + "``!");

		team[position][pokemon].level = raisedTo;
		Db('pika').set([player, "team"], team);

		return this.reply(player + "'s " + pokemon + "'s level: ``" + level + " -> " + raisedTo + "``");
	},

	pikaremove: function (arg, user, room) {
		if (!this.can('wall')) return this.reply("``%`` required to use this command!");
		if (!arg) return this.reply("Help: ``" + this.cmdToken + "pikaremove [player], [position]``");

		let params = arg.split(",");
		if (params.length < 2) return this.reply("Help: ``" + this.cmdToken + "pikaremove [player], [position]``");

		let player = toId(params[0]);
		let position = Number(params[1]);
		if (!playerExists(player)) return this.reply(player + " doesn't exist, register them with ``" + this.cmdToken + "pikareg [player]``");
		if (!Number.isInteger(position)) return this.reply("The [position] value must be a positive integer!");
		if (position < 1 || position > 12) return this.reply("The position value must be in between ``1-12``");

		position -= 1;

		let team = Db('pika').get([player, "team"]);
		if (!team.length) return this.reply(`${player} has no pokémons`);
		if (team.length < position) return this.reply("No pokémon found at that position");

		let pokemon = Object.keys(team[position])[0];

		team.splice(position, 1);
		Db('pika').set([player, "team"], team);

		return this.reply(player + "'s " + pokemon + " was removed from the team");
	},

	pikaup: function (arg, user, room) {
		if (!this.isExcepted) return;
		if (!arg) return this.reply("Help: ``" + this.cmdToken + "pikaup [player], [level]``");

		let params = arg.split(",");
		if (params.length < 2) return this.reply("Help: ``" + this.cmdToken + "pikaup [player], [level]``");

		let player = toId(params[0]);
		let level = Number(params[1]);
		if (!playerExists(player)) return this.reply(player + " doesn't exist, register them with ``" + this.cmdToken + "pikareg [player]``");
		if (!Number.isInteger(level)) return this.reply("The [level] value must be positive integers!");
		
		let currLevel = Db('pika').get([player, "level"]);
		if (level < 1 || level > 100) return this.reply("The level range is ``0-100``!");

		Db('pika').set([player, "level"], level);

		return this.reply(player + "'s level: ``" + currLevel + " -> " + level + "``");
	},

	pikaxp: function (arg, user, room) {
		if (!this.can('wall')) return this.reply("``%`` required to use this command!");
		if (!arg) return this.reply("Help: ``" + this.cmdToken + "pikaup [player], [exp]``");

		let params = arg.split(",");
		if (params.length < 2) return this.reply("Help: ``" + this.cmdToken + "pikaup [player], [exp]``");

		let player = toId(params[0]);
		let level = Db('pika').get([player, "level"]);
		let exp = Number(params[1]);
		if (!playerExists(player)) return this.reply(player + " doesn't exist, register them with ``" + this.cmdToken + "pikareg [player]``");
		if (!Number.isInteger(exp)) return this.reply("The [exp] value must be positive integers!");
		if (exp < 1) return this.reply("The [exp] value can not be less than 1");

		setEXP(player, exp);

		let currLevel = Db('pika').get([player, "level"]);
		let playerEXP = Db('pika').get([player, "exp"]);
		
		if (currLevel == 1 && level == 0) this.reply('Rewards for leveling up: Rare Candies: +2, Max level: 10 -> 20 ');
		return this.reply(player + "'s level: ``" + level + " -> " + currLevel + "`` | EXP: ``" + playerEXP + "``");
	},
	pikamoney: function (arg, user, room) {
		if (!this.can('wall')) return this.reply("``%`` required to use this command!");
		if (!arg) return this.reply("Help: ``" + this.cmdToken + "pikamoney [player], [money]``");

		let params = arg.split(",");
		if (params.length < 2) return this.reply("Help: ``" + this.cmdToken + "pikamoney [player], [money]``");

		let player = toId(params[0]);
		let money = Number(params[1]);
		if (!playerExists(player)) return this.reply(player + " doesn't exist, register them with ``" + this.cmdToken + "pikareg [player]``");
		if (!Number.isInteger(money)) return this.reply("The [money] value must be positive integers!");

		setMoney(player, money);

		let playerMoney = Db('pika').get([player, "money"]);

		return this.reply(player + "'s money: ``" + playerMoney + "``");
	},
	pikaquests: function (arg, user, room) {
		if (!this.can('wall')) return this.reply("``%`` required to use this command!");
		if (!arg) return this.reply("Help: ``" + this.cmdToken + "pikaquests [player], [quests]``");

		let params = arg.split(",");
		if (params.length < 2) return this.reply("Help: ``" + this.cmdToken + "pikaquests [player], [quests]``");

		let player = toId(params[0]);
		let quests = Number(params[1]);
		if (!playerExists(player)) return this.reply(player + " doesn't exist, register them with ``" + this.cmdToken + "pikareg [player]``");
		if (!Number.isInteger(quests)) return this.reply("The [quests] value must be positive integers!");

		setQuests(player, quests);

		let playerQuests = Db('pika').get([player, "quests"]);

		return this.reply(player + "'s quests: ``" + playerQuests + "``");
	},
	pikaquestreward: function (arg, user, room) {
		if (!this.can('wall')) return this.reply("``%`` required to use this command!");
		if (!arg) return this.reply("Help: ``" + this.cmdToken + "pikaquests [player], [quests]``");

		let params = arg.split(",");
		if (params.length < 2) return this.reply("Help: ``" + this.cmdToken + "pikaquests [player], [quests]``");

		let player = toId(params[0]);
		let quest = Number(params[1]);
		
		let playerQuests = Db('pika').get([nick, "quests"]);
		
		if (quest == 1){
			if (playerQuests == 0){
			setQuests(player, 1);
			setEXP(player, 3);
			let currLevel = Db('pika').get([player, "level"]);
			let playerEXP = Db('pika').get([player, "exp"]);
		
			if (currLevel == 1 && level == 0) this.reply('Rewards for leveling up: Rare Candies: +2, Max level: 10 -> 20 ');
			return this.reply(player + "'s level: ``" + level + " -> " + currLevel + "`` | EXP: ``" + playerEXP + "``");
			setMoney(player, 6);
			this.reply("Rewards for completing mision 1: 3 exp + 6 coins");
			} else {
				setMoney(player, 1);
				this.reply("Rewards for repeating mision 1: 1 coins");
			}
		}
	},
	pikabuy: function (arg, user, room) {
		if (!this.can('wall')) return this.reply("``%`` required to use this command!");
		if (!arg) return this.reply("Help: ``" + this.cmdToken + "pikabuy [packId]``");


		let packId = arg;
		let player = toId(user);
		if (!playerExists(player)) return this.reply(player + " doesn't exist, register them with ``" + this.cmdToken + "pikareg [player]``");

		let playerMoney = Db('pika').get([player, "money"]);
		if (packId == "i1"){ 
			if (playerMoney < 10) return this.reply("You dont have enough money to buy this pack");
			setMoney(player, -10);
			let prize = Math.floor((Math.random() * 100));
			if (prize < 21) return this.reply(player + "You got a Leftovers!");
			if (prize < 41) return this.reply(player + "You got a Sitrus Berry!");
			if (prize < 54) return this.reply(player + "You got a Silk Scarf!");
			if (prize < 67) return this.reply(player + "You got a Wide Lens!");
			if (prize < 80) return this.reply(player + "You got a Muscle Band!");
			if (prize < 91) return this.reply(player + "You got a Scope Lens!");
			if (prize < 101) return this.reply(player + "You got a Magnet!");
            }
		if (packId == "p1"){ 
			if (playerMoney < 30) return this.reply("You dont have enough money to buy this pack");
			setMoney(player, -30);
			let prize = Math.floor((Math.random() * 100));
			let pokemon = "pichu";
			if (prize < 41){ 
				let level = 10;
				populateTeam(player, pokemon, level);
				return this.reply(player + " caught a Lv.: ``" + level + "`` ``" + pokemon + "``!");
			}
			if (prize < 76){ 
				let level = 15;
				populateTeam(player, pokemon, level);
				return this.reply(player + " caught a Lv.: ``" + level + "`` ``" + pokemon + "``!");
			}
			if (prize < 101){ 
				let level = 20;
				populateTeam(player, pokemon, level);
				return this.reply(player + " caught a Lv.: ``" + level + "`` ``" + pokemon + "``!");
			}
            }

		return this.reply("That is not a valid Id");
	},

	pikaprofile: function (arg, user, room) {
		if (!this.can('wall')) return this.reply("``%`` required to use this command!");
		if (!arg) return this.reply("Help: ``" + this.cmdToken + "pikaprofile [player]``");

		let player = toId(arg);
		if (!playerExists(player)) return this.reply(player + " doesn't exist, register them with ``" + this.cmdToken + "pikareg [player]``");
		
		return this.reply("/addhtmlbox " + createProfile(player));
	},
};
