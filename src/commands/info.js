import { inspect } from 'util'

export default function(vorpal, options){
	let spartan = options.SpartanBot;

	vorpal
		.command('spartan info')
		.alias('si')
		.description('Show the JSON structure of the current SpartanBot')
		.action(async function(args) {
			const self = this;
			//ToDo: Make sure spartan is up to date
			self.log(vorpal.chalk.yellow(inspect(spartan)))

	})
}