export default function(vorpal, options){
    let spartan = options.SpartanBot;
    
    vorpal
    .command('wallet withdraw')
    .alias('wallet w')
    .description('Withdraw from your wallet')
	.action(async function(args) {
        let balance = await spartan.getWalletBalance(true)

        this.log(balance)

        let withdraw_amt = await this.prompt({
            type: "input",
            name: "address",
            message: vorpal.chalk.yellow('Enter your flo address') 

        })
        
        let new_address = withdraw_amt.address

        let confirm_withdraw = await this.prompt({
            type: "confirm",
            name: "confirm",
            message: vorpal.chalk.yellow(`Are you sure that you wish to to withdraw from ${balance.flo} to ${new_address}`)
        })
     
        if (confirm_withdraw.confirm){
        let new_address = options
            let withdraw = await spartan.withdrawFromWallet(options)
            
            if (withdraw){
                this.log(vorpal.chalk.green('Transaction has been sent!'))
            } else {
                this.log(vorpal.chalk.red('Error!'))
            }
        }
    })}