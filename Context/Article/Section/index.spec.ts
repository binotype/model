import { binotype } from "../../../index"

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
		},
		{
			name: "section without fragment (empty id)",
			section: {
				title: "Main Content",
				content: "<p>Main content here</p>",
				path: binotype.Site.Page.Path.parse("/blog/article"),
			},
		},
		{
			name: "minimal section with only required properties",
			section: {
				path: binotype.Site.Page.Path.parse("/page#section1"),
				content: {},
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
		},
		{
			name: "section with nested sections",
			section: {
				title: "Parent Section",
				type: "container",
				path: binotype.Site.Page.Path.parse("/blog/article#parent"),
				content: {
					child1: {
						title: "Child Section 1",
						type: "text",
						content: "This is the first child section.",
					},
					child2: {
						title: "Child Section 2",
						type: "text",
						content: "This is the second child section.",
					},
				},
			},
		}
	] as { name: string, section: binotype.Site.Page.Section & { path: binotype.Site.Page.Path } }[] )("load($name)", ({ section }) =>
		expect(binotype.Context.Article.Section.load(section)).toMatchSnapshot()
	)
})
