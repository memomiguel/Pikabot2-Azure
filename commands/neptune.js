exports.commands = {
	setseason: function (arg, user, room) {
 	   if (room !== "neptune") return this.reply("something wrong here");
 	   if (!this.isRoomRanked(room, '&')) return this.reply("``&`` required to use this command!");
 	   if (!arg) return this.reply("Help: ``" + this.cmdToken + "setseason [message]``");
 	   Db('message').set("news", arg);
 	   this.reply("Season message was succesfully set to: " + arg);
 	 },
 	 season: function (arg, user, room){
	   if (!this.can('info')) return;
 	   if (room !== "neptune") return;
 	   let display = Db('message').get("news");
 	   this.reply(display);
    	},
	tourprize: function (arg, user, room) {
	   if (room !== "pikachuvalley") return this.reply("Atlantis exclusive command");
 	   if (!this.isRoomRanked(room, '&')) return this.reply("``&`` required to use this command!");
 	   if (!arg) return this.reply("Help: ``" + this.cmdToken + "tourprize [1st], [2nd]");
	   let params = arg.split(",");
	   if (params.length > 2 || params.length < 2 ) return this.reply("Help: ``" + this.cmdToken + "tourprize [1st], [2nd]``");
		let prize1 = toId(params[0]);
		let prize2 = toId(params[1]);
		var prz1 = parseFloat(prize1).toFixed(0);
		var prz2 = parseFloat(prize2).toFixed(0);
      if (prz1 == 'NaN' || prz2 == 'NaN') return this.reply('Error: The Argument must be a number!');
      if (prz1 < 0 || prz2 < 0) return this.reply('Error: The Argument cant be a negative number!');
      if (prz1 > 0 || prz2 > 0) this.reply("/tour prizemoney " + prz1 + ", " + prz2);
	},
};
