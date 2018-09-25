// Import each command
import Rent from './rent'
import RentalProvider from './RentalProvider'
import Settings from './Settings'
import Wallet from './Wallet'
import Clear from './clear'

// An array of all the supported commands
const COMMANDS = [ Rent, RentalProvider, Settings, Wallet, Clear ]

export default function(vorpal, options){
	// For each Command in the COMMANDS array
	for (let command of COMMANDS){
		command(vorpal, options)
	}
}