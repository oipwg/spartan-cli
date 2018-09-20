export default function(vorpal, options){
	let spartan = options.SpartanBot
	console.log(spartan)
	vorpal
	.command('rentalprovider add')
	.action(async function(args) {
		let select_provider_answers = await this.prompt({
			type: 'list',
			name: 'rental_provider',
			message: vorpal.chalk.yellow('What kind of Rental Provider would you like to add?'),
			choices: spartan.getSupportedRentalProviders()
		});

		let rental_provider_type = select_provider_answers.rental_provider
		
		let api_answers = await this.prompt([
			{
				type: "input",
				name: "api_key",
				message: vorpal.chalk.yellow("Please enter your API Key: ")
			},{
				type: "input",
				name: "api_secret",
				message: vorpal.chalk.yellow("Please enter your API Secret: ")
			}
		])

		try {
			let setup_success = await spartan.setupRentalProvider({
				type: rental_provider_type,
				api_key: api_answers.api_key,
				api_secret: api_answers.api_secret
			})
			console.log(spartan)
			if (setup_success.success){
				let pool_setup = await this.prompt({
					type: "list",
					name:"pools",
					message: "select your pool",
					choices: Object.keys(spartan.rental_providers.MRRProvider[uid].getPools())
				})
			}

			if (pool_setup.success){
				this.log(vorpal.chalk.green("Successfully added new Rental Provider!"))
				console.log(spartan)
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