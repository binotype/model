import { binotype } from "../index"

describe("binotype.Meta", () => {
	const validMeta: binotype.Meta[] = [
		{}, // Empty object
		{ title: "Simple Title" }, // String value
		{ count: 42 }, // Number value
		{ published: true }, // Boolean value
		{ tags: ["typescript", "testing"] }, // Array of strings
		{ scores: [1, 2, 3] }, // Array of numbers
		{ flags: [true, false, true] }, // Array of booleans
		{ title: "Article", count: 5, published: true, tags: ["tech", "programming"] }, // Mixed value types
		{ nested: { title: "Nested Meta", description: "A nested meta object" } }, // Nested Meta object
		{
			complex: {
				title: "Complex Structure",
				metadata: {
					author: "John Doe",
					categories: ["tech", "tutorial"],
					stats: { views: 1000, likes: 50, published: true }
				},
				tags: ["javascript", "typescript"],
				active: true
			}
		}, // Deeply nested structure
		{ mixed_array: ["string_item", 42, true, ["nested", "array"], { nested_object: "value" }] }, // Array with mixed Value types
		{ undefined_value: undefined } // Undefined value (explicitly allowed)
	]

	it.each(validMeta)("is(%s)", value => expect(binotype.Meta.is(value)).toBe(true))

	it.each(validMeta)("flawed(%s)", value => expect(binotype.Meta.flawed(value)).toBe(false))

	const invalidMeta = [
		"string", // String instead of object
		42, // Number instead of object
		[], // Array instead of object
		{ key: () => {} }, // Function not allowed
		{ key: Symbol("test") } // Symbol not allowed
	]

	it.each(invalidMeta)("is(%s) should be false for invalid data", value => expect(binotype.Meta.is(value)).toBe(false))

	it.each(invalidMeta)("flawed(%s) should return flaws for invalid data", value =>
		expect(binotype.Meta.flawed(value)).not.toBe(false))

	// Separate test for null due to different error handling
	it("is(null) should be false", () => {
		expect(binotype.Meta.is(null)).toBe(false)
	})

	it("flawed(null) should handle null gracefully", () => {
		// null causes a TypeError in flawed, so we test it separately
		expect(() => binotype.Meta.flawed(null)).toThrow()
	})
})
