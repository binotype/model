import { describe, expect, it } from "vitest"
import { binotype } from "../../index"

describe("binotype.Context.Article.Section", () => {
	it.each([
		{
			name: "basic section with all properties",
			section: {
				title: "Introduction",
				content: "This is the introduction section.",
				type: "text",
				path: binotype.Site.Page.Path.parse("/blog/article#intro"),
			},
			expected: {
				id: "intro",
				link: "/blog/article#intro",
				type: "text",
				title: "Introduction",
				content: "This is the introduction section.",
			},
		},
		{
			name: "section without fragment (empty id)",
			section: {
				title: "Main Content",
				content: "<p>Main content here</p>",
				path: binotype.Site.Page.Path.parse("/blog/article"),
			},
			expected: {
				id: "",
				link: "/blog/article",
				type: undefined,
				title: "Main Content",
				content: "<p>Main content here</p>",
			},
		},
		{
			name: "minimal section with only required properties",
			section: {
				path: binotype.Site.Page.Path.parse("/page#section1"),
			},
			expected: {
				id: "section1",
				link: "/page#section1",
				type: undefined,
				title: undefined,
				content: undefined,
			},
		},
		{
			name: "section with complex path",
			section: {
				title: "Complex Section",
				content: "Content with <strong>HTML</strong>",
				type: "html",
				path: binotype.Site.Page.Path.parse("/articles/2024/sample-post#conclusion"),
			},
			expected: {
				id: "conclusion",
				link: "/articles/2024/sample-post#conclusion",
				type: "html",
				title: "Complex Section",
				content: "Content with <strong>HTML</strong>",
			},
		},
	] as const)("load($name)", ({ section, expected }) =>
		expect(binotype.Context.Article.Section.load(section)).toEqual(expected)
	)
})
