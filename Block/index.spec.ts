import { isly } from "isly"
import { binotype } from "../index"

describe("binotype.Block", () => {
	it.each([
		{ name: "minimal block with string content", block: { content: "Sample content" } },
		{ name: "minimal block with empty string content", block: { content: "" } },
		{
			name: "block with all optional properties",
			block: { weight: 10, title: "Section Title", menu: false, type: "article", content: "Full section content" }
		},
		{
			name: "block with title as object",
			block: { title: { short: "Short", long: "Long Title" }, content: "Content with object title" }
		},
		{
			name: "block with nested blocks as content",
			block: {
				weight: 5,
				blocks: {
					subsection1: { content: "Nested content 1" },
					subsection2: { title: "Sub Title", content: "Nested content 2" }
				}
			}
		},
		{
			name: "block with deeply nested blocks",
			block: { blocks: { level1: { blocks: { level2: { content: "Deep nesting works" } } } } }
		},
		{ name: "block with zero weight", block: { weight: 0, content: "Zero weight section" } },
		{
			name: "block with explicit undefined optional properties",
			block: {
				weight: undefined,
				title: undefined,
				menu: undefined,
				type: undefined,
				content: "Explicit undefined properties"
			}
		},
		{ name: "missing content property", block: { weight: 10, title: "Title" } },
		{ name: "null as content", block: { content: null } },
		{ name: "array as content", block: { content: ["not", "allowed"] } },
		{ name: "completely empty object", block: {} }
	])("is valid: $name", ({ block }) => expect(binotype.Block.getType(isly.string()).is(block)).toBe(true))

	it.each([
		{ name: "number as content", block: { content: 123 } },
		{ name: "invalid weight as string", block: { weight: "10", content: "Valid content" } },
		{ name: "invalid weight as null", block: { weight: null, content: "Valid content" } },
		{ name: "invalid title as number", block: { title: 123, content: "Valid content" } },
		{ name: "invalid title object missing short", block: { title: { long: "Long only" }, content: "Valid content" } },
		{ name: "invalid title object missing long", block: { title: { short: "Short only" }, content: "Valid content" } },
		{ name: "invalid menu as true", block: { menu: true, content: "Valid content" } },
		{ name: "invalid menu as string", block: { menu: "false", content: "Valid content" } },
		{ name: "invalid type as number", block: { type: 123, content: "Valid content" } },
		{ name: "invalid type as boolean", block: { type: true, content: "Valid content" } },
		{
			name: "nested section with invalid content",
			block: {
				blocks: {
					subblock: {
						content: 123 // invalid content type
					}
				}
			}
		},
		{ name: "null object", block: null },
		{ name: "undefined object", block: undefined },
		{ name: "string instead of object", block: "not an object" },
		{ name: "array instead of object", block: [] }
	] satisfies { name: string; block: any }[])("is invalid: $name", ({ block }) => {
		expect(binotype.Block.getType(isly.string()).is(block)).toBe(false)
	})
})
