import {Prompt_CreateMRRPool, Prompt_CreatePoolProfile} from "../RentalProvider/add/promptFunctions";
import {fmtPool, serPool} from "../../utils";

export default function(vorpal, options){
	let spartan = options.SpartanBot

	vorpal
		.command('pool profiles')
		.description('Manage your MiningRigRentals pool profiles')
		.alias('pp')
		.action(async function(args) {
			const self = this;
			const exit = vorpal.chalk.red(`exit`)

			if (spartan.getRentalProviders().length === 0) {
				self.log(vorpal.chalk.red(`No rental providers found. To add one: rentalprovider add`));
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
				message: vorpal.chalk.yellow('Choose a provider: '),
				name: 'provider',
				choices: [...providerArray, 'exit/return']
			})
			let selection = providerPrompt.provider
			if (selection === 'exit/return')
				return
			let uid = providerObject[selection]
			let _prov;
			for (let p of spartan.getRentalProviders()) {
				if (p.getUID() === uid)
					_prov = p
			}

			let listOrCreate = await self.prompt({
				type: 'list',
				message: vorpal.chalk.yellow(`Select a command: `),
				name: 'option',
				choices: ['List Pool Profiles', 'Create Pool Profile']
			})
			let opt = listOrCreate.option

			// --------------------------------------------------------------------------------------------------------
			if (opt === 'List Pool Profiles') {
				let activeProfileID = _prov.returnActivePoolProfile()
				let res
				try {
					res = await _prov.getPoolProfiles()
				} catch (err) {
					throw new Error(`There was a problem fetching the pool profiles from MRR: ${err}`)
				}
				let profiles;
				if (res.success)
					profiles = res.data
				else
					throw new Error(`Failed to get pool profiles: ${res}`)
				let profileObj = {}
				let profileNames = []

				for (let profile of profiles) {
					let name = profile.name
					if (profile.id === activeProfileID) {
						name = `${vorpal.chalk.cyan(profile.name + ` (active)`)}`
					}
					profileObj[name] = profile.id

					profileNames.push(name)
				}

				let profilePrompt = await self.prompt({
					type: 'list',
					name: 'profile',
					message: vorpal.chalk.yellow('Choose a pool profile: '),
					choices: [...profileNames, vorpal.chalk.red('exit/return')]
				})
				selection = profilePrompt.profile;

				if (selection === vorpal.chalk.red('exit/return'))
					return

				let profileID = profileObj[selection]
				let _profile;
				for (let profile of profiles) {
					if (profile.id === profileID)
						_profile = profile
				}

				let profileCommand = await self.prompt({
					type: 'list',
					name: 'option',
					message: vorpal.chalk.yellow('Select a command: '),
					choices: ['Set to Active', 'List Pools', 'Add Pool', 'Create Pool', 'Delete', 'exit/return']
				})
				let command = profileCommand.option

				if (command === 'Set to Active') {
					_prov.setActivePoolProfile(profileID)
					if (_prov.returnActivePoolProfile() === profileID)
						self.log(vorpal.chalk.yellow(`${_profile.name} is active!`))
					else
						self.log(vorpal.chalk.red(`Failed to set ${_profile.name} to active`))
				}

				if (command === 'List Pools') {
					//ToDo: sort by priority
					if (!_profile.pools || (_profile.pools && _profile.pools.length === 0)) {
						let commandOpt = await self.prompt({
							type: 'confirm',
							message: vorpal.chalk.yellow(`No pools found. Would you like to create one?`),
							default: true,
							name: 'confirm'
						})
						let confirm = commandOpt.confirm
						if (!confirm)
							return
						if (confirm) {
							let poolOptions = await Prompt_CreateMRRPool(self, vorpal, spartan)

							let res;
							try {
								res = await _prov._createPool(poolOptions)
							} catch (err) {
								throw new Error(`Failed to create a pool: ${err}`)
							}
							self.log(vorpal.chalk.blue('Created Pool!'))

							if (res) {
								let newPoolObj = {profileID, poolid: res.mrrID, priority: 0, algo: res.type, name: res.name}

								let addPoolToProfile
								try {
									addPoolToProfile = await _prov.addPoolToProfile(newPoolObj)
								} catch (err) {
									throw new Error(`Failed to add pool to profile: ${err}`)
								}
								if (addPoolToProfile.success)
									self.log(vorpal.chalk.green(JSON.stringify(addPoolToProfile, null, 4)))
								if (!addPoolToProfile.success)
									self.log(vorpal.chalk.red(JSON.stringify(addPoolToProfile, null, 4)))
							}
						}
						return
					}
					let profilePools = _profile.pools

					let allPools;
					try {
						allPools = await _prov.getPools()
					} catch (err) {
						throw new Error('Failed to get pools: ${err}')
					}

					//add name and id to pool that was returned on profile
					let newPoolArray = []
					for (let pool of profilePools) {
						for (let p of allPools) {
							if (pool.host === p.host && pool.user === p.user && pool.port === p.port && pool.pass === p.pass) {
								newPoolArray.push({...pool, name: p.name, id: p.id})
							}

						}
					}

					let poolArray = []
					let poolObject = {}
					for (let pool of newPoolArray) {
						let formattedPool = fmtPool(serPool(pool), vorpal)
						poolArray.push(formattedPool)
						poolObject[formattedPool] = pool.id
					}
					self.log(vorpal.chalk.yellow(`These are the pools on this profile`))
					let promptPools = await self.prompt({
						type: 'list',
						message: vorpal.chalk.yellow('Select a pool: '),
						name: 'option',
						choices: [...poolArray, 'exit/return']
					})
					let poolString = promptPools.option
					if (poolString === 'exit/return')
						return

					let poolid = poolObject[poolString]


					let _pool;
					for (let pool of newPoolArray) {

						if (pool.id === poolid)
							_pool = pool
					}

					let poolCommand = await self.prompt({
						type: 'list',
						name: 'option',
						message: vorpal.chalk.yellow('Select a command: '),
						choices: ['Set Priority', 'Delete', 'exit']
					})
					let command = poolCommand.option;

					//on _pool
					if (command === 'Set Priority') {
						let priorityPrompt = await self.prompt({
							type: 'list',
							name: 'option',
							message: 'Select an option: ',
							choices: ['0', '1', '2', '3', '4']
						})
						let priority = priorityPrompt.option

						let poolAPIObj = {profileID, poolid: _pool.id, algo: _pool.type, name: _pool.name, priority}

						let res;
						try {
							res = await _prov.updatePoolOnProfile(poolAPIObj)
						} catch (err) {
							throw new Error(`Failed to set priority on pool: ${err}`)
						}
						if (res.success)
							self.log(vorpal.chalk.green(`Updated pool priority!`))
						return
					}

					if (command === 'Delete') {
						let confirm = await self.prompt({
							type: 'confirm',
							message: 'Are you sure you want to delete this pool?',
							name: 'confirm',
							default: true
						})
						let confirmation = confirm.confirm

						if (!confirmation)
							return
						if (confirmation) {
							let res;
							try {
								res = await _prov.deletePool(_pool.id)
							} catch (err) {
								throw new Error(`Failed to delete pool`)
							}
							if (res.success)
								self.log(vorpal.chalk.green(JSON.stringify(res, null, 4)))
							if (!res.success)
								self.log(vorpal.chalk.red(JSON.stringify(res, null, 4)))

						}
					}

					if (command === 'exit')
						return
				}

				if (command === 'Add Pool') {
					//fetch all the pools
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
						message: 'Select a pool:',
						name: 'choice',
						choices: [...fmtPoolArray, exit]
					});

					let chosenPool = promptPools.choice;
					if (chosenPool === exit)
						return

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

					let poolObject = {poolid: _pool.mrrID || _pool.id, algo: _pool.type, name: _pool.name, priority: 4, profileID: _profile.id}
					let res;
					try {
						res = await  _prov.addPoolToProfile(poolObject)
					} catch (err) {
						throw new Error(`Failed to add pool to profile: ${err}`)
					}
					if (res.success) {
						self.log(vorpal.chalk.green(JSON.stringify(res, null, 4)))
					} else {
						self.log(vorpal.chalk.red(JSON.stringify(res, null, 4)))
					}
				}

				if (command === 'Create Pool') {
					let poolOptions = await Prompt_CreateMRRPool(self, vorpal, spartan)

					let res;
					try {
						res = await _prov._createPool(poolOptions)
					} catch (err) {
						throw new Error(`Failed to create a pool: ${err}`)
					}
					self.log(vorpal.chalk.blue('Created Pool!'))

					if (res) {
						let newPoolObj = {profileID, poolid: res.mrrID, priority: 4, algo: res.type, name: res.name}

						let addPoolToProfile
						try {
							addPoolToProfile = await _prov.addPoolToProfile(newPoolObj)
						} catch (err) {
							throw new Error(`Failed to add pool to profile: ${err}`)
						}
						if (addPoolToProfile.success)
							self.log(vorpal.chalk.green(JSON.stringify(addPoolToProfile, null, 4)))
						if (!addPoolToProfile.success)
							self.log(vorpal.chalk.red(JSON.stringify(addPoolToProfile, null, 4)))
					}
				}

				if (command === 'Delete') {
					let res
					try {
						res = await _prov.deletePoolProfile(profileID)
					} catch (err) {
						throw new Error(`Failed to delete pool profile: ${err}`)
					}

					if (res.success)
						self.log(vorpal.chalk.yellow(`Delete Profile!`))
					else
						self.log(vorpal.chalk.red(`Failed to delete profile`))
				}
			}

			// --------------------------------------------------------------------------------------------------------
			if (opt === 'Create Pool Profile') {
				let poolData;
				let poolInfo = await Prompt_CreatePoolProfile(self, vorpal, spartan);
				try {
					poolData = await _prov.createPoolAndProfile(poolInfo);
				} catch (err) {
					self.log(`Error while creating the profile: ${err}`)
				}

				if (poolData && poolData.success && poolData.success.success) {
					_prov.setActivePoolProfile(poolData.profileID)
					for (let p of spartan.getRentalProviders()) {
						if (p.getUID() !== _prov.getUID()) {
							p.addPools(poolData.pool)
						}
					}
					spartan.serialize();
					self.log(vorpal.chalk.green(`Profile successfully added`))
				} else {
					if (poolData === null || poolData === undefined) {
						self.log(vorpal.chalk.red(`Pool unsuccessfully added. Pool Data: ${poolData}`))
					}
				}
			}
			spartan.serialize()
		});
}