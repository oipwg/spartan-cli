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
				default: '5G',
				message: vorpal.chalk.yellow('How much Hashrate would you like? ')
			},
			{
				type: 'input',
				name: 'duration',
				default: '1h',
				message: vorpal.chalk.yellow('How long would you like to rent your miner? ')
			}
		];

		var answers = await this.prompt(questions);

		console.log(answers)

		let converted_hashrate = convertHumanHashrateToMH(answers.hashrate);
		let converted_duration = convertHumanTimeToSeconds(answers.duration);
		var rent_manual = await spartan.manualRental(converted_hashrate, converted_duration, async (prepurchase_info) => {
			self.log("prepurchase", prepurchase_info)
			var confirm_purchase = await self.prompt({
				type: 'confirm',
				name: 'confirm',
				message: vorpal.chalk.yellow('Do you want to rent ' + prepurchase_info.total_rigs + ' miners for $' + prepurchase_info.total_cost.toFixed(2) + '?')
			})
			if (confirm_purchase.confirm){
				return self.log(vorpal.chalk.green("rental status: ", rent_manual.info + " !"))
				} else {
					this.log(vorpal.chalk.red(" Rental was aborted"))
				}
		
		
			})
	});
}
