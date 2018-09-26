import { inspect } from 'util'

export default function(vorpal, options){
	let spartan = options.SpartanBot;

	vorpal
		.command('wallet load')
		.alias('wl')
		.description('Load the SpartanBot with a new wallet')
		.action(async function(args) {
			const self = this;
			let w;
			if (spartan.wallet && spartan.wallet.wallet) {
				w = spartan.wallet.wallet;
			} else {w = undefined}
			if (!w) {
				self.log(vorpal.chalk.red('No wallet found!\nSpartan: ', spartan));
				return
			}
			self.log(w.mnemonic);
			let settings = {
				mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
			};

			// if (options.reInitialize) {
			// 	options.reInitialize(settings)
			// }
			// self.log(vorpal.chalk.yellow('Spartan Re-Initialized'))
		})

}