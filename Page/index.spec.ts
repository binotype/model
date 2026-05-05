import { isly } from "isly"
import { binotype } from "../index"

describe("binotype.Page", () => {
	describe("locate", () => {
		it("should return the page for an empty path", () => {
			const page: binotype.Page<string> = { mode: "full", class: [], meta: {}, content: "Root content" }
			const path = binotype.Path.parse("")
			expect(binotype.Page.locate(page, path)).toBe(page)
		})
		it("should return undefined for missing nested page", () => {
			const page: binotype.Page<string> = { mode: "full", class: [], meta: {}, content: "Root content", pages: {} }
			const path = binotype.Path.parse("/missing")
			expect(binotype.Page.locate(page, path)).toBeUndefined()
		})
		it("should locate nested pages by path", () => {
			const page: binotype.Page<string> = {
				mode: "full",
				class: [],
				meta: {},
				content: "Root content",
				pages: { child: { mode: "full", class: [], meta: { id: "child" }, content: "Child content" } }
			}
			const path = binotype.Path.parse("/child")
			expect(binotype.Page.locate(page, path)?.meta?.id).toBe("child")
		})
	})
	describe("toArray", () => {
		it("should filter out draft and future pages", () => {
			const now = new Date().toISOString()
			const pages: Record<string, binotype.Page<string>> = {
				p1: { mode: "full", class: [], meta: { id: "p1" }, content: "A", draft: true },
				p2: { mode: "full", class: [], meta: { id: "p2" }, content: "B", published: "2999-01-01T00:00:00Z" },
				p3: { mode: "full", class: [], meta: { id: "p3" }, content: "C", published: now }
			}
			const pageArray = binotype.Page.toArray(pages)
			expect(pageArray.length).toBe(1)
			expect(pageArray[0]?.meta?.id).toBe("p3")
		})
	})
	describe("hasPages", () => {
		it("should return true if pages exist", () => {
			const page: binotype.Page<string> = {
				mode: "full",
				class: [],
				meta: {},
				content: "Root",
				pages: { a: { mode: "full", class: [], meta: { id: "a" }, content: "A" } }
			}
			expect(binotype.Page.hasPages(page)).toBe(true)
		})
		it("should return false if no pages", () => {
			const page: binotype.Page<string> = { mode: "full", class: [], meta: { id: "root" }, content: "Root" }
			expect(binotype.Page.hasPages(page)).toBe(false)
		})
	})
	describe("getType(isly.string()).flawed", () => {
		it.each([
			{
				title: "Articles",
				pages: {
					"sample-post": {
						title: "Sample Post",
						published: "2024-01-01T08:15:46+02:00",
						tags: ["sample", "placeholder"],
						content:
							"This is a sample blog post with placeholder content.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
					},
					"another-sample": {
						published: "2024-01-15T16:12:00+02:00",
						tags: ["sample", "example"],
						title: "Another Sample Post",
						content:
							"This is another sample post with placeholder content.\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nSample Section\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
					},
					"draft-post": {
						draft: true,
						tags: ["draft"],
						title: "Draft Post",
						content: "This is a draft post placeholder."
					}
				}
			},
			{
				title: "Home",
				blocks: {
					section1: {
						title: "Welcome to My Blog",
						menu: false,
						weight: 0,
						content:
							"This is the home page of my sample blog. Here you can find articles on various topics related to software development, technology, and professional insights."
					},
					section2: {
						title: "Latest Articles",
						weight: 1,
						content: "Check out the latest articles below:\n- Sample Post\n- Another Sample Post"
					}
				}
			},
			{ title: "Talks", pages: {} },
			{
				title: "About",
				content:
					"I am [Your Name], and I create things. Professionally I create software products.\nI live in [Your City], [Your Country] with my family.\nI write about building software and building companies.\nCurrently, I help companies as a consultant. If you are interested in my services please contact me.\nYou can find out more about me on my page on LinkedIn and on GitHub."
			},
			{
				title: "Contact",
				menu: false,
				content: "Don't hesitate to contact me with ideas, suggestions and opinions. I look forward to hear from you."
			},
			{
				title: "Description",
				menu: false,
				content:
					"Sample blog contains articles on subjects such as software development, technology and professional topics.\nThe articles convey experiences and insights from professional work."
			},
			{ title: "Subscribe", menu: false, content: "Subscribe to receive updates when new content is published." }
		] satisfies binotype.Page<string>[])("($title)", (page: binotype.Page<string>) =>
			expect(binotype.Page.getType(isly.string()).flawed(page)).toBe(false))
	})
})
