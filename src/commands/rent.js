import {
	convertHumanHashrateToMH,
	convertHumanTimeToSeconds
} from '../utils'

export default function(vorpal, options){
	let spartan = options.SpartanBot

	vorpal
	.command('rent')
	.description('Manually rent a miner')
	.action(async function (args, cb) {
		const self = this;

		let rental_providers = spartan.getRentalProviders()

		if (rental_providers.length === 0){
			return this.log(vorpal.chalk.yellow("No Rental Providers were found! Please run '") + vorpal.chalk.cyan("rentalprovider add") + vorpal.chalk.yellow("' to add your API keys."))
		}

		let questions = [
			{
				type: 'input',
				name: 'hashrate',
				default: '1GH',
				message: vorpal.chalk.yellow('How much Hashrate would you like to rent (i.e. 250MH, 1GH)? ')
			},
			{
				type: 'input',
				name: 'duration',
				default: '6h',
				message: vorpal.chalk.yellow('How long would you like to rent your miner? ')
			}
		];

		var answers = await this.prompt(questions);

		let converted_hashrate = convertHumanHashrateToMH(answers.hashrate);
		let converted_duration = convertHumanTimeToSeconds(answers.duration);

		self.log(vorpal.chalk.cyan("Searching for miners..."))

		let rental_aborted = false

		var rent_manual = await spartan.manualRental(converted_hashrate, converted_duration, async (prepurchase_info) => {
			if (JSON.stringify(prepurchase_info.status.status === 'warning' && prepurchase_info.status.type === "LOW_BALANCE")){
				this.log(vorpal.chalk.red(prepurchase_info.status.message))
			} else if (prepurchase_info.status.status === 'normal'){
				this.log(vorpal.chalk.cyan("Enough funds in wallet for purchase"))
			}
			var confirm_purchase = await self.prompt({
				type: 'confirm',
				name: 'confirm',
				default: false,
				message: vorpal.chalk.yellow('Do you want to rent ' + prepurchase_info.total_rigs + ' miner(s) (' + (prepurchase_info.hashrate_to_rent/1000).toFixed(2) + ' GH) for $' + prepurchase_info.cost_to_rent + '?')
			})
			if (confirm_purchase.confirm){
				self.log(vorpal.chalk.cyan("Renting miners..."))
			} else {
				rental_aborted = true
				this.log(vorpal.chalk.red("Rental was aborted"))
			}

			return confirm_purchase.confirm
		})

		if (rent_manual.success && !rental_aborted){
			self.log(vorpal.chalk.green(`Successfully rented ${rent_manual.total_rigs_rented} miner(s) (${(rent_manual.total_hashrate/1000).toFixed(2)} GH) for $${rent_manual.total_cost}!`))

		} else {
			if (!rental_aborted)
				return this.log(vorpal.chalk.red("Unable to rent Miners! " + JSON.stringify(rent_manual)))
		}
	});
}
