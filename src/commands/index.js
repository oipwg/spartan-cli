// Import each command
import Rent from './rent'
import RentalProvider from './RentalProvider'
import Settings from './Settings'

// An array of all the supported commands
const COMMANDS = [ Rent, RentalProvider, Settings ]

export default function(vorpal, options){
	// For each Command in the COMMANDS array
	for (let command of COMMANDS){
		command(vorpal, options)
	}
}