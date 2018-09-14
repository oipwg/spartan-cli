const vorpal = require('vorpal')();
const { SpartanBot } = require('spartanbot')

let spartan = new SpartanBot();

let setup_provider, rent_manual;

async function SetupFunction() {
  setup_provider = await spartan.setupRentalProvider({ 
    type: "MiningRigRentals",
    api_key: "my-api-key",
    api_secret: "my-api-secret"
  });
  // 1 = 1MH
  // 1000 = 1GH
  let hashrate = 1000
  // 60 seconds * 60 minutes * 24 hours = one day
  let duration_seconds = 60 * 60 * 24 
  rent_manual = await spartan.manualRental(hashrate, duration_seconds, async (prepurchase_info) => {
    console.log(prepurchase_info)
    // Prompt the user to figure out if they want to confirm the purchase
  
  
    // return `true` if the user is ok buying, and `false` if the user is not okay purchasing
    return true
  })
}
SetupFunction()
  .then( () => {
    console.log(`SP: ${JSON.stringify(setup_provider, null, 4)} and RM: ${JSON.stringify(rent_manual, null, 4)}`)
  })
  .catch( err => {
    console.log('err: ', err)
  })


vorpal
  .command('setup', 'Users API key will be set.')
  .action(function(args, callback) {
    this.log('bars');
    callback();
    hr.ask(function(answer){
      console.log(answer)
    })
  });
 
  vorpal.command('rent')
  .action(function(args, callback){
    const self = this;
    return this.prompt([
      {
        type: 'input',
        name: 'hashrate',
        default: '5G',
        message: 'How much Hashrate would you like to rent?'
      },
      {
        type: 'input',
        name: 'duration',
        default: '1000',
        message: 'How long would you like SpartanBot to run?'
      },
    ], 
    function(result){
      return self.prompt({
          type: 'confirm',
          name: 'confirm',
          message: `Would you like to rent ${"2GH"} for ${"$25.31"} (${25} Miners)?`
        })
      if (!result.confirm) {
        self.log('Good move.');
        cb();
      } else {
        self.log('Time to dust off that resume.');
      }
    });
  });

  vorpal
  .command('foo <requiredArg> [optionalArg]')
  .option('-v, --verbose', 'Print foobar instead.')
  .description('Outputs "bar".')
  .alias('foosball')
  .action(function(args, callback) {
    if (args.options.verbose) {
      this.log('foobar');
    } else {
      this.log('bar');
    }
    callback();
  });

vorpal
  .delimiter('spartan-cli$')
  .show();