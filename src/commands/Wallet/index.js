import withdraw from './withdraw'
import balance from './balance'
import addresses from './addresses'

// An array of all the supported commands
const COMMANDS = [ balance , withdraw, addresses]

export default function(vorpal, options){
	// For each Command in the COMMANDS array
	for (let command of COMMANDS){
		command(vorpal, options)
	}
}