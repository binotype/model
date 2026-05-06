import { Clean } from "."

describe("Clean", () => {
	describe("clean", () => {
		it.each([
			{
				name: "remove undefined, null, and empty arrays",
				input: { a: 1, b: undefined, c: null, d: [], e: [1] },
				expected: { a: 1, e: [1] }
			},
			{
				name: "clean nested objects",
				input: { top: { keep: "value", removeUndefined: undefined, removeNull: null, emptyList: [] } },
				expected: { top: { keep: "value" } }
			},
			{
				name: "remove null and undefined items from arrays",
				input: { values: [1, undefined, null, 2], nested: [{ x: 1, y: undefined }, { x: 2 }] },
				expected: { values: [1, 2], nested: [{ x: 1 }, { x: 2 }] }
			},
			{ name: "remove top-level empty object", input: {}, expected: undefined },
			{
				name: "remove nested empty objects",
				input: { keep: { value: 1 }, remove: {}, list: [{ keep: 1 }, {}, { remove: undefined }] },
				expected: { keep: { value: 1 }, list: [{ keep: 1 }] }
			}
		])("$name", ({ input, expected }) => {
			expect(Clean.clean(input)).toEqual(expected)
		})
	})
})
