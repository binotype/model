import { binotype } from "../index"

describe("binotype.Page", () => {
	describe("binotype.Page.locate", () => {
		it("should return the page for an empty path", () => {
			const page: binotype.Page<string> = { id: "root", mode: "full", class: [], meta: {}, content: "Root content" }
			const path = binotype.Path.parse("")
			expect(binotype.Page.locate(page, path)).toBe(page)
		})
		it("should return undefined for missing nested page", () => {
			const page: binotype.Page<string> = {
				id: "root",
				mode: "full",
				class: [],
				meta: {},
				content: "Root content",
				pages: {}
			}
			const path = binotype.Path.parse("/missing")
			expect(binotype.Page.locate(page, path)).toBeUndefined()
		})
		it("should locate nested pages by path", () => {
			const page: binotype.Page<string> = {
				id: "root",
				mode: "full",
				class: [],
				meta: {},
				content: "Root content",
				pages: { child: { id: "child", mode: "full", class: [], meta: {}, content: "Child content" } }
			}
			const path = binotype.Path.parse("/child")
			expect(binotype.Page.locate(page, path)?.id).toBe("child")
		})
	})
	describe("Page.toArray", () => {
		it("should filter out draft and future pages", () => {
			const now = new Date().toISOString()
			const pages: Record<string, binotype.Page<string>> = {
				p1: { id: "p1", mode: "full", class: [], meta: {}, content: "A", draft: true },
				p2: { id: "p2", mode: "full", class: [], meta: {}, content: "B", published: "2999-01-01T00:00:00Z" },
				p3: { id: "p3", mode: "full", class: [], meta: {}, content: "C", published: now }
			}
			const pageArray = binotype.Page.toArray(pages)
			expect(pageArray.length).toBe(1)
			expect(pageArray[0]?.id).toBe("p3")
		})
	})
	describe("Page.hasPages", () => {
		it("should return true if pages exist", () => {
			const page: binotype.Page<string> = {
				id: "root",
				mode: "full",
				class: [],
				meta: {},
				content: "Root",
				pages: { a: { id: "a", mode: "full", class: [], meta: {}, content: "A" } }
			}
			expect(binotype.Page.hasPages(page)).toBe(true)
		})
		it("should return false if no pages", () => {
			const page: binotype.Page<string> = { id: "root", mode: "full", class: [], meta: {}, content: "Root" }
			expect(binotype.Page.hasPages(page)).toBe(false)
		})
	})
})
