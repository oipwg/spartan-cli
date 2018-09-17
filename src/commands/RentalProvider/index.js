import add from './add'

// An array of all the supported commands
const COMMANDS = [ add ]

export default function(vorpal, options){
	// For each Command in the COMMANDS array
	for (let command of COMMANDS){
		command(vorpal, options)
	}
}