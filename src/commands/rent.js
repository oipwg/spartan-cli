import {
	convertHumanHashrateToMH,
	convertHumanTimeToSeconds
} from '../utils'

export default function(vorpal, options){
	let spartan = options.SpartanBot

	vorpal
	.command('rent')
	.action(async function (args, cb) {
		const self = this;
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

		var rent_manual = await spartan.manualRental(converted_hashrate, converted_duration, async (prepurchase_info) => {
			var confirm_purchase = await self.prompt({
				type: 'confirm',
				name: 'confirm',
				default: false,
				message: vorpal.chalk.yellow('Do you want to rent ' + prepurchase_info.total_rigs + ' miner(s) (' + (prepurchase_info.total_hashrate/1000).toFixed(2) + ' GH) for $' + prepurchase_info.total_cost + '?')
			})
			if (confirm_purchase.confirm){
				self.log(vorpal.chalk.cyan("Renting miners..."))
			} else {
				this.log(vorpal.chalk.red("Rental was aborted"))
			}

			return confirm_purchase.confirm
		})

		if (rent_manual.success){
			self.log(vorpal.chalk.green(`Successfully rented ${rent_manual.total_rigs_rented} miner(s) (${(rent_manual.total_hashrate/1000).toFixed(2)} GH) for $${rent_manual.total_cost}!`))
		} else {
			return this.log(vorpal.chalk.red("Unable to rent Miners! " + rent_manual))
		}
	});
}
