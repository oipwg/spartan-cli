import withdraw from './withdraw'
import balance from './balance'

// An array of all the supported commands
const COMMANDS = [ balance , withdraw ]

export default function(vorpal, options){
	// For each Command in the COMMANDS array
	for (let command of COMMANDS){
		command(vorpal, options)
	}
}