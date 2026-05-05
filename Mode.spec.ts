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
			{ mode: undefined, reduction: "none", expected: "none" },
			{ mode: "body", reduction: "none", expected: "none" },
			{ mode: undefined, reduction: "full", expected: "full" },
			{ mode: "header", reduction: "header", expected: "header" },
			{ mode: "body", reduction: "header", expected: undefined },
			{ mode: "header", reduction: "body", expected: undefined },
			{ mode: "body", reduction: "body", expected: "body" },
			{ mode: "summary", reduction: "summary", expected: "summary" },
			{ mode: "header", reduction: "summary", expected: undefined },
			{ mode: "body", reduction: "summary", expected: "summary" }
		] satisfies {
			mode: binotype.Mode | undefined
			reduction: binotype.Mode
			expected: binotype.Mode | undefined
		}[])("($mode, $reduction) == $expected", ({ mode, reduction, expected }) => {
			expect(binotype.Mode.reduce(mode, reduction)).toBe(expected)
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
