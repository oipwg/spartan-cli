export default function(vorpal, options){
    let spartan = options.SpartanBot
    
    vorpal
	.command('wallet balence')
	.action(async function(args) {
        this.log(vorpal.chalk.cyan("Updating wallet balance..."))

        let balance = await spartan.getWalletBalance()

        this.log(balance.flo)
        
    })}