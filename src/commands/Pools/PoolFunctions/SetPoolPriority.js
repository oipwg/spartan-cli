export const SetPoolPriority = async (self, vorpal, spartan, profileID, pool, provider) => {
	let priorityPrompt = await self.prompt({
		type: 'list',
		name: 'option',
		message: 'Select an option: ',
		choices: ['0', '1', '2', '3', '4']
	})
	let priority = priorityPrompt.option

	let poolAPIObj = {profileID, poolid: pool.mrrID || pool.id, algo: pool.type, name: pool.name, priority}

	let res;
	try {
		res = await provider.updatePoolOnProfile(poolAPIObj)
	} catch (err) {
		throw new Error(`Failed to set priority on pool: ${err}`)
	}
	if (res.success)
		self.log(vorpal.chalk.yellow(`Updated`))
}