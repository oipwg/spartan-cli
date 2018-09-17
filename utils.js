var bytes = require('bytes');

function convertHumanTimeToSeconds(human_time){
    if (human_time === "1h" | "1 h" | "1 hour") {
        return 3600
    } else {
        if (human_time === "10h" | "10 h" | "10 hours") {
         return 36000
        } else {
            if (human_time === "1d" | "1 d" | "1 day"){
                return 86400
            } else {
                if (human_time === "1w" | "1 week"){
                    return 604800
                }
            }
        }
    }
}

function convertHumanHashrateToSeconds(human_hashrate){
    if (human_hashrate === "1000k" | "1000kh" | "1000 k" || "1000 kh" | "1m" | "1 m" | "1mh" | "1 mh") {
        return 1
    } else {
        if (human_hashrate === "1g" | "1gh" | "1 g" | "1 gh") {
            return 1000
        } else {
            if (human_hashrate === "1t" | "1th" | "1 t" | "1 th"){
                return 100000
            } else {
            }
        }
    }
}

module.exports = {
    convertHumanTimeToSeconds: convertHumanTimeToSeconds,
    convertHumanHashrateToSeconds: convertHumanHashrateToSeconds
}