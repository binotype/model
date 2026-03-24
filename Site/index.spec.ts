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
						content: "<p>About page content</p>",
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
		{
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
								content:
									"<p>This is a sample blog post with placeholder content.</p>\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>\n<blockquote>\n  <p>This is a sample quote for demonstration purposes.</p>\n</blockquote>\n<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>",
							},
							"another-sample": {
								published: "2024-01-15T16:12:00+02:00",
								tags: ["sample", "example"],
								title: "Another Sample Post",
								content:
									"<p>This is another sample post with placeholder content.</p>\n<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>\n<h2>Sample Section</h2>\n<p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>",
							},
							"draft-post": {
								draft: true,
								tags: ["draft"],
								title: "Draft Post",
								content: "<p>This is a draft post placeholder.</p>",
							},
						},
					},
					home: {
						title: "Home",
						content: {
							section1: {
								title: "Welcome to My Blog",
								menu: false,
								weight: 0,
								content:
									"<p>This is the home page of my sample blog. Here you can find articles on various topics related to software development, technology, and professional insights.</p>",
							},
							section2: {
								title: "Latest Articles",
								weight: 1,
								content:
									'<p>Check out the latest articles below:</p>\n<ul>\n  <li><a href="/article/sample-post">Sample Post</a></li>\n  <li><a href="/article/another-sample">Another Sample Post</a></li>\n</ul>',
							},
						},
					},
					talk: {
						title: "Talks",
						pages: {},
					},
					about: {
						title: "About",
						content:
							'<p>I am [Your Name], and I create things. Professionally I create software products.</p>\n<p>I live in [Your City], [Your Country] with my family.</p>\n<p>I write about building software and building companies.</p>\n<p>Currently, I help companies as a consultant. If you are interested in my services please <a href="../contact">contact me</a>.</p>\n<p>You can find out more about me on my page on <a href="#">LinkedIn</a> and on <a href="#">GitHub</a>.</p>',
					},
					contact: {
						title: "Contact",
						menu: false,
						content:
							'<p>Don&apos;t hesitate to contact me with ideas, suggestions and opinions. I look forward to hear from you.</p>\n<form action="#" method="post">\n<input type="hidden" name="redirect_to" value="#" />\n<label for="name">Name</label>\n<input type="text" name="name" />\n<label for="email">Email</label>\n<input type="email" name="email" />\n<label for="message">Message</label>\n<textarea name="message"></textarea>\n<button type="submit">Send</button>\n</form>',
					},
					description: {
						title: "Description",
						menu: false,
						content:
							"<p>Sample blog contains articles on subjects such as <em>software development</em>, <em>technology</em> and <em>professional topics</em>.</p>\n<p>The articles convey <em>experiences and insights</em> from professional work.</p>",
					},
					subscribe: {
						title: "Subscribe",
						menu: false,
						content: "<p>Subscribe to receive updates when new content is published.</p>",
					},
				},
			},
		},
	])("is(%s)", value => expect(binotype.Site.is(value)).toBe(true))
	it.each([
		{
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
								content:
									"<p>This is a sample blog post with placeholder content.</p>\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>\n<blockquote>\n  <p>This is a sample quote for demonstration purposes.</p>\n</blockquote>\n<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>",
							},
							"another-sample": {
								published: "2024-01-15T16:12:00+02:00",
								tags: ["sample", "example"],
								title: "Another Sample Post",
								content:
									"<p>This is another sample post with placeholder content.</p>\n<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>\n<h2>Sample Section</h2>\n<p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>",
							},
							"draft-post": {
								draft: true,
								tags: ["draft"],
								title: "Draft Post",
								content: "<p>This is a draft post placeholder.</p>",
							},
						},
					},
					home: {
						title: "Home",
						content: {
							section1: {
								title: "Welcome to My Blog",
								menu: false,
								weight: 0,
								content:
									"<p>This is the home page of my sample blog. Here you can find articles on various topics related to software development, technology, and professional insights.</p>",
							},
							section2: {
								title: "Latest Articles",
								weight: 1,
								content:
									'<p>Check out the latest articles below:</p>\n<ul>\n  <li><a href="/article/sample-post">Sample Post</a></li>\n  <li><a href="/article/another-sample">Another Sample Post</a></li>\n</ul>',
							},
						},
					},
					talk: {
						title: "Talks",
						pages: {},
					},
					about: {
						title: "About",
						content:
							'<p>I am [Your Name], and I create things. Professionally I create software products.</p>\n<p>I live in [Your City], [Your Country] with my family.</p>\n<p>I write about building software and building companies.</p>\n<p>Currently, I help companies as a consultant. If you are interested in my services please <a href="../contact">contact me</a>.</p>\n<p>You can find out more about me on my page on <a href="#">LinkedIn</a> and on <a href="#">GitHub</a>.</p>',
					},
					contact: {
						title: "Contact",
						menu: false,
						content:
							'<p>Don&apos;t hesitate to contact me with ideas, suggestions and opinions. I look forward to hear from you.</p>\n<form action="#" method="post">\n<input type="hidden" name="redirect_to" value="#" />\n<label for="name">Name</label>\n<input type="text" name="name" />\n<label for="email">Email</label>\n<input type="email" name="email" />\n<label for="message">Message</label>\n<textarea name="message"></textarea>\n<button type="submit">Send</button>\n</form>',
					},
					description: {
						title: "Description",
						menu: false,
						content:
							"<p>Sample blog contains articles on subjects such as <em>software development</em>, <em>technology</em> and <em>professional topics</em>.</p>\n<p>The articles convey <em>experiences and insights</em> from professional work.</p>",
					},
					subscribe: {
						title: "Subscribe",
						menu: false,
						content: "<p>Subscribe to receive updates when new content is published.</p>",
					},
				},
			},
		},
	])("flawed(%s)", value => expect(binotype.Site.flawed(value)).toBe(false))
})
