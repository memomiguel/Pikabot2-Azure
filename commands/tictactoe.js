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
exports.commands = {
		tictactoe: function(arg, user, room){
		let p1 = toId(user);
		this.reply(p1 + ' wants to play a Tic Tac Toe game! use -join to join the game.');
	},
	
}
