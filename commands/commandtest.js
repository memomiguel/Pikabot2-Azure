
exports.commands = {
    monothreat: function(target, room, user) {
        if (!this.can("info")) return false;
        let types = ['Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water'];
        let randType = types[~~(Math.random() * types.length)];
	this.reply('/etour gen8monotype');
        this.reply('/tour scouting off');
	this.reply('/tour autodq 2');
	this.reply('/tour name Monothreat ' + randType);
        this.reply('/wall This is a ' + randType + ' monothreat tournament, bring ' + randType + ' or be disqualified!');
    	},
     monotype: function (arg, room, user) {
        if (!this.can("info")) return;
	if (arg == "1") this.reply('/etour gen1monotype');
	if (arg == "2") this.reply('/etour gen2monotype');
	if (arg == "3") this.reply('/etour gen3monotype');
	if (arg == "4") this.reply('/etour gen4monotype');
	if (arg == "5") this.reply('/etour gen5monotype');
	if (arg == "6") this.reply('/etour gen6monotype');
	if (arg == "7") this.reply('/etour gen7monotype');
	if (arg == "8") this.reply('/etour gen8monotype');
	if (!arg) this.reply('/etour gen8monotype');
	this.reply('/tour autodq 2');
     },
     test2: function (arg, user, room) {
        if (!this.can("info")) return this.reply('lol you cant use this command');

	this.reply('/me does a test');
	},
     test3: function (arg, by, room, cmd) {
        if (!this.can("info")) return this.reply('lol you cant use this command');
		this.say('rockethq', 'A tournament was made in <<' + room + '>>');
	this.reply('/me does a test');
	},
     r: 'runtour',
         runtour: function (arg, user, room) {
      if (!this.can('info')) return;
      var atimer = parseFloat(arg).toFixed(1);
      if (atimer == 'NaN') return this.reply('Error: The Argument must be a number!');
      if (atimer > 10) return this.reply('Error: The Argument is to high!');
      if (atimer < 0) return this.reply('Error: The Argument cant be a negative number!');
      if (atimer <= 0) this.reply('The Tournament will be starting __right now__');
      if (atimer > 0) this.reply("The Tournament will be starting in " + atimer + " minutes");
      let time = atimer * 1000 * 60; // minutes
      let self = this;

      setTimeout(() => {
        self.reply(`/tour start`); 
        self.reply("/tour autodq 2");
        self.reply("/tour remind");
	self.reply('/mn ' + user + ' Started a tournament.');
      }, time);
     },
     cc1v1: function () {
	if (!this.can("info")) return;
	this.reply('/etour gen8challengecup1v1');
	this.reply('/tour autodq 2');
	},
     assb2: function () {
	if (!this.can("info")) return;
	this.reply('/etour gen7azuresuperstaffbrosii');
	this.reply('/tour autodq 2');
	},
	assb3: function () {
	if (!this.can("info")) return;
	this.reply('/etour gen7azuresuperstaffbrosiii');
	this.reply('/tour autodq 2');
	},
     assb2cc1v1: function () {
	if (!this.can("info")) return;
	this.reply('/etour gen7azuresuperstaffbrosiichallengecup1v1');
	this.reply('/tour autodq 2');
	},
	assb3cc1v1: function () {
	if (!this.can("info")) return;
	this.reply('/etour gen7azuresuperstaffbrosiiichallengecup1v1');
	this.reply('/tour autodq 2');
	},
	assb3doubles: function () {
	if (!this.can("info")) return;
	this.reply('/etour gen7azuresuperstaffbrosiiidoubles');
	this.reply('/tour autodq 2');
	},
     redo: function () {
	if (!this.can("info")) return;
	let prize = Math.floor((Math.random() * 100));
	if (prize < 34) return this.reply("redo");
	if (prize < 101) return this.reply("no");
	},
     randombattle: function (arg, room, user) {
        if (!this.can("info")) return;
	if (arg == "1") this.reply('/etour gen1randombattle');
	if (arg == "2") this.reply('/etour gen2randombattle');
	if (arg == "3") this.reply('/etour gen3randombattle');
	if (arg == "4") this.reply('/etour gen4randombattle');
	if (arg == "5") this.reply('/etour gen5randombattle');
	if (arg == "6") this.reply('/etour gen6randombattle');
	if (arg == "7") this.reply('/etour gen7randombattle');
	if (arg == "8") this.reply('/etour gen8randombattle');
	if (!arg) this.reply('/etour gen8randombattle');
	this.reply('/tour autodq 2');
	},
     randomdoubles: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour Random Doubles Battle');
	this.reply('/tour autodq 2');
	},
     monotyperandom: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour gen8monotyperandombattle');
	this.reply('/tour autodq 2');
	},
     metronomecc1v1: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour gen8metronomechallengecup1v1');
	this.reply('/tour autodq 2');
	},
     spacetimefuntimes: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour Spacetime Funtimes');
	this.reply('/tour autodq 2');
	},
     ou: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour gen8ou');
        this.reply('/tour scouting off');
	this.reply('/tour autodq 2');
	},
     e1v1: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour gen81v1');
        this.reply('/tour scouting off');
	this.reply('/tour autodq 2');
	},
     monotypecc1v1: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour gen8monotypechallengecup1v1');
	this.reply('/tour autodq 2');
	},
     azuremonsrandoms: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour Azuremons Random Battle');
	this.reply('/tour autodq 2');
	},
     azuremonscc1v1: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour Azuremons Challenge Cup 1v1');
	this.reply('/tour autodq 2');
	},
     assb: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour Azure Super Staff Bros.');
	this.reply('/tour autodq 2');
	},
     assbdoubles: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour Azure Super Staff Bros. Doubles');
	this.reply('/tour autodq 2');
	},
     assbcc1v1: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour Azure Super Staff Bros. Challenge Cup 1v1');
	this.reply('/tour autodq 2');
	},
     cc2v2: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour gen8challengecup2v2');
	this.reply('/tour autodq 2');
	},
     randommonocolor: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour gen8randommonocolor');
	this.reply('/tour autodq 2');
	},
     battlefactorybss: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour BSS Factory');
	this.reply('/tour autodq 2');
	},
     battlefactory: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour Battle Factory');
	this.reply('/tour autodq 2');
	},
     metronome: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour gen8metronome');
	this.reply('/tour autodq 2');
	},
     hackmonscup: function (arg, room, user) {
        if (!this.can("info")) return;
	this.reply('/etour Hackmons Cup');
	this.reply('/tour autodq 2');
	},
     
     welcome: function (arg) {
	if (!arg) return;
	if (!this.can("say")) return;
	this.reply('/roompromote ' + arg + ', $')
	this.reply('Welcome ' + arg + ' to the Pikachu Valley!')
     },
     ezjoin: function (arg, user, room) {
	if (!this.can("info")) return;
	this.reply('/tour join');
     },
     ezleave: function (arg, user, room) {
	if (!this.can("say")) return;
	this.reply('/tour leave');
     },

};
