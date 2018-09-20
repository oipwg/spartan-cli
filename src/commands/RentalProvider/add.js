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
				//ToDo: Delete
				default: '6640765434bf0eb064f2b984c800718ca168f2801e67190ab3ed1f40b57e7425'
			},{
				type: "input",
				name: "api_secret",
				message: vorpal.chalk.yellow("Please enter your API Secret: "),
				//ToDo: Delete
				default: '69f7545a8ca0e029c5eba8740c16feaba8904f81ec7f629b4470c0d69071e392'
			}
		]);

		let provider_name = await this.prompt({
			type: "input",
			name: "name",
			message: vorpal.chalk.yellow("Add an optional name to your rental provider: "),
			default: undefined
		});

		try {
			let setup_success = await spartan.setupRentalProvider({
				type: rental_provider_type,
				api_key: api_answers.api_key,
				api_secret: api_answers.api_secret,
				name: provider_name.name
			});
			self.log(setup_success);

			if (setup_success.success){
				this.log(vorpal.chalk.green("Successfully added new Rental Provider!"));
				if (setup_success.type === 'MiningRigRentals') {

					// ------------------------prompt function---------------------------------
					let poolOpts = async () => {
						let poolOptions = {};
						let profileName = await this.prompt({
							type: 'input',
							name: 'profileName',
							message: vorpal.chalk.yellow('Input a pool profile name: ')
						});
						poolOptions.profileName = profileName.profileName;

						let algo = await this.prompt({
							type: 'input',
							name: 'algo',
							message: vorpal.chalk.yellow('Input an algorithm to mine with (scrypt, x11, sha256, etc...) : '),
							default: 'scrypt'
						});
						poolOptions.algo = algo.algo;

						let host = await this.prompt({
							type: 'input',
							name: 'host',
							message: vorpal.chalk.yellow('Input a host url: '),
							default: 'snowflake.oip.fun'
						});
						poolOptions.host = host.host;

						let port = await this.prompt({
							type: 'input',
							name: 'port',
							message: vorpal.chalk.yellow('Input a port to mine on: '),
							default: 8080
						});
						poolOptions.port = port.port;

						let user = await this.prompt({
							type: 'input',
							name: 'user',
							message: vorpal.chalk.yellow('Input a wallet address to receive funds at: '),
							description: 'Your workname'
						});
						poolOptions.user = user.user;

						let priority = await this.prompt({
							type: 'list',
							name: 'priority',
							message: vorpal.chalk.yellow('What priority would you like this pool to be at?: '),
							choices: ['0', '1', '2', '3', '4']
						});
						poolOptions.priority = priority.priority;

						let pass = await this.prompt({
							type: 'input',
							name: 'pass',
							message: vorpal.chalk.yellow('Optionally add a password to the pool profile: '),
							default: undefined
						});
						poolOptions.notes = pass.pass;

						let notes = await this.prompt({
							type: 'input',
							name: 'notes',
							message: vorpal.chalk.yellow('Optionally add additional notes to the pool profile: '),
							default: undefined
						});
						poolOptions.notes = notes.notes;

						return poolOptions
					};

					//if user has no pools, prompt to create one
					if (setup_success.pools.length === 0) {
						self.log(vorpal.chalk.yellow("0 pools found, create a pool!\n"));
						let poolData;
						try {
							poolData = await setup_success.provider.createPool(await poolOpts());
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
								poolData = await setup_success.provider.createPool(await poolOpts());
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