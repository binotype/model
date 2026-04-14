import { binotype } from "../index"
import { Fragment, h } from "@stencil/core"

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
				home: {
					mode: "header",
					section: "article",
				},
				list: {
					mode: "summary",
				},
			},
			page: {
				pages: {
					about: {
						title: "About",
						content: <p>About page content</p>,
					},
				},
			},
		},
		{
			url: "https://example.com",
			language: "en-US",
			title: "Minimal Site",
			tagline: "Minimal tagline",
			design: {},
			page: { pages: {} },
		},
	])("is(%#)", value => expect(binotype.Site.is(value)).toBe(true))

	it("should validate complex blog site structure", () => {
		const complexBlog = {
			url: "https://example.com",
			language: "en-US",
			title: "Sample Blog",
			tagline: "your tagline here",
			description: "Sample blog containing articles on various topics.\nArticles convey experiences and insights from professional work.",
			keywords: ["blog", "personal", "tech", "programming"],
			author: "Your Name",
			design: {
				logotype: "/assets/img/logotype.svg",
				icon: "/assets/icon/favicon.ico",
				styles: ["/assets/css/reset.css", "//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.6.0/styles/default.min.css"],
				scripts: ["//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.6.0/highlight.min.js"],
				navigation: "header",
				list: {
					mode: "header",
				},
				home: {
					mode: "header",
					section: "article",
				},
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
								content: (
									<Fragment>
										<p>This is a sample blog post with placeholder content.</p>
										<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
										<blockquote>
											<p>This is a sample quote for demonstration purposes.</p>
										</blockquote>
									</Fragment>
								),
							},
							"another-sample": {
								published: "2024-01-15T16:12:00+02:00",
								tags: ["sample", "example"],
								title: "Another Sample Post",
								content: (
									<Fragment>
										<p>This is another sample post with placeholder content.</p>
										<h2>Sample Section</h2>
										<p>Excepteur sint occaecat cupidatat non proident.</p>
									</Fragment>
								),
							},
							"draft-post": {
								draft: true,
								tags: ["draft"],
								title: "Draft Post",
								content: <p>This is a draft post placeholder.</p>,
							},
						},
					},
					home: {
						title: "Home",
						blocks: {
							section1: {
								title: "Welcome to My Blog",
								menu: false,
								weight: 0,
								content: <p>This is the home page of my sample blog.</p>,
							},
							section2: {
								title: "Latest Articles",
								weight: 1,
								content: (
									<Fragment>
										<p>Check out the latest articles below:</p>
										<ul>
											<li><a href="/article/sample-post">Sample Post</a></li>
											<li><a href="/article/another-sample">Another Sample Post</a></li>
										</ul>
									</Fragment>
								),
							},
						},
					},
					about: {
						title: "About",
						content: (
							<Fragment>
								<p>I am [Your Name], and I create things.</p>
								<p>I live in [Your City], [Your Country] with my family.</p>
								<p>You can find out more about me on <a href="#">LinkedIn</a> and on <a href="#">GitHub</a>.</p>
							</Fragment>
						),
					},
					contact: {
						title: "Contact",
						menu: false,
						content: (
							<Fragment>
								<p>Don&apos;t hesitate to contact me with ideas, suggestions and opinions.</p>
								<form action="#" method="post">
									<input type="hidden" name="redirect_to" value="#" />
									<label htmlFor="name">Name</label>
									<input type="text" name="name" />
									<label htmlFor="email">Email</label>
									<input type="email" name="email" />
									<label htmlFor="message">Message</label>
									<textarea name="message"></textarea>
									<button type="submit">Send</button>
								</form>
							</Fragment>
						),
					},
				},
			},
		}

		expect(binotype.Site.is(complexBlog)).toBe(true)
		expect(binotype.Site.flawed(complexBlog)).toBe(false)
	})
})
