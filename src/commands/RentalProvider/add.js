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
				message: vorpal.chalk.yellow("Please enter your API Key: ")
			},{
				type: "input",
				name: "api_secret",
				message: vorpal.chalk.yellow("Please enter your API Secret: ")
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
				this.log(vorpal.chalk.green("Successfully added new Rental Provider!"))
				// let pool_setup = await this.prompt({
				// 	type: "list",
				// 	name:"pools",
				// 	message: "select your pool",
				// 	choices: Object.keys(spartan.rental_providers[0].getPools())
				// })

				// self.log(spartan)
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