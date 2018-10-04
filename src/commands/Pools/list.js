import {serPool, fmtPool} from "../../utils";

export default function(vorpal, options){
	let spartan = options.SpartanBot;

	vorpal
		.command('pools')
		.description('List of all current pools')
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

			let fmtPoolArray = [];
			for (let pool of pools) {
				fmtPoolArray.push(fmtPool(serPool(pool), vorpal))
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
				poolObj[fmtPool(serPool(pool), vorpal)] = pool.id
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
										poolToUse = {...pool, profileID, priority: 0}
									}
								}
								// console.log('pool to use: ', poolToUse)
								let res;
								try {
									res = await provider.addPoolToProfile(poolToUse)
 								} catch (err) {
									throw new Error(`Failed to add pool to main profile: ${err}`)
								}
								if (res.success)
									self.log(vorpal.chalk.yellow('Pool is active'))
								else
									self.log(vorpal.chalk.red(JSON.stringify(res, null, 4)))


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
					spartan.serialize()
				}
			}
		});
}