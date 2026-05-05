import { binotype } from "./index"

describe("binotype.Title", () => {
	describe("from", () => {
		it.each([
			{ short: "Hi", long: "Long content", expected: { short: "Hi", long: "Long content" } },
			{ short: "Hi", long: undefined, expected: "Hi" },
			{ short: undefined, long: "Long content", expected: undefined },
			{ short: undefined, long: undefined, expected: undefined }
		])("from($short, $long)", ({ short, long, expected }) => expect(binotype.Title.from(short, long)).toEqual(expected))
	})
})
