
export default function(vorpal, options){
    let spartan = options.SpartanBot
    
    vorpal
	.command('settings modify')
	.action(async function(args) {
        let modified_setting = await this.prompt([
            {
                type:'list',
                name: 'default_settings',
                message: vorpal.chalk.yellow('What settings would you like to change?'),
                choices: Object.keys(spartan.getSettings())
            },{
                type: "input",
                name: "changed_setting",
                message: vorpal.chalk.yellow("What would you like to replace this setting with?")
            }
        ]);

        let modifed_setting_value = modified_setting.changed_setting

        if (modifed_setting_value === "true")
            modifed_setting_value = true
         if (modifed_setting_value === "false")
            modifed_setting_value = false

        try {
            await spartan.setSetting(modified_setting.default_settings, modifed_setting_value)
           
            this.log(vorpal.chalk.green(modified_setting.default_settings + " has been updated to " + modifed_setting_value))
        } catch (e) {
            this.log(vorpal.chalk.red("Error! Settings were not updated\n" + e))
        }
    })
}