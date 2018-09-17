import Vorpal from 'vorpal'
import { SpartanBot } from 'spartanbot'
import commands from './commands'

let spartan_cli = Vorpal()

let spartan = new SpartanBot();

spartan_cli
	.delimiter('spartan-cli$')
	.use(commands, {SpartanBot: spartan})
	 
spartan_cli.show()