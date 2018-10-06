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
				choices: ['Set to Active', 'Delete', exit]
			})
			let chosenCommand = promptPoolCommands.choice;

			if (chosenCommand === exit)
				return

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