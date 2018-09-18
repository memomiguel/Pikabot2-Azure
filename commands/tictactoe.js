	function send (room, str) {
	Bot.say(room, str);
	}

	function joinArray (arr, str1) {
	if (!arr.length) return '';
	var txt = "**" + arr[0] + "**";
	if (arr.length > 1) {
		for (var i = 1; i < arr.length - 1; i++) txt += ", **" + arr[i] + "**";
		txt += " " + str1 + " " + "**" + arr[arr.length - 1] + "**";
	}
	return txt;
	}

	function tictactoe(arg, by, room){
		this.reply(user + 'wants to play a Tic Tac Toe game! use -join to join the game.')
		let p1 = user;
	}

	exports.commands = {
	j: 'join',
	"in": 'join',
	join: function (arg, by, room, cmd, game) {
		if (by == p1) return this.reply('You are already in the game!');
		game.userJoin(by);
		let p2 = by;
	}
}
