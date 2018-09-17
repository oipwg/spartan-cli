const {convertHumanTimeToSeconds, convertHumanHashrateToSeconds} = require('./utils.js')

describe("convertHumanTimeToSeconds", () => {
    it("should set human time to seconds", () => {
      let human_time = "1h"
      convertHumanTimeToSeconds(human_time)
      expect(human_time).toBe(3600)
    })
})

