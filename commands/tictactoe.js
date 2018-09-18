	exports.commands = {
		tictactoe: function(arg, user, room){
		let p1 = toId(user);
		this.reply(user + 'wants to play a Tic Tac Toe game! use -join to join the game.');
	}
}
