export default function(vorpal, options){
	let spartan = options.SpartanBot;

	vorpal
		.command('pool list')
		.description('Selection of a rental provider that you wish to remove')
		.alias('pl')
		.action(async function(args) {
			const self = this;
			if (spartan.getRentalProviders().length === 0) {
				self.log(vorpal.chalk.red(`No rental providers found! Add one by typing: rentalprovider add`));
				return
			}

			let pools;
			try {
				pools = await spartan.returnPools()
			} catch (err) {
				self.log(vorpal.chalk.red("Failed to get pools: ", err))
				return
			}

			const printPool = (pool) => {
				self.log(vorpal.chalk.white(`${vorpal.chalk.blue(pool.type)} ${vorpal.chalk.green(pool.host + ':' + pool.port)} ${vorpal.chalk.yellow(pool.name)} ${pool.user}`))
			};

			const fmtPool = (pool) => {
				let tmpObj = {}
				for (let opt in pool) {
					if (opt === 'algo') {
						tmpObj.type = pool[opt]
					} else if (opt === 'pool_host') {
						tmpObj.host = pool[opt]
					} else if (opt === 'pool_port') {
						tmpObj.port = pool[opt]
					} else if (opt === 'pool_user') {
						tmpObj.user = pool[opt]
					} else if (opt === 'pool_pass') {
						tmpObj.pass = pool[opt]
					} else {
						tmpObj[opt] = pool[opt]
					}
				}
				return tmpObj
			};


			for (let pool of pools) {
				printPool(fmtPool(pool))
			}

		});
}