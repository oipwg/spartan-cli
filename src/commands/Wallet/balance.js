export default function(vorpal, options){
    let spartan = options.SpartanBot
    
    vorpal
	.command('wallet balance')
	.action(async function(args) {
        this.log(vorpal.chalk.cyan("Updating wallet balance..."))

		let balance;
		try {
        	balance = await spartan.getWalletBalance()
		} catch (err) {
			balance = `Could not fetch balance \n ${err}`
		}
        this.log(balance)
    })}