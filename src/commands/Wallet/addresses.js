export default function(vorpal, options){
	let spartan = options.SpartanBot;

	vorpal
		.command('wallet addresses')
		.alias('wa')
		.description('Browse through the BIP44 wallet addresses')
		.action(async function(args) {
			const self = this;

			this.log(vorpal.chalk.yellow("\nWelcome... to Sky's BIP44 HD Multi Wallet"));
			let w = spartan.wallet.wallet;
			let coin_name_array = Object.keys(w.coins)

			let coin = await self.prompt({
				type: 'list',
				name: 'option',
				message: vorpal.chalk.yellow('Choose a Coin!'),
				choices: coin_name_array
			});

			let _Coin = w.coins[coin.option];
			let _mainAddress = _Coin.getMainAddress().getPublicAddress();

			let addressType = await self.prompt({
				type: 'list',
				name: 'option',
				message: vorpal.chalk.yellow('Would you like to get the main address or choose by index?'),
				choices: ['Main Address', 'Index']
			});

			let address_type = addressType.option;
			if (address_type === 'Main Address') {
				this.log(vorpal.chalk.green(`Main Address: ${vorpal.chalk.cyan(_mainAddress)}`));
			}

			if (address_type === "Index") {
				let account_number = await self.prompt({
					type: 'input',
					name: 'index',
					message: vorpal.chalk.yellow('Type the index of the account you want to search on: '),
					default: 0
				});
				let chain_number = await self.prompt({
					type: 'input',
					name: 'index',
					message: vorpal.chalk.yellow('Type the index of the chain you want to search on: '),
					default: 0
				});
				let address_number = await self.prompt({
					type: 'input',
					name: 'index',
					message: vorpal.chalk.yellow('Type the index of the address you want fetch: '),
					default: 0
				});

				let account = account_number.index;
				let chain = chain_number.index;
				let address = address_number.index;

				let _address = _Coin.getAddress(account, chain, address).getPublicAddress()

				self.log(vorpal.chalk.green(`Address: ${_address}`))

			}
			// this.log(vorpal.chalk.green(`You chose ${vorpal.chalk.yellow(coin.option)}. Nice choice!`));

		})
}