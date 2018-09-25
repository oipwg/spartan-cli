export default function(vorpal, options) {
	vorpal
		.command('clear', 'clear the console window')
		.action(function (args,cb) {
			process.stdout.write ("\u001B[2J\u001B[0;0f");
			cb();
		});
}