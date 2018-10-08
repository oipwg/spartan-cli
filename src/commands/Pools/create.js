import uid from 'uid'

export default function(vorpal, options){
	let spartan = options.SpartanBot

	vorpal
		.command('pool create')
		.description('Create a pool')
		.alias('pc')
		.action(async function(args) {
			const self = this;
			if (spartan.getRentalProviders().length === 0) {
				return this.log(vorpal.chalk.yellow("No Rental Providers were found! Please run '") + vorpal.chalk.cyan("rentalprovider add") + vorpal.chalk.yellow("' to add your API keys."))
			}

			self.log(vorpal.chalk.yellow(`Enter pool data:`));
			let poolOpts = {}

			let name = await self.prompt({
				type: 'input',
				message: 'Name: ',
				default: uid(),
				name: 'name'
			})
			poolOpts.name = name.name

			let algo = await self.prompt({
				type: 'input',
				message: 'Algo: ',
				default: 'scrypt',
				name: 'algo'
			})
			poolOpts.algo = algo.algo

			let host = await self.prompt({
				type: 'input',
				message: 'Host: ',
				default: 'snowflake.oip.fun',
				name: 'host'
			})
			poolOpts.host = host.host

			let port = await self.prompt({
				type: 'input',
				message: 'Port: ',
				default: 3043,
				name: 'port'
			})
			poolOpts.port = port.port

			let user = await self.prompt({
				type: 'input',
				message: 'User: ',
				default: spartan.wallet.wallet.coins['flo'].getMainAddress().getPublicAddress(),
				name: 'user'
			})
			poolOpts.user = user.user

			let pass = await self.prompt({
				type: 'input',
				message: 'Pass: ',
				default: 'x',
				name: 'pass'
			})
			poolOpts.pass = pass.pass

			let notes = await self.prompt({
				type: 'input',
				message: 'Notes: ',
				default: `Pool created at: ${Date.now()}`,
				name: 'notes'
			})
			poolOpts.notes = notes.notes

			let totalPools = spartan.returnPools().length
			let poolsCreate = await spartan.createPool(poolOpts);

			if ((spartan.returnPools().length === totalPools + 1) && (poolsCreate.length === spartan.getRentalProviders().length)) {
				self.log(`Pool successfully created!`)
			} else {
				self.log(vorpal.chalk.red(`Pool unsuccessfully created. Consider running 'pool list' to see if something went wrong`))
			}

			spartan.serialize()

		});
}