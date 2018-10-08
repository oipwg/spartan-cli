export const UpdatePool = async (self, vorpal, spartan, _pool) => {
	let poolV2 = {}
	for (let opt in _pool) {
		poolV2[opt] = _pool[opt]
	}

	const Done = vorpal.chalk.red(`Done`)
	let typePrompt = function(){};
	while (typePrompt.option !== Done) {

		// let type = `type: ${poolV2.type} `
		let name = `name: ${poolV2.name} `
		let host = `host: ${poolV2.host} `
		let port = `port: ${poolV2.port} `
		let user = `user: ${poolV2.user} `
		let pass = `pass: ${poolV2.pass} `
		let notes = `notes: ${poolV2.notes} `

		typePrompt = await self.prompt({
			type: 'list',
			message: vorpal.chalk.yellow('Select an option:'),
			name: 'option',
			choices: [name, host, port, user, pass, notes, Done]
		})
		let option = typePrompt.option
		let param = option.split(":")[0].toLowerCase()

		if (option === Done) {
			let exactMatch = true;
			for (let opt in poolV2) {
				for (let _opt in _pool) {
					if (opt === _opt) {
						if (poolV2[opt] !== _pool[_opt]) {
							exactMatch = false
						}
					}
				}
			}
			if (exactMatch) {
				self.log(vorpal.chalk.yellow('No changes. Exiting...'))
			} else {
				//account for multiple providers not having access to the same pool
				let updateRes
				try {
					updateRes = await spartan.updatePool(_pool.id, poolV2)
				} catch (err) {
					throw new Error(`Failed to update pool: ${err}`)
				}
			}
		} else {
			let updatePrompt = await self.prompt({
				type: 'input',
				message: vorpal.chalk.yellow(` ${param} `),
				name: 'input',
				default: poolV2[param]
			})
			poolV2[param] = updatePrompt.input
		}
	}

	spartan.serialize()
	return true
}
