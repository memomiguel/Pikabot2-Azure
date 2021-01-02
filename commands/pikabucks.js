'use strict';


let createPlayer = (nick) => {
	let playerInfo = {
		money: 0,
		url: "",
	};

	Db('pikacoins').set(nick, playerInfo);
};


let setMoney = (nick, money) => {
	let userMoney = Db('pikacoins').get([nick, "money"]);
	userMoney += money;
	Db('pikacoins').set([nick, "money"], userMoney);
};

let setUrl = (nick, url) => {
	Db('pikacoins').set([nick, "url"], url);
};

let playerExists = (nick) => {
	return Db('pikacoins').has(nick);
};

let createProfile = (nick) => {
	let money = Db('pikacoins').get([nick, "money"]);
	let url = Db('pikacoins').get([nick, "url"]);

	let display = `<div style="padding: 5px; max-height: 200px; overflow-y: auto; background: url('` + url +`'); background-size: cover; color: white; background-color: black"><div style="max-height: 80px; overflow-y: auto; float: right; padding: 5px; background: #DDD; border: 1px solid #AAA; border-radius: 5px;">`;


	display += `</div><img style="float: left; paddingRight: 5px;" src="https://i.imgur.com/MjyGP89.png" width="40" height="40" /><strong>Player:&nbsp;</strong>${nick}<br /><strong>PikaCoins:&nbsp;</strong><img src="https://cdn.bulbagarden.net/upload/8/8c/Pok%C3%A9monDollar.png" width="7" height="14" />&nbsp;${money}<br /></div>`;

	return display;
};

let  visualiseLadder = (id) => {
            return new Promise((resolve, reject) => {
                let lowestScore = Infinity;
                let lastPlacement = 1;
                
                let data = Object.assign(Db('pikacoins').get([id, "money"]) || {});
                let result = Object.keys(data)
                    .sort((a, b) => data[b] - data[a])
                    .map((u, i) => {
                        let d = data[u];
                        if (d !== lowestScore) {
                            lowestScore = d;
                            lastPlacement = i + 1;
                        }
                        
                        return {
                            place: lastPlacement,
                            id: u,
                            score: d,
                        };
                    }).find(u => u.id === id);
                if (!result) return;
            });
        };


exports.commands = {
	reg: function (arg, user, room) {
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

		Db('pikacoins').delete(player);

		return this.reply(`${player} has been deregistered`);
	},

	pikacleanse: function (arg, user, room) {
		if (!this.isExcepted) return;

		let db = Db('pikacoins').object();
		let players = Object.keys(db);

		for (let i = 0, len = players.length; i < len; i++) {
			Db('pikacoins').delete(players[i]);
		}

		return this.reply("The database has been cleansed!");
	},

	

	give: function (arg, user, room) {
		if (!this.can('tournament')) return;
		if (!arg) return this.reply("Help: ``" + this.cmdToken + "give [player], [money]``");
		if(room !== "pikachuvalley") return;

		let params = arg.split(",");
		if (params.length < 2) return this.reply("Help: ``" + this.cmdToken + "give [player], [money]``");

		let player = toId(params[0]);
		let money = Number(params[1]);
		if (!playerExists(player)) createPlayer(player);
		if (!Number.isInteger(money)) return this.reply("The [money] value must be positive integers!");

		setMoney(player, money);

		let playerMoney = Db('pikacoins').get([player, "money"]);

		this.reply("/mn " + user + " has given " + money + " to " + player);
		return this.reply(player + " has been awarded ``" + money + "`` PikaCoins");
	},
	remove: function (arg, user, room) {
		if (!this.can('tournament')) return;
		if (!arg) return this.reply("Help: ``" + this.cmdToken + "give [player], [money]``");
		if(room !== "pikachuvalley") return;

		let params = arg.split(",");
		if (params.length < 2) return this.reply("Help: ``" + this.cmdToken + "give [player], [money]``");
		
		let player = toId(params[0]);
		let money = Number(params[1]);
		if (!Number.isInteger(money)) return this.reply("The [money] value must be positive integers!");
		money = 0 - money;

		setMoney(player, money);

		let playerMoney = Db('pikacoins').get([player, "money"]);

		this.reply("/mn " + user + " has given " + money + " to " + player);
		return this.reply(player + " has lost ``" + money + "`` PikaCoins");
	},
	rank: function (arg, user, room) {
		if (!this.can('tournament')) return;
		if (!arg) return this.reply("Help: ``" + this.cmdToken + "rank [player]``");
		if(room !== "pikachuvalley") return;

		
		let id = toId(arg);

	},
	
	setbackground: function (arg, user, room) {
		if (!this.can('tournament')) return;
		if (!arg) return this.reply("Help: ``" + this.cmdToken + "setbackground [player], [url]``");
		if(room !== "pikachuvalley") return;

		let params = arg.split(",");
		if (params.length < 2) return this.reply("Help: ``" + this.cmdToken + "setbackground [player], [url]``");
		
		let player = toId(params[0]);
		let url = params[1];

		setUrl(player, url);

		return this.reply("Background for ``" + player + "`` succesfully set");
	},

	buy: function (arg, user, room) {
		if (!this.can('info')) return;
		if (!arg) return;
		if(room !== "pikachuvalley") return;

		let params = arg.split(",");

		let packId = toId(params[0]);
		let player = toId(user);
		if (!playerExists(player)) return;

		let playerMoney = Db('pikacoins').get([player, "money"]);
		if (packId == "buck"){ 
			if (playerMoney < 20) return this.reply("You dont have enough PikaCoins! (Cost: 20)");
			setMoney(player, -20);
			this.reply("/transfer " + player + ", 1")
			this.reply("/mn " + player + " has pucharsed a buck");
			return this.reply(player + " You have exchanged 20 PikaCoins for 1 buck!") 
            }
		if (packId == "pick"){ 
			if (playerMoney < 5) return this.reply("You dont have enough PikaCoins! (Cost: 5)");
			setMoney(player, -5);
			this.reply("/mn " + player + " has pucharsed a pick");
			return this.reply(player + " has pucharsed a game pick!")
            }
		if (packId == "pokepick"){ 
			if (playerMoney < 20) return this.reply("You dont have enough PikaCoins! (Cost: 20)");
			setMoney(player, -20);
			this.reply("/modlog " + player + " has pucharsed a pokepick");
			return this.reply(player + " has pucharsed a game monopoke pick!") 
            }
		if (packId == "pet"){ 
			if (playerMoney < 50) return this.reply("You dont have enough PikaCoins! (Cost: 50)");
			setMoney(player, -50);
			this.reply("/mn " + player + " has pucharsed a pet");
			return this.reply(player + " has pucharsed a Pet!")
            }
		if (packId == "pikapet"){ 
			if (playerMoney < 70) return this.reply("You dont have enough PikaCoins! (Cost: 70)");
			setMoney(player, -70);
			this.reply("/mn " + player + " has pucharsed a pikapet");
			return this.reply(player + " has pucharsed a Pichu/Pikachu Pet!") 
            }
		if (packId == "buckbundle"){ 
			if (playerMoney < 100) return this.reply("You dont have enough PikaCoins! (Cost: 100)");
			setMoney(player, -100);
			this.reply("/transfer " + player + ", 8")
			this.reply("/mn " + player + " has pucharsed a buckbundle");
			return this.reply(player + " You have exchanged 100 PikaCoins for 8 bucks!") 
            }
		if (packId == "jp"){ 
			if (playerMoney < 100) return this.reply("You dont have enough PikaCoins! (Cost: 100)");
			setMoney(player, -100);
			this.reply("/mn " + player + " has pucharsed a Joinphrase! ");
			return this.reply(player + " You have exchanged 100 PikaCoins for a Joinphrase! (Owner must set it up)") 
            }
		if (packId == "background"){ 
			if (playerMoney < 30) return this.reply("You dont have enough PikaCoins! (Cost: 30)");
			setMoney(player, -30);
			let url = params[1];
			setUrl(player, url);
			this.reply("/mn " + player + " has pucharsed a background");
			return this.reply(player + " You have exchanged 30 PikaCoins for a Wallet Background!") 
            }
		if (packId == "azuremon"){ 
			if (playerMoney < 250) return this.reply("You dont have enough PikaCoins! (Cost: 250)");
			setMoney(player, -250);
			return this.reply(player + " has pucharsed an Azuremon!") 
            }

		return;
	},

	pikacoins: function (arg, user, room) {
		if (!this.can('info')) return;
		if (!arg) arg = user;
		if(room !== "pikachuvalley") return;

		let player = toId(arg);
		if (!playerExists(player)) createPlayer(player);
		
		return this.reply("/addhtmlbox " + createProfile(player));
	},
	shop: function (arg, user, room) {
		if (!this.can('info')) return;
		if(room !== "pikachuvalley") return;
		
		return this.reply('/addhtmlbox <div><table style="width:100%; border: 1px solid black;"><tr><td style="width:15%">Buck</td><td style="width:75%">Exchanges 20 PikaCoins for 1 Buck</td><td style="width:10%"><button name="send" value="-buy buck">Buy</button></td></tr><tr><td style="width:15%">Pick Game</td><td style="width:75%">Pick the next game we will do! 5 PikaCoins</td><td style="width:10%"><button name="send" value="-buy pick">Buy</button></td></tr><tr><td style="width:15%">Monopoke Pick</td><td style="width:75%">Pick the pokemon that will be used on a monopoke tournament! 20 PikaCoins</td><td style="width:10%"><button name="send" value="-buy pokepick">Buy</button></td></tr><tr><td style="width:15%">Wallet Background</td><td style="width:75%">Exchanges 30 PikaCoins to add a custom background to your PikaCoins wallet and show off your wealth with style!</td><td style="width:10%"><button name="send" value="/htmlbox <div><b>To buy a background, use -buy background [url]</b></div>">Buy</button></td></tr><tr><td style="width:15%">PSGO Card</td><td style="width:75%">Buys a PSGO card from memomiguels or AlolaAsh collection! Price equals in PikaCoins 3 times the card value, memomiguels unique card is not for sale yet</td><td style="width:10%">Ask in chat</td></tr><tr><td style="width:15%">Pet</td><td style="width:75%">Exchanges 50 PikaCoins for 1 Pet from memomiguels showcase! memomiguel has over 1000 pets so not all will be shown in showcase, ask him if he has an specific pet</td><td style="width:10%"><button name="send" value="-buy pet">Buy</button></td></tr><tr><td style="width:15%">Chu Pet</td><td style="width:75%">Exchanges 70 PikaCoins for 1 Pichu or Pikachu pet from memomiguel</td><td style="width:10%"><button name="send" value="-buy pikapet">Buy</button></td></tr><tr><td style="width:15%">Buck Bundle</td><td style="width:75%">Exchanges 100 PikaCoins for 8 Bucks</td><td style="width:10%"><button name="send" value="-buy buckbundle">Buy</button></td></tr><tr><td style="width:15%">Joinphrase</td><td style="width:75%">Exchanges 100 PikaCoins for a Joinphrase</td><td style="width:10%"><button name="send" value="-buy jp">Buy</button></td></tr></table></div>');
	},
	info21: function (arg, user, room) {
		if (!this.can('wall')) return;
		if(room !== "pikachuvalley") return;
		
	return this.reply('/addhtmlbox <div style="border: solid 3px Black; width: 90%;"><div style="background-color: Black; background-position: center; border: solid 2px White; color: white"><b>21 Questions!</b><br><p>The host will think of a Pokemon, item or move and the players will make questions to guess what the host was thinking!</p><p>-Players must ask questions in order, order given by the host</p><p>-If you are sure you know the answer, you may attempt to guess the answer outside of your turn, however if you are incorrect, you will be disqualified</p><p>-Players cannot ask questions with "and""or" or other way to get multiple information on the same question</p><p>-If 21 questions are reached, guessing out of your turn is not allowed and everyone must guess in order, getting disqualified one by one if they are wrong</div></div>');
	},
};
