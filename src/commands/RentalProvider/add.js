export default function(vorpal, options){
	let spartan = options.SpartanBot

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

			if (setup_success.success){
				this.log(vorpal.chalk.green("Successfully added new Rental Provider!"))
			} else {
				this.log(setup_success)
			}
		} catch (e) {
			this.log(vorpal.chalk.red("Error! Unable to add Rental Provider!\n" + e))
		}
	});
}