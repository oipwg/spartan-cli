export default function(vorpal, options){
	let spartan = options.SpartanBot;

	vorpal
		.command('pool list')
		.description('Selection of a rental provider that you wish to remove')
		.alias('pl')
		.action(async function(args) {
			const self = this;
			if (spartan.getRentalProviders().length === 0) {
				self.log(vorpal.chalk.red(`No rental providers found! Consider adding one by typing: rentalprovider add`));
				return
			}

			let pools;
			try {
				pools = await spartan.getPools()
			} catch (err) {
				self.log(vorpal.chalk.red("Failed to get pools: ", err))
				return
			}

			for (let pool of pools) {
				self.log(vorpal.chalk.blue(`${pool.id} ${pool.name} ${pool.host} ${pool.id} ${pool.port} ${pool.type}`))
			}

		});
}