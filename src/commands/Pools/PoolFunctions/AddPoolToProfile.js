export const AddPoolToProfile = async (self, vorpal, spartan, _pool) => {
	let poolProfiles = []
	for (let provider of spartan.getRentalProviders()) {
		if (provider.getInternalType() === "MiningRigRentals") {
			let res;
			try {
				res = await provider.getPoolProfiles()
			} catch (err) {
				throw new Error(`Failed to fetch pool profiles: ${err}`)
			}
			if (res.success) {
				for (let profile of res.data) {
					poolProfiles.push({...profile, providerUID: provider.getUID()})
				}
			}
		}
	}
	// console.log('poolProfs: ', poolProfiles)

	let promptProfiles = await self.prompt({
		type: 'list',
		message: 'Select a profile',
		name: 'option',
		choices: [...poolProfiles, 'exit']
	})
	let profileName = promptProfiles.option
	let profileID;
	for (let profile of poolProfiles) {
		if (profile.name === profileName) {
			profileID = profile.id
		}
	}
	let poolObject = {poolid: _pool.mrrID || _pool.id, algo: _pool.type, name: _pool.name, priority: 4, profileID}
	for (let provider of spartan.getRentalProviders()) {
		if (provider.getInternalType() === "MiningRigRentals") {
			for (let profile of provider.returnPoolProfiles()) {
				if (profile.id === profileID) {
					let res;
					try {
						res = await  provider.addPoolToProfile(poolObject)
					} catch (err) {
						throw new Error(`Failed to add pool to profile: ${err}`)
					}
					if (res.success) {
						self.log(vorpal.chalk.yellow(`Pool added.`))
					} else {
						self.log(vorpal.chalk.red(JSON.stringify(res, null, 4)))
					}
				}
			}
		}
	}
	return true
}
