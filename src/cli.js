import Vorpal from 'vorpal'
import { SpartanBot } from 'spartanbot'
import commands from './commands'

let spartan_cli = Vorpal()

let spartan = new SpartanBot();

spartan_cli
	.delimiter(spartan_cli.chalk.magenta('spartan-cli$'))
	.use(commands, {SpartanBot: spartan})
	.history('spartancli-history')
	 
spartan_cli.show()