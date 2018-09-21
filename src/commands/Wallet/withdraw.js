export default function(vorpal, options){
    let spartan = options.SpartanBot;
    
    vorpal
    .command('wallet withdraw')
    .alias('wallet w')
	.action(async function(args) {
		this.log("This functionality does not exist yet");
    })}