const Hashrate = require('js-hashrate-parser');
const timestring = require('timestring')

function convertHumanTimeToSeconds(time) {
    return timestring(time)
}

function convertHumanHashrateToSeconds(human_hashrate){
    return Hashrate.parse(human_hashrate)
}

module.exports = {
    convertHumanTimeToSeconds: convertHumanTimeToSeconds,
    convertHumanHashrateToSeconds: convertHumanHashrateToSeconds
}