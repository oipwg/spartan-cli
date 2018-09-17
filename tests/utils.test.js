import { convertHumanTimeToSeconds, convertHumanHashrateToMH } from "../src/utils"

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

	describe("Human Hashrate to Megahash", () => {
		describe("Megahash", () => {
			describe("lowercase no space", () => {
				test("1m => 1", () => {
					expect(convertHumanHashrateToMH("1m")).toBe(1)
				})
				test("2m => 2", () => {
					expect(convertHumanHashrateToMH("2m")).toBe(2)
				})
				test("1mh => 1", () => {
					expect(convertHumanHashrateToMH("1mh")).toBe(1)
				})
				test("2mh => 2", () => {
					expect(convertHumanHashrateToMH("2mh")).toBe(2)
				})
			})

			describe("lowercase space", () => {
				test("1 m => 1", () => {
					expect(convertHumanHashrateToMH("1 m")).toBe(1)
				})
				test("2 m => 2", () => {
					expect(convertHumanHashrateToMH("2 m")).toBe(2)
				})
				test("1 mh => 1", () => {
					expect(convertHumanHashrateToMH("1 mh")).toBe(1)
				})
				test("2 mh => 2", () => {
					expect(convertHumanHashrateToMH("2 mh")).toBe(2)
				})
			})

			describe("uppercase no space", () => {
				test("1M => 1", () => {
					expect(convertHumanHashrateToMH("1M")).toBe(1)
				})
				test("2M => 2", () => {
					expect(convertHumanHashrateToMH("2M")).toBe(2)
				})
				test("1MH => 1", () => {
					expect(convertHumanHashrateToMH("1MH")).toBe(1)
				})
				test("2MH => 2", () => {
					expect(convertHumanHashrateToMH("2MH")).toBe(2)
				})
			})

			describe("uppercase space", () => {
				test("1 M => 1", () => {
					expect(convertHumanHashrateToMH("1 M")).toBe(1)
				})
				test("2 M => 2", () => {
					expect(convertHumanHashrateToMH("2 M")).toBe(2)
				})
				test("1 MH => 1", () => {
					expect(convertHumanHashrateToMH("1 MH")).toBe(1)
				})
				test("2 MH => 2", () => {
					expect(convertHumanHashrateToMH("2 MH")).toBe(2)
				})
			})

			test("random# MH => random# * 1", () => {
				let megahash = parseInt(Math.random() * 10)
				if (megahash <= 1)
					megahash = 2

				let hash_string = megahash + " MH"

				expect(convertHumanHashrateToMH(hash_string)).toBe(megahash * 1)
			})
		})
		describe("Gigahash", () => {
			describe("lowercase no space", () => {
				test("1g => 1", () => {
					expect(convertHumanHashrateToMH("1g")).toBe(1000)
				})
				test("2g => 2", () => {
					expect(convertHumanHashrateToMH("2g")).toBe(2000)
				})
				test("1gh => 1", () => {
					expect(convertHumanHashrateToMH("1gh")).toBe(1000)
				})
				test("2gh => 2", () => {
					expect(convertHumanHashrateToMH("2gh")).toBe(2000)
				})
			})

			describe("lowercase space", () => {
				test("1 g => 1", () => {
					expect(convertHumanHashrateToMH("1 g")).toBe(1000)
				})
				test("2 g => 2", () => {
					expect(convertHumanHashrateToMH("2 g")).toBe(2000)
				})
				test("1 gh => 1", () => {
					expect(convertHumanHashrateToMH("1 gh")).toBe(1000)
				})
				test("2 gh => 2", () => {
					expect(convertHumanHashrateToMH("2 gh")).toBe(2000)
				})
			})

			describe("uppercase no space", () => {
				test("1G => 1", () => {
					expect(convertHumanHashrateToMH("1G")).toBe(1000)
				})
				test("2G => 2", () => {
					expect(convertHumanHashrateToMH("2G")).toBe(2000)
				})
				test("1GH => 1", () => {
					expect(convertHumanHashrateToMH("1GH")).toBe(1000)
				})
				test("2GH => 2", () => {
					expect(convertHumanHashrateToMH("2GH")).toBe(2000)
				})
			})

			describe("uppercase space", () => {
				test("1 G => 1", () => {
					expect(convertHumanHashrateToMH("1 G")).toBe(1000)
				})
				test("2 G => 2", () => {
					expect(convertHumanHashrateToMH("2 G")).toBe(2000)
				})
				test("1 GH => 1", () => {
					expect(convertHumanHashrateToMH("1 GH")).toBe(1000)
				})
				test("2 GH => 2", () => {
					expect(convertHumanHashrateToMH("2 GH")).toBe(2000)
				})
			})

			test("random# GH => random# * 1", () => {
				let gigahash = parseInt(Math.random() * 10)
				if (gigahash <= 1)
					gigahash = 2

				let hash_string = gigahash + " GH"

				expect(convertHumanHashrateToMH(hash_string)).toBe(gigahash * 1000)
			})
		})
	})
})