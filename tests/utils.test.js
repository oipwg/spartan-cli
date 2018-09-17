const Utils = require("../src/utils")

const convertHumanTimeToSeconds = Utils.convertHumanTimeToSeconds
const convertHumanHashrateToSeconds = Utils.convertHumanHashrateToSeconds

describe("Utils", () => {
	describe("HumanTime to Seconds", () => {
		describe("Convert Hours", () => {
			test("1h => 3600", () => {
				expect(convertHumanTimeToSeconds("1h")).toBe(3600)
			})
			test("2h => 7200", () => {
				expect(convertHumanTimeToSeconds("2h")).toBe(7200)
			})
			test("1 h => 3600", () => {
				expect(convertHumanTimeToSeconds("1 h")).toBe(3600)
			})
			test("2 h => 7200", () => {
				expect(convertHumanTimeToSeconds("2 h")).toBe(7200)
			})
			test("1 hour => 3600", () => {
				expect(convertHumanTimeToSeconds("1 hour")).toBe(3600)
			})
			test("2 hours => 7200", () => {
				expect(convertHumanTimeToSeconds("2 hours")).toBe(7200)
			})
			test("10 hours => 36,000", () => {
				expect(convertHumanTimeToSeconds("10 hours")).toBe(36000)
			})
			test("10 hours => 36,000", () => {
				expect(convertHumanTimeToSeconds("10 h")).toBe(36000)
			})
			test("10 hours => 36,000", () => {
				expect(convertHumanTimeToSeconds("10h")).toBe(36000)
			})
			test("random# hours => random# * 3600", () => {
				let hours = parseInt(Math.random() * 10)
				if (hours <= 1)
					hours = 2

				let time_string = hours + " hours"

				expect(convertHumanTimeToSeconds(time_string)).toBe(hours * 3600)
			})
		})
			describe("Convert Days ", () => {
			test("1 day => 86,400", () => {
				expect(convertHumanTimeToSeconds("1 day")).toBe(86400)
			})
			test("1 day => 86,400", () => {
				expect(convertHumanTimeToSeconds("1 d")).toBe(86400)
			})
			test("1 day => 86,400", () => {
				expect(convertHumanTimeToSeconds("1d")).toBe(86400)
			})
			test("random# days => random# * 86400", () => {
				let days = parseInt(Math.random() * 10)
				if (days <= 1)
					days = 2

				let time_string = days + " days"

				expect(convertHumanTimeToSeconds(time_string)).toBe(days * 86400)
			})
		})
		describe("Convert Weeks ", () => {
			test("1 week => 604,800", () => {
				expect(convertHumanTimeToSeconds("1 week")).toBe(604800)
			})
			test("1 week => 604,800", () => {
				expect(convertHumanTimeToSeconds("1w")).toBe(604800)
			})
			test("1 week => 604,800", () => {
				expect(convertHumanTimeToSeconds("1 w")).toBe(604800)
			})
			test("random# weeks => random# * 604800", () => {
				let weeks = parseInt(Math.random() * 10)
				if (weeks <= 1)
					weeks = 2

				let time_string = weeks + " weeks"

				expect(convertHumanTimeToSeconds(time_string)).toBe(weeks * 604800)
			})
		})
	})
})

describe("Utils", () => {
	describe("HumanHash to Seconds", () => {
		describe("test parse mh", () => {
			test("1m => 1", () => {
				expect(convertHumanHashrateToSeconds("1 H/s")).toBe(1)
			})
			test("2m => 2", () => {
				expect(convertHumanHashrateToSeconds("2 H/s")).toBe("2")
			})
			test("1 m => m", () => {
				expect(convertHumanHashrateToSeconds("1 H/s")).toBe(1)
			})
			test("2 m => 2", () => {
				expect(convertHumanHashrateToSeconds("2 H/s")).toBe(2)
			})
			test("1 m => 1", () => {
				expect(convertHumanHashrateToSeconds("1 H/s")).toBe(1)
			})
			test("2 hours => 2", () => {
				expect(convertHumanHashrateToSeconds("2 H/s")).toBe(2)
			})
			test("rando# mh => random# * 1", () => {
				let hashes = parseInt(Math.random() * 10)
				if (hashes <= 1)
					hashes = 2

				let hash_string = hashes + " M"

				expect(convertHumanHashrateToSeconds(hash_string)).toBe(hashes * 1)
			})
		})
	})
})