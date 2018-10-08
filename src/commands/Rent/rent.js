import {manualRentPrompt} from "./manualRent";
import {
	convertHumanHashrateToMH,
	convertHumanTimeToSeconds
} from '../../utils'

export default function(vorpal, options){
	let spartan = options.SpartanBot

	vorpal
	.command('rent')
	.description('Manually rent a miner')
	.action(async function (args, cb) {
		const self = this;
		const exit = vorpal.chalk.red(`exit`)

		let rental_providers = spartan.getRentalProviders()

		if (rental_providers.length === 0){
			return this.log(vorpal.chalk.yellow("No Rental Providers were found! Please run '") + vorpal.chalk.cyan("rentalprovider add") + vorpal.chalk.yellow("' to add your API keys."))
		}

		let promptRentType = await self.prompt({
			type: 'list',
			name: 'option',
			message: vorpal.chalk.yellow('Select a rent option:'),
			choices: ['Manual', 'Spot', 'Tradebot', 'Collective Defense', exit]
		})
		let rentType = promptRentType.option;

		if (rentType === exit)
			return

		if (rentType === 'Manual') {
			await manualRentPrompt(self, vorpal, spartan)
		}

		if (rentType === 'Spot') {

		}

		if (rentType === 'Tradebot') {

		}

		if (rentType === 'Collective Defense') {

		}

	});
}
