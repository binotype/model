import { binotype } from "../../index"

describe("binotype.Context.Article", () => {
	const basicDesign: binotype.Site.Design = {
		list: { mode: "summary" },
	}

	it.each([
		{
			name: "basic page with string content",
			page: {
				title: "Test Article",
				content: "This is the article content.",
				path: binotype.Site.Page.Path.parse("/test"),
				mode: "full" as binotype.Context.Article.Mode,
			},
			design: basicDesign,
			expected: {
				mode: "full",
				id: "test",
				link: "/test",
				meta: {},
				header: { readingTime: 1, title: "Test Article", wordCount: 5 },
				content: "This is the article content.",
				sections: undefined,
				articles: undefined,
				image: undefined,
				summary: undefined,
			},
		},
		{
			name: "page with object content (sections)",
			page: {
				title: "Page with Sections",
				content: {
					intro: {
						title: "Introduction",
						content: "Intro content",
						weight: 1,
					},
					main: {
						title: "Main Section",
						content: "Main content",
						weight: 2,
					},
				},
				path: binotype.Site.Page.Path.parse("/sections"),
				mode: "full" as binotype.Context.Article.Mode,
			},
			design: basicDesign,
			expected: {
				mode: "full",
				id: "sections",
				link: "/sections",
				meta: {},
				header: { readingTime: 1, title: "Page with Sections", wordCount: 2 },
				content: undefined,
				sections: [
					{
						id: "main",
						link: "/sections#main",
						meta: {},
						type: undefined,
						sections: undefined,
						title: "Main Section",
						content: "Main content",
					},
					{
						id: "intro",
						type: undefined,
						title: "Introduction",
						link: "/sections#intro",
						meta: {},
						sections: undefined,
						content: "Intro content",
					},
				],
				articles: undefined,
				image: undefined,
			},
		},
		{
			name: "page with sub-pages (articles)",
			page: {
				title: "Blog",
				pages: {
					"post1": {
						title: "First Post",
						published: "2024-01-01T10:00:00Z",
						content: "First post content",
					},
					"post2": {
						title: "Second Post",
						published: "2024-01-02T10:00:00Z",
						content: "Second post content",
					},
					"draft": {
						title: "Draft Post",
						draft: true,
						content: "Draft content",
					},
				},
				path: binotype.Site.Page.Path.parse("/blog"),
				mode: "list" as binotype.Context.Article.Mode,
			},
			design: basicDesign,
			expected: {
				mode: "list",
				id: "blog",
				link: "/blog",
				meta: {},
				header: { title: "Blog" },
				image: undefined,
				content: undefined,
				sections: undefined,
				articles: [
					expect.objectContaining({
						mode: "summary",
						id: "blog",
						link: "/blog/post2",
						meta: {},
						header: {"published": "2024-01-02T10:00:00Z", readingTime: 1, title: "Second Post", wordCount: 3 },
						content: undefined,
						sections: undefined,
						articles: undefined,
					}),
					expect.objectContaining({
						mode: "summary",
						id: "blog",
						link: "/blog/post1",
						meta: {},
						header: {"published": "2024-01-01T10:00:00Z", readingTime: 1, title: "First Post", wordCount: 3 },
						content: undefined,
						sections: undefined,
						articles: undefined,
					}),
				],
			},
		},
		{
			name: "page with both string content and mode body",
			page: {
				title: "Body Article",
				content: "This content should be shown.",
				path: binotype.Site.Page.Path.parse("/body"),
				mode: "body" as binotype.Context.Article.Mode,
			},
			design: basicDesign,
			expected: {
				mode: "body",
				id: "body",
				link: "/body",
				meta: {},
				header: { readingTime: 1, title: "Body Article", wordCount: 5 },
				content: "This content should be shown.",
				sections: undefined,
				articles: undefined,
				image: undefined,
			},
		},
		{
			name: "page with mode header (no content shown)",
			page: {
				title: "Header Only",
				content: "This content should not be shown.",
				path: binotype.Site.Page.Path.parse("/header"),
				mode: "header" as binotype.Context.Article.Mode,
			},
			design: basicDesign,
			expected: {
				mode: "header",
				id: "header",
				link: "/header",
				meta: {},
				header: { readingTime: 1, title: "Header Only", wordCount: 6 },
				content: undefined,
				sections: undefined,
				articles: undefined,
				image: undefined,
			},
		},
		{
			name: "page with count limit for sections",
			page: {
				title: "Limited Sections",
				content: {
					section1: { title: "Section 1", weight: 1, content: "Content 1" },
					section2: { title: "Section 2", weight: 2, content: "Content 2" },
					section3: { title: "Section 3", weight: 3, content: "Content 3" },
				},
				path: binotype.Site.Page.Path.parse("/limited"),
				mode: "full" as binotype.Context.Article.Mode,
			},
			design: basicDesign,
			count: 2,
			expected: {
				mode: "full",
				id: "limited",
				link: "/limited",
				meta: {},
				header: { readingTime: 1, title: "Limited Sections", wordCount: 2 },
				content: undefined,
				sections: [
					{ content: "Content 3", id: "section3", meta: {}, link: "/limited#section3", sections: undefined, title: "Section 3", type: undefined },
					{ content: "Content 2", id: "section2", meta: {}, link: "/limited#section2", sections: undefined, title: "Section 2", type: undefined },
				],
				articles: undefined,
				image: undefined,
			},
		},
	] as const satisfies ReadonlyArray<{
		name: string
		page: binotype.Site.Page & { path: binotype.Site.Page.Path; mode: binotype.Context.Article.Mode }
		design: binotype.Site.Design
		count?: number
		expected: any
	}>)("load($name)", ({ page, design, count, expected }) => {
		const article = binotype.Context.Article.load(page as binotype.Site.Page & { path: binotype.Site.Page.Path; mode: binotype.Context.Article.Mode }, design, count)
		expect(article).toEqual(expected)

		// Additional specific checks for array lengths when count is specified
		if (count !== undefined) {
			if (article.sections)
				expect(article.sections).toHaveLength(Math.min(count, Object.keys(page.content as object).length))
			if (article.articles)
				expect(article.articles).toHaveLength(Math.min(count, Object.values(page.pages || {}).filter((p: any) => !p.draft).length))
		}
	})
})
