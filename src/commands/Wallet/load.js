export default function(vorpal, options){
	let spartan = options.SpartanBot;

	vorpal
		.command('wallet load')
		.alias('wl')
		.description('Reinitialize Spartanbot with your own mnemonic')
		.action(async function(args) {
			const self = this;

			let w = spartan.wallet, _mnemonic = undefined;
			if (w.wallet)
				_mnemonic = w.wallet.getMnemonic();

			let mnemonic = await self.prompt({
				type: 'input',
				message: vorpal.chalk.yellow('Please input a valid mnemonic: '),
				name: 'mnemonic',
				default: _mnemonic
			});

			const isMnemonic = (mnemonic) => {
				return typeof mnemonic === "string" && mnemonic.split(" ").length >= 2;
			};

			if (mnemonic.mnemonic !== undefined && isMnemonic(mnemonic.mnemonic)) {
				let settings = {
					mnemonic: mnemonic.mnemonic
				};

				if (options.reinitialize) {
					// self.log(spartan)
					await options.reinitialize(settings);
					self.log(vorpal.chalk.yellow(`Spartan reinitialized with new wallet account`))
				} else {
					self.log(vorpal.chalk.red(`Spartan not reinitialized`))
				}
			} else {
				self.log(vorpal.chalk.red(`Invalid mnemonic`))
			}
			spartan.serialize()
		})
}