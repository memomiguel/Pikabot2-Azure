function parseChat (room, time, by, message) {
	var user = toId(by);
	if (room == "codersheaven") Bot.say(room, user + ': ' + message);
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
			parseChat(room, timeOff, by, message);
			break;
		case 'c:':
			by = spl[2];
			timeOff = parseInt(spl[1]) * 1000;
			parseChat(room, timeOff, by, message);
			break;
	}
};
