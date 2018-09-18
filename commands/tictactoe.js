	exports.commands = {
		tictactoe: function(arg, user, room){
		let p1 = toId(user);
		this.reply(p1 + 'wants to play a Tic Tac Toe game! use -join to join the game.');
	}
}
