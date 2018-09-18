import list from './list'
import modify from './modify'

// An array of all the supported commands
const COMMANDS = [ list , modify ]

export default function(vorpal, options){
	// For each Command in the COMMANDS array
	for (let command of COMMANDS){
		command(vorpal, options)
	}
}