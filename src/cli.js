import Vorpal from 'vorpal'
import { SpartanBot } from 'spartanbot'
import { inspect } from 'util'
import commands from './commands'


let spartan_cli = Vorpal();

let spartan = new SpartanBot();
const reinitialize = async (settings) => {
	spartan_cli = Vorpal();
	spartan = new SpartanBot(settings);
	// await spartan._deserialize
	// console.log(inspect(spartan))

	__main__(spartan)
};

const __main__ = (spartan) => {
	spartan_cli
		.delimiter(spartan_cli.chalk.magenta('spartan-cli$'))
		.use(commands, {SpartanBot: spartan, reinitialize})
		.history('spartancli-history');

	spartan_cli.show();
};
__main__(spartan);