import {serPool, fmtPool} from "../../utils";

export default function(vorpal, options){
	let spartan = options.SpartanBot;

	vorpal
		.command('pool list')
		.description('List of all current pools')
		.alias('pl')
		.action(async function(args) {
			const self = this;
			const exit = vorpal.chalk.red(`exit`)

			await spartan._deserialize;
			if (spartan.getRentalProviders().length === 0) {
				self.log(vorpal.chalk.red(`No rental providers found! Add one by typing: rentalprovider add`));
				return
			}

			let _pools;
			try {
				_pools = await spartan.getPools()
			} catch (err) {
				self.log(vorpal.chalk.red("Failed to get pools from MRR API: ", err))
				return
			}

			let fmtPoolArray = [];
			for (let pool of _pools) {
				fmtPoolArray.push(fmtPool(serPool(pool), vorpal))
			}

			let promptPools = await self.prompt({
				type: 'list',
				message: 'Select a pool to manage:',
				name: 'choice',
				choices: [...fmtPoolArray, exit]
			});

			let chosenPool = promptPools.choice;
			let poolObj = {};
			for (let pool of _pools) {
				poolObj[fmtPool(serPool(pool), vorpal)] = pool.id
			}
			let poolid = poolObj[chosenPool];
			let _pool;
			for (let pool of _pools) {
				if (pool.id === poolid) {
					_pool = pool
				}
			}

			if (chosenPool === exit)
				return

			let promptPoolCommands = await self.prompt({
				type: 'list',
				message: vorpal.chalk.yellow('Choose an option:'),
				name: 'choice',
				choices: ['Update', 'Add to MRR Profile', 'Set to Active', 'Delete', exit]
			})
			let chosenCommand = promptPoolCommands.choice;

			if (chosenCommand === exit)
				return

			if (chosenCommand === 'Update') {
				let providers = spartan.getRentalProviders()

				let poolV2 = {}
				for (let opt in _pool) {
					poolV2[opt] = _pool[opt]
				}

				const Done = vorpal.chalk.red(`Done`)
				let typePrompt = function(){};
				while (typePrompt.option !== Done) {

					// let type = `type: ${poolV2.type} `
					let name = `name: ${poolV2.name} `
					let host = `host: ${poolV2.host} `
					let port = `port: ${poolV2.port} `
					let user = `user: ${poolV2.user} `
					let pass = `pass: ${poolV2.pass} `
					let notes = `notes: ${poolV2.notes} `

					typePrompt = await self.prompt({
						type: 'list',
						message: vorpal.chalk.yellow('Select an option:'),
						name: 'option',
						choices: [name, host, port, user, pass, notes, Done]
					})
					let option = typePrompt.option
					let param = option.split(":")[0].toLowerCase()

					if (option === Done) {
						let exactMatch = true;
						for (let opt in poolV2) {
							for (let _opt in _pool) {
								if (opt === _opt) {
									if (poolV2[opt] !== _pool[_opt]) {
										exactMatch = false
									}
								}
							}
						}
						if (exactMatch) {
							self.log(vorpal.chalk.yellow('No changes. Exiting...'))
						} else {
							//account for multiple providers not having access to the same pool
							let updateRes
							try {
								updateRes = await spartan.updatePool(_pool.id, poolV2)
							} catch (err) {
								throw new Error(`Failed to update pool: ${err}`)
							}
						}
					}

					let updatePrompt = await self.prompt({
						type: 'input',
						message: vorpal.chalk.yellow(` ${param} `),
						name: 'input',
						default: poolV2[param]
					})

					poolV2[param] = updatePrompt.input
				}

				spartan.serialize()
				return
			}

			if (chosenCommand === 'Add to MRR Profile') {
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
								poolProfiles.push(profile)
							}
						}
					}
				}

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
									self.log(vorpal.chalk.green(JSON.stringify(res, null, 4)))
								} else {
									self.log(vorpal.chalk.red(JSON.stringify(res, null, 4)))
								}
							}
						}
					}
				}
			}

			if (chosenCommand === 'Set to Active') {
				//set pool to top priorty under active profile for mrr
				let providers = spartan.getRentalProviders()
				for (let provider of providers) {
					if (provider.getInternalType() === "MiningRigRentals") {
						provider.setActivePool(poolid)
						let profileID = provider.returnActivePoolProfile()
						let extendedPool = {..._pool, profileID, priority: 0}
						let res;
						try {
							res = await provider.addPoolToProfile(extendedPool)
                        } catch (err) {
							throw new Error(`Failed to add pool to main profile: ${err}`)
						}

						if (res.success)
							self.log(vorpal.chalk.yellow('Pool is active'))
						else
							self.log(vorpal.chalk.red(`Failed to add pool to MRR profile: ${JSON.stringify(res, null, 4)}`))
					}
					//set pool to active for nicehash
					if (provider.getInternalType() === "NiceHash") {
						provider.setActivePool(poolid)
					}
				}
			}

			if (chosenCommand === 'Delete') {
				//remove pool across all providers
				let success = await spartan.deletePool(poolid)
				self.log('delete success', success)
			}

			spartan.serialize()
		});
}