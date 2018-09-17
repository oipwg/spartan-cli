const Utils = require("../src/utils")

const convertHumanTimeToSeconds = Utils.convertHumanTimeToSeconds
const convertHumanHashrateToSeconds = Utils.convertHumanHashrateToSeconds

describe("Utils", () => {
	describe("HumanTime to Seconds", () => {
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
		test("random# hours => random# * 3600", () => {
			let hours = parseInt(Math.random() * 10)
			if (hours <= 1)
				hours = 2

			let time_string = hours + " hours"

			expect(convertHumanTimeToSeconds(time_string)).toBe(hours * 3600)
		})
	})
})