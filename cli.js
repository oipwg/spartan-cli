const vorpal = require('vorpal')();
 
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
  .action(function(args, cb){
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
          message: 'Would you like to rent 2GH for $25.31 (25 Miners)?'
        })
      if (!result.continue) {
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