import rent from './rent'

const COMMANDS = [rent]

export default function(vorpal, options) {
	for (let command of COMMANDS) {
		command(vorpal, options)
	}
}
