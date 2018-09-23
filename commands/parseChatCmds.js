function parseChat (room, time, by, message) {
	var user = toId(by);
	if (message == "hi") Bot.say('Hi' + user);
	};

exports.init = function () {
	return;
};

exports.parse = function (room, message, isIntro, spl) {
	if (isIntro) return;
	var by, timeOff;
	switch (spl[0]) {
		case 'c':
			by = spl[1];
			timeOff = Date.now();
			parseChat(room, timeOff, by, message.substr(("|" + spl[0] + "|" + spl[1] + "|").length));
			break;
		case 'c:':
			by = spl[2];
			timeOff = parseInt(spl[1]) * 1000;
			parseChat(room, timeOff, by, message.substr(("|" + spl[0] + "|" + spl[1] + "|" + spl[2] + "|").length));
			break;
	}
};
