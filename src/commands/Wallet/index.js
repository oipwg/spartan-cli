import withdraw from './withdraw'
import balence from './balence'

// An array of all the supported commands
const COMMANDS = [ balence , withdraw ]

export default function(vorpal, options){
	// For each Command in the COMMANDS array
	for (let command of COMMANDS){
		command(vorpal, options)
	}
}