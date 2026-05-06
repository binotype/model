import { Clean } from "../../Clean"
import { binotype } from "../../index"

describe("binotype.Context.Article", () => {
	describe("Article.load", () => {
		it.each([
			{ name: "undefined page", path: binotype.Path.parse("/test"), fallback: undefined },
			{
				name: "simple page object",
				page: { mode: "full", content: "Test content" } as binotype.Page<string>,
				path: binotype.Path.parse("/p1")
			},
			{
				name: "page with articles array",
				page: {
					p1: { mode: "full", content: "Test content 1" },
					p2: { mode: "full", content: "Test content 2" }
				} as Record<string, binotype.Page<string> | undefined>,
				path: binotype.Path.parse("/")
			},
			{
				name: "reduction mode",
				page: { mode: "full", content: "Test content" } as binotype.Page<string>,
				path: binotype.Path.parse("/p1"),
				fallback: { list: "full" as binotype.Mode }
			}
		] satisfies {
			name: string
			page?: binotype.Page<string>
			path: binotype.Path
			fallback?: { mode?: binotype.Mode; list?: binotype.Mode }
		}[])("($name)", ({ page, path, fallback }) =>
			expect(binotype.Context.Article.load(page as binotype.Page<string>, path, fallback ?? {})).toMatchSnapshot())
	})
	describe("Article.convert", () => {
		it.each([
			{
				name: "article to object",
				page: { mode: "full", content: "Test content" } as binotype.Page<string>,
				path: binotype.Path.parse("/p1")
			}
		] satisfies { name: string; page: binotype.Page<string>; path: binotype.Path }[])("($name)", ({ page, path }) =>
			expect(
				binotype.Context.Article.convert(binotype.Context.Article.load(page, path, {}), node => node)
			).toMatchSnapshot())
	})
	describe("binotype.Context.Article.load", () => {
		it.each([
			{
				name: "basic page with string content",
				page: { title: "Test Article", content: "This is the article content." },
				path: binotype.Path.parse("/test"),
				fallback: { mode: "full", list: "full" }
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
				fallback: { mode: "full", list: "full" }
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
				fallback: { mode: "full", list: "full" }
			},
			{
				name: "page with both string content and mode body",
				page: { title: "Body Article", content: "This content should be shown." },
				path: binotype.Path.parse("/body"),
				fallback: { mode: "body" }
			},
			{
				name: "page with mode header (no content shown)",
				page: { title: "Header Only", content: "This content should not be shown." },
				path: binotype.Path.parse("/header"),
				fallback: { mode: "header" }
			}
		] satisfies {
			name: string
			page: binotype.Page<string>
			path: binotype.Path
			fallback: { mode?: binotype.Mode; list?: binotype.Mode }
		}[])("($name)", ({ page, path, fallback }) =>
			expect(
				Clean.clean(binotype.Context.Article.convert(binotype.Context.Article.load(page, path, fallback), node => node))
			).toMatchSnapshot())
	})
})
