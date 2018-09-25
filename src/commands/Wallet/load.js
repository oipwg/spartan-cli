import { inspect } from 'util'

export default function(vorpal, options){
	let spartan = options.SpartanBot;

	vorpal
		.command('wallet load')
		.alias('wl')
		.description('Load the SpartanBot with a new wallet')
		.action(async function(args) {
			const self = this;
			self.log(spartan.wallet.wallet.mnemonic);
			//initialize new spartanbot here with mnemonic
			//options.reinitialize('mnemonic...')
			//self.log(spartan.wallet.wallet.mnemonic)
		})

}