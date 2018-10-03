import uid from 'uid';
import { config } from 'dotenv'
config()

import {
	Prompt_MRRAPIKeys,
	Prompt_NiceHashAPIKeys,
	Prompt_CreatePoolProfile,
	Prompt_RentalProviders,
	Prompt_OptionalName,
	Prompt_AddOrCreatePool,
	Prompt_AddPool,
	Prompt_NiceHashCreatePool
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
		if (rental_provider_type === 'cancel')
			return;

		let api_answers;
		if (rental_provider_type === "MiningRigRentals") {
			api_answers = await Prompt_MRRAPIKeys(self, vorpal);
		} else {
			api_answers = await Prompt_NiceHashAPIKeys(self, vorpal);
		}

		let provider_name = await Prompt_OptionalName(self, vorpal);

		try {
			let setup_success = await spartan.setupRentalProvider({
				type: rental_provider_type,
				api_key: api_answers.api_key,
				api_secret: api_answers.api_secret,
				api_id: api_answers.api_id,
				name: provider_name.name === 'undefined' ? undefined : provider_name.name
			});

			// this.log(vorpal.chalk.green('Setup success: \n',JSON.stringify(setup_success.pools, null, 4)));

			if (setup_success.success){
				this.log(vorpal.chalk.green("Successfully added new Rental Provider!\n"));
				if (setup_success.type === 'MiningRigRentals') {
					//if user has no pools, prompt to create one
					if (setup_success.poolProfiles.length === 0) {
						self.log(vorpal.chalk.yellow("0 pool profiles found, create a profile!\n"));
						let poolData;
						try {
							poolData = await setup_success.provider.createPoolProfile(await Prompt_CreatePoolProfile(self, vorpal, spartan));
						} catch (err) {
							self.log(`Error creating pool: \n ${err}`)
						}
						if (poolData.success) {
							setup_success.provider.setActivePoolProfile(poolData.profileID)
						}
						spartan.serialize();
						self.log(vorpal.chalk.yellow(`Pool successfully added`))
					} else {
						let addOrCreatePool = await Prompt_AddOrCreatePool(self, vorpal);

						if (addOrCreatePool.option === 'add') {
							let poolProfiles = setup_success.poolProfiles;

							let profileArray = [];
							let profileIDs = [];
							for (let profile of poolProfiles) {
								profileArray.push(`Name: ${profile.name} - ID: ${profile.id}`)
								profileIDs.push(profile.id)
							}
							let poolToAdd = await Prompt_AddPool(self, vorpal, profileArray)
							for (let id of profileIDs) {
								if (poolToAdd.option.includes(id)) {
									setup_success.provider.setActivePoolProfile(id)
									const len = poolProfiles.length
									for (let i = 0; i < len; i++) {
										if (poolProfiles[i].id === id) {
											setup_success.provider.addPoolProfiles(poolProfiles[i])
										}
									}
								}
							}
							// self.log('\n',setup_success.provider)
						}

						if (addOrCreatePool.option  === 'create') {
							let poolData;
							let poolInfo = await Prompt_CreatePoolProfile(self, vorpal, spartan);
							try {
								poolData = await setup_success.provider.createPoolProfile(poolInfo);
							} catch (err) {
								self.log(`Error while creating the profile: ${err}`)
							}
							if (poolData && poolData.success) {
								setup_success.provider.setActivePoolProfile(poolData.profileID)
								spartan.serialize();
								self.log(vorpal.chalk.green(`Pool successfully added`))
							} else {
								if (poolData === null || poolData === undefined) {
									self.log(vorpal.chalk.red(`Pool unsuccessfully added. Pool Data: ${poolData}`))
								}
							}
						}
 					}
				}
				if (setup_success.type === 'NiceHash') {
					let poolOptions = await Prompt_AddOrCreatePool(self, vorpal);
					if (poolOptions.option === 'add') {

						let poolArray = setup_success.provider.returnPools();

						//if on pools, ask if they want to create one
						if (poolArray.length === 0) {
							let confirm = await self.prompt({
								type: 'confirm',
								name: 'option',
								default: true,
								message: vorpal.chalk.yellow('Found no pools to add, would you like to create one?')
							});
							if (confirm.option) {
								//create pool
								let NiceHashPool = await Prompt_NiceHashCreatePool(self, vorpal, spartan);
								await setup_success.provider.createPool(NiceHashPool);
								setup_success.provider.setActivePool(NiceHashPool.id);
								self.log(vorpal.chalk.blue(`Pool added!`))
							}
						} else {
							let poolObject = {};
							for (let pool of poolArray) {
								poolObject[pool.name] = pool.id
							}
							let poolPicked = await Prompt_AddPool(self, vorpal, poolArray);

							for (let pool in poolObject) {
								if (pool === poolPicked.option) {
									setup_success.provider.setActivePool(poolObject[pool])
								}
							}
						}
					} else if (poolOptions.option === 'create') {
						//Prompt create Nice Hash pool
						let NiceHashPool = await Prompt_NiceHashCreatePool(self, vorpal, spartan);
						await setup_success.provider.createPool(NiceHashPool);
						self.log(vorpal.chalk.blue(`Pool added!`))
					}
				}
				spartan.serialize()
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