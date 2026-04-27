import { binotype } from "../index"
import { Fragment, h } from "@stencil/core"

describe("binotype.Block", () => {
	it.each([
		{ name: "minimal block with string content", block: { content: <Fragment>Sample content</Fragment> } },
		{ name: "minimal block with empty string content", block: { content: <Fragment></Fragment> } },
		{
			name: "block with all optional properties",
			block: {
				weight: 10,
				title: "Section Title",
				menu: false,
				type: "article",
				content: <Fragment>Full section content</Fragment>
			}
		},
		{
			name: "block with title as object",
			block: {
				title: { short: "Short", long: <Fragment>Long Title</Fragment> },
				content: <Fragment>Content with object title</Fragment>
			}
		},
		{
			name: "block with nested blocks as content",
			block: {
				weight: 5,
				blocks: {
					subsection1: { content: <Fragment>Nested content 1</Fragment> },
					subsection2: { title: "Sub Title", content: <Fragment>Nested content 2</Fragment> }
				}
			}
		},
		{
			name: "block with deeply nested blocks",
			block: { blocks: { level1: { blocks: { level2: { content: <Fragment>Deep nesting works</Fragment> } } } } }
		},
		{ name: "block with zero weight", block: { weight: 0, content: <Fragment>"Zero weight section"</Fragment> } },
		{
			name: "block with explicit undefined optional properties",
			block: {
				weight: undefined,
				title: undefined,
				menu: undefined,
				type: undefined,
				content: <Fragment>Explicit undefined properties</Fragment>
			}
		},
		{ name: "missing content property", block: { weight: 10, title: "Title" } },
		{ name: "null as content", block: { content: null } },
		{ name: "completely empty object", block: {} }
	])("is valid: $name", ({ block }) => expect(binotype.Block.is(block)).toBe(true))

	it.each([
		{ name: "number as content", block: { content: 123 } },
		{ name: "array as content", block: { content: ["not", "allowed"] } },
		{ name: "invalid weight as string", block: { weight: "10", content: <Fragment>Valid content</Fragment> } },
		{ name: "invalid weight as null", block: { weight: null, content: <Fragment>Valid content</Fragment> } },
		{ name: "invalid title as number", block: { title: 123, content: <Fragment>Valid content</Fragment> } },
		{
			name: "invalid title object missing short",
			block: { title: { long: "Long only" }, content: <Fragment>Valid content</Fragment> }
		},
		{
			name: "invalid title object missing long",
			block: { title: { short: "Short only" }, content: <Fragment>Valid content</Fragment> }
		},
		{ name: "invalid menu as true", block: { menu: true, content: <Fragment>Valid content</Fragment> } },
		{ name: "invalid menu as string", block: { menu: "false", content: <Fragment>Valid content</Fragment> } },
		{ name: "invalid type as number", block: { type: 123, content: <Fragment>Valid content</Fragment> } },
		{ name: "invalid type as boolean", block: { type: true, content: <Fragment>Valid content</Fragment> } },
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
		expect(binotype.Block.is(block)).toBe(false)
	})
})
