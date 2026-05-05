import { binotype } from "../../index"

describe("binotype.Context.Article", () => {
	describe("Article.load", () => {
		it("should return undefined for undefined page", () => {
			const result = binotype.Context.Article.load(undefined, binotype.Path.parse("/test"))
			expect(result).toBeUndefined()
		})
		it("should handle simple page object", () => {
			const page: binotype.Page<string> = { mode: "full", pages: undefined, content: "Test content" }
			const result = binotype.Context.Article.load(page, binotype.Path.parse("/p1"))
			expect(result).toMatchSnapshot()
		})
		it("should handle page with articles array", () => {
			const page: Record<string, binotype.Page<string> | undefined> = {
				p1: { mode: "full", pages: undefined, content: "Test content 1" },
				p2: { mode: "full", pages: undefined, content: "Test content 2" }
			}
			const result = binotype.Context.Article.load(page, binotype.Path.parse("/"))
			expect(result).toMatchSnapshot()
		})
		it("should handle reduction mode", () => {
			const page: binotype.Page<string> = { mode: "full", pages: undefined, content: "Test content" }
			const result = binotype.Context.Article.load(page, binotype.Path.parse("/p1"), binotype.Mode.parse("list"))
			expect(result).toMatchSnapshot()
		})
	})
	describe("Article.convert", () => {
		it("should convert Article to object", () => {
			const page: binotype.Page<string> = { mode: "full", pages: undefined, content: "Test content" }
			const article = binotype.Context.Article.load(page, binotype.Path.parse("/p1"))
			const obj = binotype.Context.Article.convert(article, node => node)
			expect(obj).toMatchSnapshot()
		})
	})
	describe("binotype.Context.Article.load", () => {
		it.each([
			{
				name: "basic page with string content",
				page: { title: "Test Article", content: "This is the article content." },
				path: binotype.Path.parse("/test"),
				mode: "full" as binotype.Mode
			},
			{
				name: "page with object content (sections)",
				page: {
					title: "Page with Sections",
					blocks: {
						intro: { title: "Introduction", content: "Intro content", weight: 1 },
						main: { title: "Main Section", content: "Main content", weight: 2 }
					}
				},
				path: binotype.Path.parse("/sections"),
				mode: "full" as binotype.Mode
			},
			{
				name: "page with sub-pages (articles)",
				page: {
					title: "Blog",
					pages: {
						post1: { title: "First Post", published: "2024-01-01T10:00:00Z", content: "First post content" },
						post2: { title: "Second Post", published: "2024-01-02T10:00:00Z", content: "Second post content" },
						draft: { title: "Draft Post", draft: true, content: "Draft content" }
					}
				},
				path: binotype.Path.parse("/blog"),
				mode: "list" as binotype.Mode
			},
			{
				name: "page with both string content and mode body",
				page: { title: "Body Article", content: "This content should be shown." },
				path: binotype.Path.parse("/body"),
				mode: "body" as binotype.Mode
			},
			{
				name: "page with mode header (no content shown)",
				page: { title: "Header Only", content: "This content should not be shown." },
				path: binotype.Path.parse("/header"),
				mode: "header" as binotype.Mode
			}
		] as const satisfies ReadonlyArray<{
			name: string
			page: binotype.Page<string>
			path: binotype.Path
			mode: binotype.Mode
		}>)("($name)", ({ page, path, mode }) =>
			expect(
				binotype.Context.Article.convert(
					binotype.Context.Article.load(page as binotype.Page<string>, path, mode),
					node => node
				)
			).toMatchSnapshot())
	})
})
