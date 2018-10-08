import {CreatePool} from "./PoolFunctions/CreatePool";

export default function(vorpal, options){
	let spartan = options.SpartanBot

	vorpal
		.command('pool create')
		.description('Create a pool')
		.alias('pc')
		.action(async function(args) {
			const self = this;
			if (spartan.getRentalProviders().length === 0) {
				return this.log(vorpal.chalk.yellow("No Rental Providers were found! Please run '") + vorpal.chalk.cyan("rentalprovider add") + vorpal.chalk.yellow("' to add your API keys."))
			}
			return await CreatePool(self, vorpal, spartan)
		});
}