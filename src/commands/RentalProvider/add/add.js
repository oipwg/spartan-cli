import { config } from 'dotenv'
config()

import {
	Prompt_APIKeys,
	Prompt_CreatePool,
	Prompt_RentalProviders,
	Prompt_OptionalName,
	Prompt_AddOrCreatePool,
	Prompt_AddPool
} from "./promptFunctions";

export default function(vorpal, options){

	let spartan = options.SpartanBot;

	vorpal
	.command('rentalprovider add')
	.description('Add a rental provider to Spartan Bot')
	.alias('rp add')
	.action(async function(args) {
		const self = this;

		let select_rental_providers = await Prompt_RentalProviders(self, vorpal, spartan);

		let rental_provider_type = select_rental_providers.rental_provider;

		let api_answers = await Prompt_APIKeys(self, vorpal);

		let provider_name = await Prompt_OptionalName(self, vorpal)

		try {
			let setup_success = await spartan.setupRentalProvider({
				type: rental_provider_type,
				api_key: api_answers.api_key,
				api_secret: api_answers.api_secret,
				name: provider_name.name === 'undefined' ? undefined : provider_name.name
			});

			// this.log(vorpal.chalk.green('Setup success: \n',JSON.stringify(setup_success.pools, null, 4)));

			if (setup_success.success){
				this.log(vorpal.chalk.green("Successfully added new Rental Provider!"));
				if (setup_success.type === 'MiningRigRentals') {
					//if user has no pools, prompt to create one
					if (setup_success.pools.length === 0) {
						self.log(vorpal.chalk.yellow("0 pools found, create a pool!\n"));
						let poolData;
						try {
							poolData = await setup_success.provider.createPool(await Prompt_CreatePool(self, vorpal, spartan));
						} catch (err) {
							self.log(`Error creating pool: \n ${err}`)
						}
						if (poolData.success) {
							setup_success.provider.setActivePoolID(poolData.profileID)
						}
						spartan.serialize();
						self.log(vorpal.chalk.yellow(`Pool successfully added`))
					} else {
						let addOrCreatePool = await Prompt_AddOrCreatePool(self, vorpal);

						if (addOrCreatePool.option === 'add') {
							self.log('Add pool');

							let pools = setup_success.pools;
							let poolArray = [];
							let poolIDs = [];
							for (let pool of pools) {
								poolArray.push(`Name: ${pool.name} - ID: ${pool.id}`)
								poolIDs.push(pool.id)
							}
							let poolToAdd = await Prompt_AddPool(self, vorpal, poolArray)

							for (let id of poolIDs) {
								if (poolToAdd.option.includes(id)) {
									setup_success.provider.setActivePoolID(id)
									for (let pool of pools) {
										if (pool.id === id) {
											setup_success.provider.addPools(pool)
										}
									}
								}
							}
							self.log('\n',setup_success.provider)
						}

						if (addOrCreatePool.option  === 'create') {
							let poolData;
							try {
								let poolInfo = await Prompt_CreatePool(self, vorpal, spartan);
								poolData = await setup_success.provider.createPool(poolInfo);
							} catch (err) {
								self.log(`Error creating pool -> ${err}`)
							}
							if (poolData && poolData.success) {
								setup_success.provider.setActivePoolID(poolData.profileID)
								spartan.serialize();
								self.log(vorpal.chalk.yellow(`Pool successfully added`))
							} else {
								if (poolData === null || poolData === undefined) {
									self.log(vorpal.chalk.red(`Pool unsuccessfully added. Returned Undefined`))
								}
							}
						}
 					}
				}
				// self.log(setup_success.success)
			}  else  {
				if(setup_success.message === "settings.api_key is required!"){
					this.log(vorpal.chalk.red("You must input an API Key!"))
				} else if (setup_success.message === "settings.api_secret is required!"){
					this.log(vorpal.chalk.red("You must input an API Secret!"))
				} else if (setup_success.message === "Provider Authorization Failed"){
					this.log(vorpal.chalk.red("Unable to login to Account using API Key & API Secret, please check your keys and try again"))
				}
			}
		} catch (e) {
			this.log(vorpal.chalk.red("Error! Unable to add Rental Provider!\n" + e))
		}
	});
}