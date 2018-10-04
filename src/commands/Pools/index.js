import list from './list'
import create from './create'


// An array of all the supported commands
const COMMANDS = [ list, create ];

export default function(vorpal, options){
	// For each Command in the COMMANDS array
	for (let command of COMMANDS){
		command(vorpal, options)
	}
}