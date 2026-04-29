import { binotype } from "./index"

describe("binotype.Mode", () => {
	it("should validate all Mode values", () => {
		binotype.Mode.values.forEach(value => {
			expect(binotype.Mode.is(value)).toBe(true)
		})
	})
	it("should reject invalid Mode values", () => {
		;["invalid", "", null, undefined].forEach(value => {
			expect(binotype.Mode.is(value as any)).toBe(false)
		})
	})
	describe("Mode.reduce", () => {
		it.each([
			[undefined, "full", "full"],
			["header", "header", "header"],
			["body", "header", undefined],
			["header", "body", undefined],
			["body", "body", "body"],
			["summary", "summary", "summary"],
			["header", "summary", undefined],
			["body", "summary", "summary"],
			["body", "list", undefined],
			["header", "list", "list"]
		])("should reduce %s with %s to %s", (mode, reduction, expected) => {
			expect(binotype.Mode.reduce(mode as any, reduction as any)).toBe(expected)
		})
	})
	describe("Mode.parse", () => {
		it("should parse valid values", () => {
			binotype.Mode.values.forEach(value => {
				expect(binotype.Mode.parse(value)).toBe(value)
			})
		})
		it("should return undefined for invalid values", () => {
			expect(binotype.Mode.parse("invalid")).toBeUndefined()
		})
	})
})
