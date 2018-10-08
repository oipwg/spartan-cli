import {UpdatePool} from "./PoolFunctions/UpdatePool";
import {AddPoolToProfile} from "./PoolFunctions/AddPoolToProfile";
import {ListPools} from "./PoolFunctions/ListPools";

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
				return this.log(vorpal.chalk.yellow("No Rental Providers were found! Please run '") + vorpal.chalk.cyan("rentalprovider add") + vorpal.chalk.yellow("' to add your API keys."))
			}

			let _pool = await ListPools(self, vorpal, spartan)
			if (_pool === exit)
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
				return await UpdatePool(self, vorpal, spartan, _pool)
			}

			if (chosenCommand === 'Add to MRR Profile') {
				await AddPoolToProfile(self, vorpal, spartan, _pool)
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
				self.log(vorpal.chalk.red('Deleted'))
			}

			spartan.serialize()
		});
}