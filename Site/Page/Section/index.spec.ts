import { binotype } from "../../../index"

describe("binotype.Site.Page.Section", () => {
	it.each([
		{
			name: "minimal section with string content",
			section: {
				content: "Sample content",
			},
		},
		{
			name: "minimal section with empty string content",
			section: {
				content: "",
			},
		},
		{
			name: "section with all optional properties",
			section: {
				weight: 10,
				title: "Section Title",
				menu: false,
				type: "article",
				content: "Full section content",
			},
		},
		{
			name: "section with title as object",
			section: {
				title: {
					short: "Short",
					long: "Long Title",
				},
				content: "Content with object title",
			},
		},
		{
			name: "section with nested sections as content",
			section: {
				weight: 5,
				content: {
					subsection1: {
						content: "Nested content 1",
					},
					subsection2: {
						title: "Sub Title",
						content: "Nested content 2",
					},
				},
			},
		},
		{
			name: "section with deeply nested sections",
			section: {
				content: {
					level1: {
						content: {
							level2: {
								content: "Deep nesting works",
							},
						},
					},
				},
			},
		},
		{
			name: "section with zero weight",
			section: {
				weight: 0,
				content: "Zero weight section",
			},
		},
		{
			name: "section with explicit undefined optional properties",
			section: {
				weight: undefined,
				title: undefined,
				menu: undefined,
				type: undefined,
				content: "Explicit undefined properties",
			},
		},
	])("is valid: $name", ({ section }) => {
		expect(binotype.Site.Page.Section.is(section)).toBe(true)
	})

	it.each([
		{
			name: "missing content property",
			section: {
				weight: 10,
				title: "Title",
			},
		},
		{
			name: "null as content",
			section: {
				content: null,
			},
		},
		{
			name: "number as content",
			section: {
				content: 123,
			},
		},
		{
			name: "array as content",
			section: {
				content: ["not", "allowed"],
			},
		},
		{
			name: "invalid weight as string",
			section: {
				weight: "10",
				content: "Valid content",
			},
		},
		{
			name: "invalid weight as null",
			section: {
				weight: null,
				content: "Valid content",
			},
		},
		{
			name: "invalid title as number",
			section: {
				title: 123,
				content: "Valid content",
			},
		},
		{
			name: "invalid title object missing short",
			section: {
				title: { long: "Long only" },
				content: "Valid content",
			},
		},
		{
			name: "invalid title object missing long",
			section: {
				title: { short: "Short only" },
				content: "Valid content",
			},
		},
		{
			name: "invalid menu as true",
			section: {
				menu: true,
				content: "Valid content",
			},
		},
		{
			name: "invalid menu as string",
			section: {
				menu: "false",
				content: "Valid content",
			},
		},
		{
			name: "invalid type as number",
			section: {
				type: 123,
				content: "Valid content",
			},
		},
		{
			name: "invalid type as boolean",
			section: {
				type: true,
				content: "Valid content",
			},
		},
		{
			name: "nested section with invalid content",
			section: {
				content: {
					subsection: {
						content: 123, // invalid content type
					},
				},
			},
		},
		{
			name: "completely empty object",
			section: {},
		},
		{
			name: "null object",
			section: null,
		},
		{
			name: "undefined object",
			section: undefined,
		},
		{
			name: "string instead of object",
			section: "not an object",
		},
		{
			name: "array instead of object",
			section: [],
		},
	])("is invalid: $name", ({ section }) => {
		expect(binotype.Site.Page.Section.is(section)).toBe(false)
	})
})