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
		const badges = preprocess.badges
		if (badges.length === 0) {
			return {confirm: false, badges: undefined}
		}

		const statusBadges = {
			normal: vorpal.chalk.bgGreen.white('*NORMAL'),
			cutoff: vorpal.chalk.bgYellow.white('*CUTOFF'),
			extension: vorpal.chalk.bgBlue.white('*EXTENSION'),
			low_balance: vorpal.chalk.bgRed.white('*LOW_BALANCE')
		}

		const statusMessages = {
			normal: vorpal.chalk.bgGreen(`*NORMAL - Normal status. Provider found approx. what user requested.`),
			extension: vorpal.chalk.bgBlue(`*EXTENSION - Warning status. Minimum rental requirements apply. Duration will be extended.`),
			cutoff: vorpal.chalk.bgYellow(`*CUTOFF - Warning status. Attempt to bypass minimum rental requirements by cancelling at requested time. Application must remain running to cancel.`),
			low_balance: vorpal.chalk.bgRed(`*LOW_BALANCE - Warning status. Provider has low balance, cannot rent for desired duration/limit.`),
		}

		let statuses = {
			normal: false,
			extension: false,
			cutoff: false,
			low_balance: false
		}

		let badgesCopy = badges.map(obj => ({...obj}))

		//apply status text to badges
		let badgesObject = {}
		for (let badge of badgesCopy) {
			let statusText;
			if (badge.status.status === NORMAL) {
				statuses.normal = true
				statusText = statusBadges.normal
			}
			if (badge.status.status === WARNING) {
				if (badge.status.type === CUTOFF) {
					if (badge.cutoff) {
						badge.amount = badge.status.cutoffCost
						badge.duration = badge.status.desiredDuration
						statuses.cutoff = true
						statusText = statusBadges.cutoff
					} else {
						statuses.extension = true
						statusText = statusBadges.extension
					}
				}
				if (badge.status.type === LOW_BALANCE) {
					statuses.low_balance = true
					statusText = statusBadges.low_balance
				}
			}
			badge.statusText = statusText
			badgesObject[badge.id] = badge
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


