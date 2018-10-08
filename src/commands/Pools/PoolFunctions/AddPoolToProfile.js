export const PromptAddPoolToProfile = async (self, vorpal, spartan, _pool) => {
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
	let profileID, providerUID;
	for (let profile of poolProfiles) {
		if (profile.name === profileName) {
			profileID = profile.id
			providerUID = profile.providerUID
		}
	}

	let poolPriority = await self.prompt({
		type: 'list',
		message: vorpal.chalk.yellow(`Select priority:`),
		name: 'option',
		choices: ['0', '1', '2', '3', '4']
	})
	let priority = poolPriority.option

	let poolObject = {poolid: _pool.mrrID || _pool.id, algo: _pool.type, name: _pool.name, priority, profileID}

	for (let provider of spartan.getRentalProviders()) {
		if (provider.getUID() === providerUID) {
			for (let profile of provider.returnPoolProfiles()) {
				if (profile.id === profileID) {
					let res;
					try {
						res = await provider.addPoolToProfile(poolObject)
					} catch (err) {
						throw new Error(`Failed to add pool to profile: ${err}`)
					}
					if (res.success) {
						self.log(vorpal.chalk.yellow(`Pool Added`))
						return {pool: _pool, profileID, providerUID, provider: provider, success: true}
					} else {
						self.log(vorpal.chalk.red(JSON.stringify(res, null, 4)))
						return {success: false, error: res}
					}
				}
			}
		}
	}
}

export const AddPoolToProfile = async (self, vorpal, pool, profileID, provider) => {
	let poolObject = {poolid: pool.mrrID || pool.id, algo: pool.type, name: pool.name, priority: 0, profileID, provider}

	if (provider) {
		let res;
		try {
			res = await provider.addPoolToProfile(poolObject)
		} catch (err) {
			self.log(vorpal.chalk.red(`Failed to add pool to profile: ${JSON.stringify(err, null, 4)}`))
		}
		return res
	} else {
		let providers = spartan.getRentalProviders()
		for (let provider of providers) {
			for (let profile of provider.returnPoolProfiles()) {
				if (profile.id === profileID) {
					let res;
					try {
						res = await provider.addPoolToProfile(poolObject)
					} catch (err) {
						self.log(vorpal.chalk.red(`Failed to add pool to profile: ${JSON.stringify(err, null, 4)}`))
					}
					return res
				}
			}
		}
	}
}
