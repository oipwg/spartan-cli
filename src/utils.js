const timestring = require('timestring')

export function convertHumanTimeToSeconds(time) {
    return timestring(time)
}

export function convertHumanHashrateToMH(human_hashrate){
	const UNIT_SYMBOLS = [
		{
			"value": 0.001,
			"symbols": ["k", "kh", "K", "KH"]
		},
		{
			"value": 1,
			"symbols": ["m", "mh", "M", "MH"]
		},
		{
			"value": 1000,
			"symbols": ["g", "gh", "G", "GH"]
		},
		{
			"value": 1000000,
			"symbols": ["t", "th", "T", "TH"]
		}
	]

	let number_value = parseFloat(human_hashrate.match(/[0-9]+/)[0])
	let symbol_value = human_hashrate.match(/[a-zA-Z]+/)[0]

	for (let symbol of UNIT_SYMBOLS){
		if (symbol.symbols.indexOf(symbol_value) !== -1){
			return number_value * symbol.value
		}
	}
}

export const fmtPool = (pool, vorpal) => {
	return vorpal.chalk.white(`${vorpal.chalk.blue(pool.type)} ${vorpal.chalk.green(pool.host + ':' + pool.port)} ${vorpal.chalk.yellow(pool.name || null)} ${pool.user}`)
};

export const serPool = (pool) => {
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