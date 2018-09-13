const vorpal = require('vorpal')();
 
vorpal
  .command('setup', 'Users API key will be set.')
  .action(function(args, callback) {
    this.log('bars');
    callback();
  });
 
  vorpal
  .command('rent 5G for 24HR', '5Gs will be rented for 24HR.')
  .action(function(args, callback) {
    this.log('bars');
    callback();
  });

vorpal
  .delimiter('Spartan-Cli$')
  .show();