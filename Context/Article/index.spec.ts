import { Article } from "./index"
import { Page } from "../../Page"
import { Path } from "../../Path"
import { Mode } from "../../Mode"

describe("binotype.Context.Article", () => {
	describe("Article.load", () => {
		it("should return undefined for undefined page", () => {
			const result = Article.load(undefined, Path.parse("/test"))
			expect(result).toBeUndefined()
		})
		it("should handle simple page object", () => {
			const page: Page<string> = { mode: "full", pages: undefined, content: "Test content" }
			const result = Article.load(page, Path.parse("/p1"))
			expect(result).toMatchSnapshot()
		})
		it("should handle page with articles array", () => {
			const page: Record<string, Page<string> | undefined> = {
				p1: { mode: "full", pages: undefined, content: "Test content 1" },
				p2: { mode: "full", pages: undefined, content: "Test content 2" }
			}
			const result = Article.load(page, Path.parse("/"))
			expect(result).toMatchSnapshot()
		})
		it("should handle reduction mode", () => {
			const page: Page<string> = { mode: "full", pages: undefined, content: "Test content" }
			const result = Article.load(page, Path.parse("/p1"), Mode.parse("list"))
			expect(result).toMatchSnapshot()
		})
	})
	describe("Article.convert", () => {
		it("should convert Article to object", () => {
			const page: Page<string> = { mode: "full", pages: undefined, content: "Test content" }
			const article = Article.load(page, Path.parse("/p1"))
			const obj = Article.convert(article, node => node)
			expect(obj).toMatchSnapshot()
		})
	})
})
