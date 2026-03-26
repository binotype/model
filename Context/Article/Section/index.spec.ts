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
			expected: {
				id: "intro",
				link: "/blog/article#intro",
				type: "text",
				title: "Introduction",
				content: "This is the introduction section.",
				sections: undefined,
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
				sections: undefined,
			},
		},
		{
			name: "minimal section with only required properties",
			section: {
				path: binotype.Site.Page.Path.parse("/page#section1"),
				content: {},
			},
			expected: {
				id: "section1",
				link: "/page#section1",
				type: undefined,
				title: undefined,
				content: undefined,
				sections: [],
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
				sections: undefined,
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
			expected: {
				id: "parent",
				link: "/blog/article#parent",
				type: "container",
				title: "Parent Section",
				content: undefined,
				sections: [
     {
      "content": "This is the first child section.",
      "id": "parent_child1",
      "link": "/blog/article#parent_child1",
      "title": "Child Section 1",
      "type": "text",
    },
     {
      "content": "This is the second child section.",
      "id": "parent_child2",
      "link": "/blog/article#parent_child2",
      "title": "Child Section 2",
      "type": "text",
    },],
			},

		}
	] as { name: string, section: binotype.Site.Page.Section & { path: binotype.Site.Page.Path }, expected: binotype.Context.Article.Section }[] )("load($name)", ({ section, expected }) =>
		expect(binotype.Context.Article.Section.load(section)).toEqual(expected)
	)
})
