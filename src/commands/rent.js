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
				message: 'How much Hashrate would you like to rent? '
			},
			{
				type: 'input',
				name: 'duration',
				default: '1h',
				message: 'How long would you like SpartanBot to run? '
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
				message: 'Do you want to rent 13 miners for $' + prepurchase_info.total_cost.toFixed(2) + '?'
			})
			return confirm_purchase 
		})

		self.log("rental status: ", rent_manual)
	});
}