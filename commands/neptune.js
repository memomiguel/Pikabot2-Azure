'use strict';

exports.commands = {
  setseason: function (arg, user, room) {
    if (room !== "neptune" || "pikachuvalley") return this.reply("something wrong here");
    if (!this.can('pikareg')) return this.reply("``&`` required to use this command!");
    if (!arg) return this.reply("Help: ``" + this.cmdToken + "setseason [message]``");
    Db('message').set(news, arg);
    this.reply("Season message was succesfully set to: " + arg);
    },
  season: function (arg, user, room){
    if (room !== "neptune" || "pikachuvalley") return;
    let display = Db('message').get(news);
    if (!display) return this.reply("Nothing set now, use ``-setseason [message]`` to set a message");
    this.reply(display);
    },
};
