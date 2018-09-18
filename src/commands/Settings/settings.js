export default function(vorpal, options){
    let spartan = options.SpartanBot
    
    vorpal
	.command('settings')
	.action(async function(args) {
        spartan.getSettings()
        return this.log(spartan.settings)
    })
   }