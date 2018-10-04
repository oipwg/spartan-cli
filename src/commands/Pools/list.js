export default function(vorpal, options){
	let spartan = options.SpartanBot;

	vorpal
		.command('pool list')
		.description('Selection of a rental provider that you wish to remove')
		.alias('pl')
		.action(async function(args) {
			const self = this;
			await spartan._deserialize;
			if (spartan.getRentalProviders().length === 0) {
				self.log(vorpal.chalk.red(`No rental providers found! Add one by typing: rentalprovider add`));
				return
			}

			let pools;
			try {
				pools = await spartan.returnPools()
			} catch (err) {
				self.log(vorpal.chalk.red("Failed to get pools: ", err))
				return
			}

			const fmtPool = (pool) => {
				return vorpal.chalk.white(`${vorpal.chalk.blue(pool.type)} ${vorpal.chalk.green(pool.host + ':' + pool.port)} ${vorpal.chalk.yellow(pool.name)} ${pool.user}`)
			};

			const serPool = (pool) => {
				let tmpObj = {}
				for (let opt in pool) {
					if (opt === 'algo') {
						tmpObj.type = pool[opt]
					} else if (opt === 'pool_host') {
						tmpObj.host = pool[opt]
					} else if (opt === 'pool_port') {
						tmpObj.port = pool[opt]
					} else if (opt === 'pool_user') {
						tmpObj.user = pool[opt]
					} else if (opt === 'pool_pass') {
						tmpObj.pass = pool[opt]
					} else {
						tmpObj[opt] = pool[opt]
					}
				}
				return tmpObj
			};

			let fmtPoolArray = [];
			for (let pool of pools) {
				fmtPoolArray.push(fmtPool(serPool(pool)))
			}

			self.log(vorpal.chalk.white('Your pools across all market providers: '))
			let pool = await self.prompt({
				type: 'list',
				message: 'Pick a pool: ',
				name: 'pool',
				choices: [...fmtPoolArray, 'exit/return']
			});

			let chosenPool = pool.pool;
			let poolObj = {};
			for (let pool of pools) {
				poolObj[fmtPool(serPool(pool))] = pool.id
			}
			let poolid = poolObj[chosenPool];

			if (chosenPool !== 'exit/return') {
				let poolOptions = await self.prompt({
					type: 'list',
					message: 'Would you like to delete this pool or set it to active?',
					name: 'option',
					choices: ['Set to Active', 'Delete', 'exit']
				})
				let poolOpt = poolOptions.option;
				if (poolOpt !== 'exit') {
					if (poolOpt === 'Set to Active') {
						//set pool to top priorty under active profile for mrr
						//set pool to active for nicehash
						let providers = spartan.getRentalProviders()
						for (let provider of providers) {
							if (provider.getInternalType() === "MiningRigRentals") {
								provider.setActivePool(poolid)
								let profileID = provider.returnActivePoolProfile()
								let poolToUse;
								for (let pool of pools) {
									if (pool.id === poolid) {
										poolToUse = {...pool, profileID}
									}
								}
								let res;
								try {
									res = await provider.addPoolToProfile(poolToUse)
 c								} catch (err) {
									throw new Error(`Failed to add pool to main profile: ${err}`)
								}
								if (res.success)
									self.log(vorpal.chalk.yellow('Successfully added pool to active profile'))

							}
							if (provider.getInternalType() === "NiceHash") {
								provider.setActivePool(poolid)
							}
						}
					}
					if (poolOpt === 'Delete') {
						//remove pool across all providers
						let success = await spartan.deletePool(poolid)
						self.log('delete success', success)
					}

				}
			}


		});
}