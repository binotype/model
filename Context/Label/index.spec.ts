import { Clean } from "../../Clean"
import { binotype } from "../../index"

describe("binotype.Context.Label", () => {
	describe("Label.get", () => {
		it("should return a Label for a valid Title", () => {
			const title: binotype.Title<string> = { short: "Short", long: "Long" }
			const label = binotype.Context.Label.get(title)
			expect(Clean.clean(label)).toMatchSnapshot()
		})

		it("should return undefined for undefined Title", () => {
			const label = binotype.Context.Label.get(undefined)
			expect(label).toBeUndefined()
		})

		it("should return correct plain and formatted values", () => {
			const title: binotype.Title<string> = { short: "S", long: "L" }
			const label = binotype.Context.Label.get(title)
			expect(label?.plain).toBe("S")
			expect(label?.formatted).toBe("L") // Implementation uses Title.get(title, "long")
		})
	})
})
