export const Prompt_RentalProviders = async (self, vorpal, spartan) => {
	return await self.prompt({
		type: 'list',
		name: 'rental_provider',
		message: vorpal.chalk.yellow('Which Rental Provider would you like to add?'),
		choices: spartan.getSupportedRentalProviders()
	});
};

export const Prompt_APIKeys = async (self, vorpal) => {
	return await self.prompt([
		{
			type: "input",
			name: "api_key",
			message: vorpal.chalk.yellow("Please enter your API Key: "),
			default: process.env.API_KEY
		},{
			type: "input",
			name: "api_secret",
			message: vorpal.chalk.yellow("Please enter your API Secret: "),
			default: process.env.API_SECRET
		}
	]);
};

export const Prompt_OptionalName = async (self, vorpal) => {
	return await self.prompt({
		type: "input",
		name: "name",
		message: vorpal.chalk.yellow("Add an optional name to your rental provider: "),
		default: 'undefined'
	});
};

export const Prompt_AddOrCreatePool = async (self, vorpal) => {
	return await self.prompt({
		type: 'list',
		name: 'option',
		message: vorpal.chalk.yellow("Would you like to add an existing pool or a create a new pool?"),
		choices: ['add', 'create']
	});
};

export const Prompt_AddPool = async (self, vorpal, poolArray) => {
	return await self.prompt({
		type: 'list',
		name: 'option',
		message: vorpal.chalk.yellow("Please choose a pool"),
		choices: poolArray
	});
}

export const Prompt_CreatePool = async (self, vorpal) => {
	let poolOptions = {};
	let profileName = await self.prompt({
		type: 'input',
		name: 'profileName',
		message: vorpal.chalk.yellow('Input a pool profile name: ')
	});
	poolOptions.profileName = profileName.profileName;

	let algo = await self.prompt({
		type: 'input',
		name: 'algo',
		message: vorpal.chalk.yellow('Input an algorithm to mine with (scrypt, x11, sha256, etc...) : '),
		default: 'scrypt'
	});
	poolOptions.algo = algo.algo;

	let host = await self.prompt({
		type: 'input',
		name: 'host',
		message: vorpal.chalk.yellow('Input a host url: '),
		default: 'snowflake.oip.fun'
	});
	poolOptions.host = host.host;

	let port = await self.prompt({
		type: 'input',
		name: 'port',
		message: vorpal.chalk.yellow('Input a port to mine on: '),
		default: 8080
	});
	poolOptions.port = port.port;

	let user = await self.prompt({
		type: 'input',
		name: 'user',
		message: vorpal.chalk.yellow('Input a wallet address to receive funds at: '),
		description: 'Your workname'
	});
	poolOptions.user = user.user;

	let priority = await self.prompt({
		type: 'list',
		name: 'priority',
		message: vorpal.chalk.yellow('What priority would you like this pool to be at?: '),
		choices: ['0', '1', '2', '3', '4']
	});
	poolOptions.priority = priority.priority;

	let pass = await self.prompt({
		type: 'input',
		name: 'pass',
		message: vorpal.chalk.yellow('Optionally add a password to the pool profile: '),
		default: undefined
	});
	poolOptions.notes = pass.pass;

	let notes = await self.prompt({
		type: 'input',
		name: 'notes',
		message: vorpal.chalk.yellow('Optionally add additional notes to the pool profile: '),
		default: undefined
	});
	poolOptions.notes = notes.notes;

	return poolOptions
};

