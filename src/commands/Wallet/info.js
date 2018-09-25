export default function(vorpal, options){
	let spartan = options.SpartanBot;

	vorpal
		.command('wallet info')
		.alias('wi')
		.description('Get information about your current wallet')
		.action(async function(args) {
			const self = this;

			this.log(vorpal.chalk.yellow("\nWallet Info"));
			let w = spartan.wallet.wallet;

			let wallet_props = await self.prompt({
				type: 'list',
				name: 'option',
				message: vorpal.chalk.yellow('Pick a property to get more info on it'),
				choices: ['mnemonic', 'entropy', 'seed', 'networks', 'supported coins', 'coins', 'discover']
			})

			switch (wallet_props.option) {
				case 'mnemonic':
					self.log(vorpal.chalk.green(`Mnemonic: ${w.getMnemonic()}`));
					break;
				case 'entropy':
					self.log(vorpal.chalk.green(`Entropy: ${w.getEntropy()}`));
					break;
				case 'seed':
					self.log(vorpal.chalk.green(`Seed: ${w.getSeed()}`));
					break;
				case 'networks':
				case 'supported coins':
					self.log(vorpal.chalk.green(`Supported coins: ${w.supported_coins}`));
					break;
				case 'coins':
					self.log(vorpal.chalk.green(`Active coins: ${Object.keys(w.getCoins())}`));
					break;
				case 'discover':
					self.log(vorpal.chalk.green(`Discover is set to: ${w.discover}`));
					break;
				default:
					self.log(vorpal.chalk.red('No options chosen!'))
			}


		})
}