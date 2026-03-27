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
		},
	] as const satisfies ReadonlyArray<{
		name: string
		page: binotype.Site.Page & { path: binotype.Site.Page.Path; mode: binotype.Context.Article.Mode }
		design: binotype.Site.Design
		count?: number
	}>)("load($name)", ({ page, design, count }) => {
		const article = binotype.Context.Article.load(page as binotype.Site.Page & { path: binotype.Site.Page.Path; mode: binotype.Context.Article.Mode }, design, count)
		expect(article).toMatchSnapshot()
		// Additional specific checks for array lengths when count is specified
		if (count !== undefined) {
			if (article.sections)
				expect(article.sections).toHaveLength(Math.min(count, Object.keys(page.content as object).length))
			if (article.articles)
				expect(article.articles).toHaveLength(Math.min(count, Object.values(page.pages || {}).filter((p: any) => !p.draft).length))
		}
	})
})
