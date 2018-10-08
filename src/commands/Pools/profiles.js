import {Prompt_CreateMRRPool, Prompt_CreatePoolProfile} from "../RentalProvider/add/promptFunctions";
import {fmtPool, serPool} from "../../utils";
import {UpdatePool} from "./PoolFunctions/UpdatePool";
import {SetPoolPriority} from "./PoolFunctions/SetPoolPriority";
import {ListPools} from "./PoolFunctions/ListPools";
import {AddPoolToProfile} from "./PoolFunctions/AddPoolToProfile";

export default function(vorpal, options){
	let spartan = options.SpartanBot

	vorpal
		.command('pool profiles')
		.description('Manage your MiningRigRentals pool profiles')
		.alias('pp')
		.action(async function(args) {
			const self = this;
			const exit = vorpal.chalk.red(`exit`)

			await spartan._deserialize
			if (spartan.getRentalProviders().length === 0) {
				return this.log(vorpal.chalk.yellow("No Rental Providers were found! Please run '") + vorpal.chalk.cyan("rentalprovider add") + vorpal.chalk.yellow("' to add your API keys."))
			}

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
				choices: [...providerArray, exit]
			})
			let selection = providerPrompt.provider
			if (selection === exit)
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
				choices: ['List Pool Profiles', 'Create Pool Profile', exit]
			})
			let opt = listOrCreate.option
			if (opt === exit)
				return

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
					choices: [...profileNames, exit]
				})
				selection = profilePrompt.profile;

				if (selection === exit)
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
					message: vorpal.chalk.yellow('Select a command:'),
					choices: ['Set to Active', 'List Pools', 'Add Pool', 'Create Pool', 'Delete', exit]
				})
				let command = profileCommand.option
				if (command === exit)
					return

				if (command === 'Set to Active') {
					_prov.setActivePoolProfile(profileID)
					if (_prov.returnActivePoolProfile() === profileID)
						self.log(vorpal.chalk.yellow(`${_profile.name} is active!`))
					else
						self.log(vorpal.chalk.red(`Failed to set ${_profile.name} to active`))
				}

				if (command === 'List Pools') {
					if (!_profile.pools || (_profile.pools && _profile.pools.length === 0)) {
						let commandOpt = await self.prompt({
							type: 'list',
							message: vorpal.chalk.yellow(`No pools found. Create or add one:`),
							name: 'option',
							choices: ['Add', 'Create', exit]
						})
						let command = commandOpt.option
						if (command === exit)
							return
						if (command === 'Create') {
							let poolOptions = await Prompt_CreateMRRPool(self, vorpal, spartan)

							let res;
							try {
								res = await _prov._createPool(poolOptions)
							} catch (err) {
								throw new Error(`Failed to create a pool: ${err}`)
							}
							self.log(vorpal.chalk.yellow('Pool Created'))

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

						if (command === 'Add') {
							let pool = await ListPools(self, vorpal, spartan)
							if (pool === exit)
								return

							let addPool = await AddPoolToProfile(self, vorpal, pool, profileID, _prov)
							if (addPool.success) {
								self.log(vorpal.chalk.yellow(`Pool Added`))
							} else {
								self.log(vorpal.chalk.red('Failed to add pool'))
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

					//add name, id, and priority to pool that was returned on profile
					let newPoolArray = []
					for (let pool of profilePools) {
						for (let p of allPools) {
							if (pool.host === p.host && pool.user === p.user && pool.port === p.port && pool.pass === p.pass) {
								newPoolArray.push({...pool, name: p.name, id: p.id, priority: pool.priority})
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
						choices: [...poolArray, exit]
					})
					let poolString = promptPools.option
					if (poolString === exit)
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
						choices: ['Update', 'Set Priority', 'Delete', exit]
					})
					let command = poolCommand.option;
					if (command === exit)
						return

					if (command === 'Update') {
						return await UpdatePool(self, vorpal, spartan, _pool)
					}

					//on _pool
					if (command === 'Set Priority') {
						await SetPoolPriority(self, vorpal, profileID, _pool, _prov)
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
								self.log(vorpal.chalk.red('Deleted'))
							if (!res.success)
								self.log(vorpal.chalk.red(`Failed to delete pool: `, JSON.stringify(res, null, 4)))

						}
					}
				}

				if (command === 'Add Pool') {
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

					let poolPriority = await self.prompt({
						type: 'list',
						message: vorpal.chalk.yellow(`Select a pool priority:`),
						name: 'option',
						choices: ['0', '1', '2', '3', '4']
					})
					let priority = poolPriority.option

					let poolObject = {poolid: _pool.mrrID || _pool.id, algo: _pool.type, name: _pool.name, priority, profileID: _profile.id}
					let res;
					try {
						res = await  _prov.addPoolToProfile(poolObject)
					} catch (err) {
						throw new Error(`Failed to add pool to profile: ${err}`)
					}
					if (res.success) {
						self.log(vorpal.chalk.yellow(`Pool Added`))
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
					self.log('Pool Created Successfully')

					let poolPriority = await self.prompt({
						type: 'list',
						message: vorpal.chalk.yellow(`Select pool priority:`),
						name: 'option',
						choices: ['0', '1', '2', '3', '4']
					})
					let priority = poolPriority.option

					if (res) {
						let newPoolObj = {profileID, poolid: res.mrrID, priority, algo: res.type, name: res.name}

						let addPoolToProfile
						try {
							addPoolToProfile = await _prov.addPoolToProfile(newPoolObj)
						} catch (err) {
							throw new Error(`Failed to add pool to profile: ${err}`)
						}
						if (addPoolToProfile.success)
							self.log(`Pool Added To Profile`)
						if (!addPoolToProfile.success)
							self.log(vorpal.chalk.red('Failed to add pool to profile: ', JSON.stringify(addPoolToProfile, null, 4)))
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
						self.log(vorpal.chalk.red(`Deleted`))
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
					self.log(`Profile created successfully`)
				} else {
					if (poolData === null || poolData === undefined) {
						self.log(vorpal.chalk.red(`Pool unsuccessfully added. Pool Data: ${poolData}`))
					}
				}
			}
			spartan.serialize()
		});
}