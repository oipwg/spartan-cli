const vorpal = require('vorpal')();
const { SpartanBot } = require('spartanbot')
const {convertHumanTimeToSeconds, convertHumanHashrateToSeconds} = require('./utils.js')
let spartan = new SpartanBot();

vorpal
	.delimiter('spartan-cli$')
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
				default: '1d, 1hr',
				message: 'How long would you like SpartanBot to run? '
			}
		];

		var answers = await this.prompt(questions);

		hashrate = convertHumanHashrateToSeconds(answers.hashrate);
		duration = convertHumanTimeToSeconds(answers.duration);
		console.log(hashrate)
		var rent_manual = await spartan.manualRental(hashrate, duration, async (prepurchase_info) => {
			//self.log("prepurchase", prepurchase_info)
			var confirm_purchase = await self.prompt({
				type: 'confirm',
				name: 'confirm',
				message: 'Do you want to rent 13 miners for $' + prepurchase_info.total_cost.toFixed(2) + '?'
			})

			return confirm_purchase
		})

		self.log("rental status: ", rent_manual)
	});
	 
vorpal.show()
	