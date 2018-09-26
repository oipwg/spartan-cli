import { inspect } from 'util'

export default function(vorpal, options){
	let spartan = options.SpartanBot;

	vorpal
		.command('wallet info')
		.alias('wi')
		.description('Get information about your current wallet')
		.action(async function(args) {
			const self = this;
			// self.log(spartan)
			this.log(vorpal.chalk.yellow("\nWallet Info"));
			let w;
			if (spartan.wallet && spartan.wallet.wallet) {
				w = spartan.wallet.wallet;
			} else {w = undefined}
			if (!w) {
				self.log(vorpal.chalk.red('No wallet found!\nSpartan: ', spartan));
				return
			}
			let wallet_props = await self.prompt({
				type: 'list',
				name: 'option',
				message: vorpal.chalk.yellow('Pick a property to get more info on it'),
				choices: ['mnemonic', 'entropy', 'seed', 'networks', 'supported coins', 'coins', 'discover']
			});

			switch (wallet_props.option) {
				case 'mnemonic':
					self.log(vorpal.chalk.white(`Mnemonic: ${w.getMnemonic()}`));
					break;
				case 'entropy':
					self.log(vorpal.chalk.white(`Entropy: ${w.getEntropy()}`));
					break;
				case 'seed':
					self.log(vorpal.chalk.white(`Seed: ${w.getSeed()}`));
					break;
				case 'networks':
					let coin_network = await self.prompt({
						type: 'list',
						name: 'option',
						message: vorpal.chalk.yellow('Which coin network would you like to get info on?'),
						choices: Object.keys(w.getCoins())
					});

					self.log(vorpal.chalk.white(`${coin_network.option}: ${inspect(w.networks[coin_network.option])}`));

					break;
				case 'supported coins':
					self.log(vorpal.chalk.white(`Supported coins: ${w.supported_coins}`));
					break;
				case 'coins':
					let coin = await self.prompt({
						type: 'list',
						name: 'option',
						message: vorpal.chalk.yellow('Which coin would you like to get info on?'),
						choices: Object.keys(w.getCoins())
					});

					self.log(vorpal.chalk.white(`${coin.option}: ${inspect(w.getCoins()[coin.option].getCoinInfo())}`));

					break;
				case 'discover':
					self.log(vorpal.chalk.white(`Discover is set to: ${w.discover}`));
					break;
				default:
					self.log(vorpal.chalk.red('No options chosen!'))
			}
		})
}