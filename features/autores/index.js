'use strict';

exports.id = 'autoresp';
exports.desc = '';

exports.init = () => {};
exports.parse = (room, message, isIntro, spl) => {
	if (isIntro || room !== "izukuslair" || spl[0] !== "c:") return;
	
	let user = spl[2];
	if (spl[3].includes("hello" && "pikabot")) Bot.say(room, `Hey there ${toId(user)}!`);
};
