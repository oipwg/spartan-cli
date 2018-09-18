export default function(vorpal, options){
    let spartan = options.SpartanBot
    
    vorpal
	.command('settings list')
	.action(async function(args) {
        let settings = spartan.getSettings()

        for (let setting in settings){
            // let add_string = vorpal.chalk.cyan(settings[setting])
            if (settings[setting] === true){
                this.log(vorpal.chalk.magenta(setting) + ": " + vorpal.chalk.green(settings[setting]))

            } else if (settings[setting] === false){
                this.log(vorpal.chalk.magenta(setting) + ": " + vorpal.chalk.red(settings[setting]))

            } else if (settings[setting])
            this.log(vorpal.chalk.magenta(setting) + ": " + vorpal.chalk.cyan(settings[setting]))
            
        }
    })
   }