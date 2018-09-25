import { config } from 'dotenv'
config()

import {PromptCreatePool } from "./add/promptFunctions";

export default function(vorpal, options){

	let spartan = options.SpartanBot;

	vorpal
	.command('rentalprovider add')
	.description('Add a rental provider to Spartan Bot')
	.alias('rp add')
	.action(async function(args) {
		const self = this;

		let select_provider_answers = await this.prompt({
			type: 'list',
			name: 'rental_provider',
			message: vorpal.chalk.yellow('What kind of Rental Provider would you like to add?'),
			choices: spartan.getSupportedRentalProviders()
		});

		let rental_provider_type = select_provider_answers.rental_provider;

		let api_answers = await this.prompt([
			{
				type: "input",
				name: "api_key",
				message: vorpal.chalk.yellow("Please enter your API Key: "),
				default: process.env.API_KEY
			},{
				type: "input",
				name: "api_secret",
				message: vorpal.chalk.yellow("Please enter your API Secret: "),
				default: process.env.API_SECRET
			}
		]);

		let provider_name = await this.prompt({
			type: "input",
			name: "name",
			message: vorpal.chalk.yellow("Add an optional name to your rental provider: "),
			default: 'undefined'
		});

		try {
			let setup_success = await spartan.setupRentalProvider({
				type: rental_provider_type,
				api_key: api_answers.api_key,
				api_secret: api_answers.api_secret,
				name: provider_name.name === 'undefined' ? undefined : provider_name.name
			});

			this.log(vorpal.chalk.green('Setup success: \n',setup_success));

			if (setup_success.success){
				this.log(vorpal.chalk.green("Successfully added new Rental Provider!"));
				if (setup_success.type === 'MiningRigRentals') {

					//if user has no pools, prompt to create one
					if (setup_success.pools.length === 0) {
						self.log(vorpal.chalk.yellow("0 pools found, create a pool!\n"));
						let poolData;
						try {
							poolData = await setup_success.provider.createPool(await PromptCreatePool());
						} catch (err) {
							self.log(`Error creating pool: \n ${err}`)
						}
						if (poolData.success) {
							setup_success.provider.setActivePoolID(poolData.profileID)
						}
						spartan.serialize();
						self.log(vorpal.chalk.yellow(`Pool successfully added`))
					} else {
						let choice = await this.prompt({
							type: 'list',
							name: 'poolChoice',
							message: vorpal.chalk.yellow("Would you like to add an existing pool or a create a new pool?"),
							choices: ['add', 'create']
						});

						if (choice.poolChoice === 'add') {
							self.log('choice was add')
							let pools = setup_success.pools;
							let poolArray = [];
							let poolIDs = [];
							for (let pool of pools) {
								poolArray.push(`Name: ${pool.name} - ID: ${pool.id}`)
								poolIDs.push(pool.id)
							}
							let poolToAdd = await this.prompt({
								type: 'list',
								name: 'poolChoice',
								message: vorpal.chalk.yellow("Would you like to create a new pool or add an existing pool?"),
								choices: poolArray
							});

							for (let id of poolIDs) {
								if (poolToAdd.poolChoice.includes(id)) {
									setup_success.provider.setActivePoolID(id)
									for (let pool of pools) {
										if (pool.id = id) {
											setup_success.provider.addPools(pool)
										}
									}
								}
							}
							self.log(setup_success.provider)
						}

						if (choice.poolChoice  === 'create') {
							let poolData;
							try {
								poolData = await setup_success.provider.createPool(await PromptCreatePool());
							} catch (err) {
								self.log(`Error creating pool: \n ${err}`)
							}
							if (poolData.success) {
								setup_success.provider.setActivePoolID(poolData.profileID)
							}
							spartan.serialize();
							self.log(vorpal.chalk.yellow(`Pool successfully added`))
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