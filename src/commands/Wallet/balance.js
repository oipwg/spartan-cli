export default function(vorpal, options){
    let spartan = options.SpartanBot
    
    vorpal
	.command('wallet balance')
	.alias('wallet b')
	.description('check the balance of your wallets')
	.action(async function(args) {
		this.log(vorpal.chalk.cyan("Updating wallet balance..."))
		
		let balance = await spartan.getWalletBalance()

		this.log(balance)
	})
}