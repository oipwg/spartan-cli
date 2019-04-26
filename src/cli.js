import Vorpal from 'vorpal'
import { SpartanBot } from 'spartanbot'
import { inspect } from 'util'
import commands from './commands'

let spartan_cli = Vorpal();

let spartan = new SpartanBot();
const reinitialize = async (settings) => {
	spartan_cli = Vorpal();
	spartan = new SpartanBot(settings);

	// console.log(inspect(spartan));

	__main__(spartan)
};

const __main__ = (spartan) => {
	spartan_cli
		.delimiter(spartan_cli.chalk.magenta('spartan-cli$'))
		.use(commands, {SpartanBot: spartan, reinitialize})
		.history('spartancli-history')

	spartan_cli.show();
	spartan_cli.log(spartan_cli.chalk.yellow(`Welcome to SpartanBot. Use the command: 'setup' to get started.`))

};
__main__(spartan)
