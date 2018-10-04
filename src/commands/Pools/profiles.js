export default function(vorpal, options){
	let spartan = options.SpartanBot

	vorpal
		.command('pool profiles')
		.description('Manage your MiningRigRentals pool profiles')
		.alias('pp')
		.action(async function(args) {
			const self = this;
			if (spartan.getRentalProviders().length === 0) {
				self.log(vorpal.chalk.red(`No rental providers found! Consider adding one by typing: rentalprovider add`));
				return;
			}
			await spartan._deserialize
			self.log(vorpal.chalk.yellow('Manage pool profiles for your MiningRigRental providers: '))
			let mrrProviders = []
			for (let p of spartan.getRentalProviders()) {
				if (p.getInternalType() === "MiningRigRentals")
					mrrProviders.push(p)
			}

			let providerArray = []
			let providerObject = {}
			for (let p of mrrProviders) {
				let fmtProv = `${vorpal.chalk.yellow(p.getInternalType())}: ${vorpal.chalk.white(`${p.getName()}|`)}${vorpal.chalk.yellow(`${p.getUID()}`)} ${vorpal.chalk.white(`API Key|${vorpal.chalk.yellow(p.api_key.substr(0,8))}`)}`
				providerArray.push(fmtProv)
				providerObject[fmtProv] = p.getUID()
			}

			let providerPrompt = await self.prompt({
				type: 'list',
				message: 'Choose a provider: ',
				name: 'provider',
				choices: [...providerArray, 'exit/return']
			})
			let selection = providerPrompt.provider
			let uid = providerObject[selection]
			let _prov;
			for (let p of spartan.getRentalProviders()) {
				if (p.getUID() === uid)
					_prov = p
			}

			let activeProfileID = _prov.returnActivePoolProfile()
			let poolProfiles = _prov.returnPoolProfiles()

			let profilePrompt = await self.prompt({
				type: 'list',
				name: 'profile',
				message: 'Choose a pool profile: ',
				choices: poolProfiles
			})
			selection = profilePrompt.profile;

			// self.log(vorpal.chalk.yellow(poolProfiles))

		});
}