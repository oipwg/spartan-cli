import withdraw from './withdraw'
import balance from './balance'
import addresses from './addresses'
import info from './info'
import load from './load'

// An array of all the supported commands
const COMMANDS = [ balance , withdraw, addresses, info, load];

export default function(vorpal, options){
	// For each Command in the COMMANDS array
	for (let command of COMMANDS){
		command(vorpal, options)
	}
}