const Hashrate = require('js-hashrate-parser');

function convertHumanTimeToSeconds(time) {
    switch(time) {
        

    }
}

function convertHumanHashrateToSeconds(human_hashrate){
 Hashrate.toString(human_hashrate)
}

module.exports = {
    convertHumanTimeToSeconds: convertHumanTimeToSeconds,
    convertHumanHashrateToSeconds: convertHumanHashrateToSeconds
}