export default function(vorpal, options){
    let spartan = options.SpartanBot

    vorpal
    .command('settings')
    .description('List and modify settings')
    .alias('setup')
	.action(async function() {
	    const self = this
        let settings = {...spartan.getSettings()}


    })
   }
