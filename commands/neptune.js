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
};
