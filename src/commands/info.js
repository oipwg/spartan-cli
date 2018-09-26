import { inspect } from 'util'

export default function(vorpal, options){
	let spartan = options.SpartanBot;

	vorpal
		.command('spartan info')
		.alias('si')
		.description('Reinitialize Spartanbot with your own mnemonic')
		.action(async function(args) {
			const self = this;
			self.log(vorpal.chalk.yellow(inspect(spartan)))

	})
}