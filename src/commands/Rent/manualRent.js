const NORMAL = "NORMAL"
const WARNING = "WARNING"
const CUTOFF = "CUTOFF"
const LOW_BALANCE = "LOW_BALANCE"

export const manualRentPrompt = async (self, vorpal, spartan) => {
	const exit = vorpal.chalk.red('exit')
	const questions = [
		{
			type: 'input',
			name: 'hashrate',
			default: '5000',
			message: vorpal.chalk.yellow('How much Hashrate would you like to rent (MH)? ')
		},
		{
			type: 'input',
			name: 'duration',
			default: '3',
			message: vorpal.chalk.yellow('How long would you like to rent your miner? (hours) ')
		}
	];

	let answers = await self.prompt(questions);

	let hashrate = answers.hashrate
	let duration = answers.duration

	self.log(vorpal.chalk.cyan("Searching for miners..."))

	let rentals = await spartan.manualRental(hashrate, duration, async (preprocess, options) => {
		let badges = preprocess.badges
		let badgeArray = []
		let badgesObject = {}
		if (Array.isArray(badges)) {
			for (let badge of badges) {
				badgeArray.push(badge)
				badgesObject[badge.uid] = badge
			}
		} else {
			badgeArray.push(badges)
			badgesObject[badges.uid] = badges
		}

		const fmtPool = (badge, vorpal) => {
			return `Rent: ${vorpal.chalk.red(badge.market)}: ${vorpal.chalk.green(`${(badge.amount).toFixed(6)}`)}BTC ${vorpal.chalk.white('@')} ${vorpal.chalk.yellow(badge.limit*1000*1000)}MH ${vorpal.chalk.white('for')} ${vorpal.chalk.yellow(`${badge.duration}`)} hours`
		};
		let fmtBadges = []

		let fmtObject = {}
		for (let badge of badges) {
			fmtBadges.push(fmtPool(badge, vorpal))
			fmtObject[badge.uid] = fmtPool(badge, vorpal)
		}


		let rentPrompt = await self.prompt({
			type: 'list',
			message: vorpal.chalk.yellow('Select from the following: '),
			name: 'options',
			choices: [...fmtBadges, exit]
		})
		let selection = rentPrompt.options

		let confirm = true
		let badgeUID;
		let _badge

		if (selection !== exit) {
			let confirmationPrompt = await self.prompt({
				type: 'confirm',
				message: vorpal.chalk.green('Are you sure you sure?'),
				default: false,
				name: 'confirm'
			})
			let confirmation = confirmationPrompt.confirm
			if (!confirmation) {
				confirm = false
			} else {
				for (let uid in fmtObject) {
					if (fmtObject[uid] === selection)
						badgeUID = uid
				}
				for (let uid in badgesObject) {
					if (uid === badgeUID)
						_badge = badgesObject[uid]
				}
			}
		} else {
			confirm = false
		}
		return {
			confirm,
			badges: _badge
		}
	})

	if (!rentals.success) {
		self.log(vorpal.chalk.red(`${rentals.message}`))
	} else {
		for (let rental of rentals) {
			self.log(`Rental Success: ` + vorpal.chalk.yellow(`${rental.market}. BTC ${vorpal.chalk.green(`${rental.amount}`)}. Hash ${vorpal.chalk.red(`${rental.limit*1000000}`)} @ ${rental.price}BTC/TH/HR`))
		}
	}
}


