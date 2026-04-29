import { Label } from "./Label"
import { Title } from "../Title"

describe("binotype.Context.Label", () => {
	describe("Label.get", () => {
		it("should return a Label for a valid Title", () => {
			const title: Title = { short: "Short", long: "Long", "long-short": "LongShort" }
			const label = Label.get(title)
			expect(label).toMatchSnapshot()
		})

		it("should return undefined for undefined Title", () => {
			const label = Label.get(undefined)
			expect(label).toBeUndefined()
		})

		it("should return correct plain and formatted values", () => {
			const title: Title = { short: "S", long: "L", "long-short": "LS" }
			const label = Label.get(title)
			expect(label?.plain).toBe("S")
			expect(label?.formatted).toBe("L") // Implementation uses Title.get(title, "long")
		})
	})
})
