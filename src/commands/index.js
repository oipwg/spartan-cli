// Import each command
import Rent from './Rent'
import Pools from './Pools'
import RentalProvider from './RentalProvider'
import Settings from './Settings'
import Wallet from './Wallet'
import Clear from './clear'
import Info from './info'

// An array of all the supported commands
export const COMMANDS = [ Rent, RentalProvider, Settings, Wallet, Clear, Info, Pools ]

export default function(vorpal, options){
	// For each Command in the COMMANDS array
	for (let command of COMMANDS){
		command(vorpal, options)
	}
}
