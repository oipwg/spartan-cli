export default function(vorpal, options){
	let spartan = options.SpartanBot

	vorpal
		.command('pool delete')
		.description('Selection of a rental provider that you wish to remove')
		.alias('pd')
		.action(async function(args) {
			const self = this;
			if (spartan.getRentalProviders().length === 0) {
				self.log(vorpal.chalk.red(`No rental providers found! Consider adding one by typing: rentalprovider add`));
				return;
			}

			self.log('Add pool');
			//fetch pools
			//list them
			//pick one
			//add that pool to all rental providers local variables
			//set that pool to the active profile for all providers

		});
}