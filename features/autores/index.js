'use strict';

exports.id = 'autoresp';
exports.desc = '';

exports.init = () => {};
exports.parse = (room, message, isIntro, spl) => {
	if (isIntro) return;
	
	let user = spl[2];
	if (spl[3].includes(“thepikabot” || “ThePika-bot” || “pikabot” || “Pikabot”) || room == user) {
           if (spl[3].includes("hello" || “hi”)) Bot.say(room, ‘Hey there ${toId(user)}!’);
           if (spl[3].includes("when were you born")) Bot.say(room, ‘I was born on Friday, August 17, 2018. Thanks for asking, ${toId(user)}!’);
           if (spl[3].includes("how are you")) Bot.say(room, ‘I am good! Thanks for asking, ${toId(user)}!’);
         }
};
