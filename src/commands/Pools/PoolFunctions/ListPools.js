import {fmtPool, serPool} from "../../../utils";

export const ListPools = async (self, vorpal, spartan) => {
	const exit = vorpal.chalk.red(`exit`)

	let _pools;
	try {
		_pools = await spartan.getPools()
	} catch (err) {
		self.log(vorpal.chalk.red("Failed to get pools from MRR API: ", err))
		return
	}

	let fmtPoolArray = [];
	for (let pool of _pools) {
		fmtPoolArray.push(fmtPool(serPool(pool), vorpal))
	}

	let promptPools = await self.prompt({
		type: 'list',
		message: 'Select a pool:',
		name: 'choice',
		choices: [...fmtPoolArray, exit]
	});

	let chosenPool = promptPools.choice;
	if (chosenPool === exit)
		return exit

	let poolObj = {};
	for (let pool of _pools) {
		poolObj[fmtPool(serPool(pool), vorpal)] = pool.id
	}
	let poolid = poolObj[chosenPool];
	let _pool;
	for (let pool of _pools) {
		if (pool.id === poolid) {
			_pool = pool
		}
	}
	return _pool
}