export default function(vorpal, options){
    let spartan = options.SpartanBot
    
    vorpal
    .command('settings list')
    .description('Listing of all settings that have been set')
    .alias('s list')
	.action(async function(args) {
        let settings = spartan.getSettings()

        for (let setting in settings){
            let add_string = vorpal.chalk.cyan(settings[setting])

            if (settings[setting] === true)
                add_string = vorpal.chalk.green(settings[setting])
            else if (settings[setting] === false)
                add_string = vorpal.chalk.red(settings[setting])
            

            this.log(vorpal.chalk.bgBlack(setting) + ": " + add_string)
            
        }
    })
   }