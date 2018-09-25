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
			// this.log(vorpal.chalk.green(`You chose ${vorpal.chalk.yellow(coin.option)}. Nice choice!`));



		})
}