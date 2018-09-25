export const PromptCreatePool = async () => {
	let poolOptions = {};
	let profileName = await this.prompt({
		type: 'input',
		name: 'profileName',
		message: vorpal.chalk.yellow('Input a pool profile name: ')
	});
	poolOptions.profileName = profileName.profileName;

	let algo = await this.prompt({
		type: 'input',
		name: 'algo',
		message: vorpal.chalk.yellow('Input an algorithm to mine with (scrypt, x11, sha256, etc...) : '),
		default: 'scrypt'
	});
	poolOptions.algo = algo.algo;

	let host = await this.prompt({
		type: 'input',
		name: 'host',
		message: vorpal.chalk.yellow('Input a host url: '),
		default: 'snowflake.oip.fun'
	});
	poolOptions.host = host.host;

	let port = await this.prompt({
		type: 'input',
		name: 'port',
		message: vorpal.chalk.yellow('Input a port to mine on: '),
		default: 8080
	});
	poolOptions.port = port.port;

	let user = await this.prompt({
		type: 'input',
		name: 'user',
		message: vorpal.chalk.yellow('Input a wallet address to receive funds at: '),
		description: 'Your workname'
	});
	poolOptions.user = user.user;

	let priority = await this.prompt({
		type: 'list',
		name: 'priority',
		message: vorpal.chalk.yellow('What priority would you like this pool to be at?: '),
		choices: ['0', '1', '2', '3', '4']
	});
	poolOptions.priority = priority.priority;

	let pass = await this.prompt({
		type: 'input',
		name: 'pass',
		message: vorpal.chalk.yellow('Optionally add a password to the pool profile: '),
		default: undefined
	});
	poolOptions.notes = pass.pass;

	let notes = await this.prompt({
		type: 'input',
		name: 'notes',
		message: vorpal.chalk.yellow('Optionally add additional notes to the pool profile: '),
		default: undefined
	});
	poolOptions.notes = notes.notes;

	return poolOptions
};