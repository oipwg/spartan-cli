// Import each command
import Rent from './rent'

// An array of all the supported commands
const COMMANDS = [ Rent ]

export default function(vorpal, options){
	// For each Command in the COMMANDS array
	for (let command of COMMANDS){
		command(vorpal, options)
	}
}