import { isly } from "isly"
import { binotype } from "../index"

describe("binotype.Site", () => {
	it.each([
		{
			url: "https://example.com",
			language: "en-US",
			title: "Test Site",
			tagline: "A test tagline",
			description: "A test description",
			keywords: ["test", "example", "site"],
			author: "Test Author",
			design: {
				logotype: "/logo.svg",
				icon: "/favicon.ico",
				navigation: "header",
				styles: ["/style.css"],
				scripts: ["/script.js"],
				home: "article",
				list: "header"
			},
			page: { pages: { about: { title: "About", content: "About page content" } } }
		},
		{
			url: "https://example.com",
			language: "en-US",
			title: "Minimal Site",
			tagline: "Minimal tagline",
			design: {},
			page: { pages: {} }
		}
	] satisfies binotype.Site<string>[])("is(%#)", value =>
		expect(binotype.Site.getType(isly.string()).is(value)).toBe(true))

	it("should validate complex blog site structure", () => {
		const complexBlog = {
			url: "https://example.com",
			language: "en-US",
			title: "Sample Blog",
			tagline: "your tagline here",
			description:
				"Sample blog containing articles on various topics.\nArticles convey experiences and insights from professional work.",
			keywords: ["blog", "personal", "tech", "programming"],
			author: "Your Name",
			design: {
				logotype: "/assets/img/logotype.svg",
				icon: "/assets/icon/favicon.ico",
				styles: ["/assets/css/reset.css", "//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.6.0/styles/default.min.css"],
				scripts: ["//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.6.0/highlight.min.js"],
				navigation: "header",
				list: "header",
				home: "article"
			},
			page: {
				pages: {
					article: {
						title: "Articles",
						pages: {
							"sample-post": {
								title: "Sample Post",
								published: "2024-01-01T08:15:46+02:00",
								tags: ["sample", "placeholder"],
								content:
									"This is a sample blog post with placeholder content.\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\nThis is a sample quote for demonstration purposes."
							},
							"another-sample": {
								published: "2024-01-15T16:12:00+02:00",
								tags: ["sample", "example"],
								title: "Another Sample Post",
								content:
									"This is another sample post with placeholder content.\nSample Section\nExcepteur sint occaecat cupidatat non proident."
							},
							"draft-post": {
								draft: true,
								tags: ["draft"],
								title: "Draft Post",
								content: "This is a draft post placeholder."
							}
						}
					},
					home: {
						title: "Home",
						blocks: {
							section1: {
								title: "Welcome to My Blog",
								menu: false,
								weight: 0,
								content: "This is the home page of my sample blog."
							},
							section2: {
								title: "Latest Articles",
								weight: 1,
								content: "Check out the latest articles below:\n- Sample Post\n- Another Sample Post"
							}
						}
					},
					about: {
						title: "About",
						content:
							"I am [Your Name], and I create things.\nI live in [Your City], [Your Country] with my family.\nYou can find out more about me on LinkedIn and on GitHub."
					},
					contact: {
						title: "Contact",
						menu: false,
						content:
							"Don't hesitate to contact me with ideas, suggestions and opinions.\nName: [Your Name]\nEmail: [Your Email]\nMessage: [Your Message]"
					}
				}
			}
		}
		expect(binotype.Site.getType(isly.string()).is(complexBlog)).toBe(true)
		expect(binotype.Site.getType(isly.string()).flawed(complexBlog)).toBe(false)
	})
})
