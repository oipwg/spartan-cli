import Vorpal from 'vorpal'
import { SpartanBot } from 'spartanbot'
import commands from './commands'

let spartan_cli = Vorpal();

let spartan = new SpartanBot();
const reInitialize = (settings) => {
	spartan = new SpartanBot(settings);
	__main__(spartan)
};

const __main__ = (spartan) => {
	spartan_cli
		.delimiter(spartan_cli.chalk.magenta('spartan-cli$'))
		.use(commands, {SpartanBot: spartan, reInitialize})
		.history('spartancli-history');

	spartan_cli.show();
};

__main__();