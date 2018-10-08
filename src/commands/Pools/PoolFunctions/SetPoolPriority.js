export const SetPoolPriority = async (self, vorpal, profileID, pool, provider) => {
	const exit = vorpal.chalk.red('exit')
	let priorityPrompt = await self.prompt({
		type: 'list',
		name: 'option',
		message: 'Set pool priority: ',
		choices: ['0', '1', '2', '3', '4', exit]
	})
	let priority = priorityPrompt.option
	if (priority === exit)
		return

	let poolAPIObj = {profileID, poolid: pool.mrrID || pool.id, algo: pool.type, name: pool.name, priority}

	let res;
	try {
		res = await provider.updatePoolOnProfile(poolAPIObj)
	} catch (err) {
		throw new Error(`Failed to set priority on pool: ${err}`)
	}
	if (res.success)
		self.log(vorpal.chalk.yellow(`Priority Set`))
}