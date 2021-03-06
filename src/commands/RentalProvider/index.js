import add from './add/add'
import list from './list'
import delete_ from './delete'

// An array of all the supported commands
const COMMANDS = [ add, list, delete_ ]

export default function(vorpal, options){
	// For each Command in the COMMANDS array
	for (let command of COMMANDS){
		command(vorpal, options)
	}
}