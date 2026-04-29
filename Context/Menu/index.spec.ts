import { binotype } from "../../index"

describe("binotype.Context.Menu", () => {
	const baseSite: binotype.Site<string> = {
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
			home: { mode: "header", section: "article" },
			list: { mode: "summary" }
		},
		page: { title: "Home" }
	}
	describe("Menu.load", () => {
		it.each([
			{ name: "empty site", site: baseSite, current: "/" },
			{
				name: "site with single page",
				site: {
					...baseSite,
					page: { ...baseSite.page, pages: { about: { title: "About", content: "About page content" } } }
				},
				current: "/"
			},
			{
				name: "site with multiple pages, current at root",
				site: {
					...baseSite,
					page: {
						...baseSite.page,
						pages: {
							about: { title: "About", content: "About page content" },
							contact: { title: "Contact Us", content: "Contact page content" },
							blog: { title: "Blog", pages: { "first-post": { title: "First Post", content: "Blog post content" } } }
						}
					}
				},
				current: "/"
			},
			{
				name: "site with nested pages, current at about",
				site: {
					...baseSite,
					page: {
						...baseSite.page,
						pages: {
							about: { title: "About", content: "About page content" },
							contact: { title: "Contact Us", content: "Contact page content" },
							blog: {
								title: "Blog",
								pages: {
									"first-post": { title: "First Post", content: "Blog post content" },
									"second-post": { title: "Second Post", content: "Another blog post" }
								}
							}
						}
					}
				},
				current: "/about"
			},
			{
				name: "site with nested pages, current at blog post",
				site: {
					...baseSite,
					page: {
						...baseSite.page,
						pages: {
							about: { title: "About", content: "About page content" },
							blog: {
								title: "Blog",
								pages: {
									"first-post": { title: "First Post", content: "Blog post content" },
									"second-post": { title: "Second Post", content: "Another blog post" }
								}
							}
						}
					}
				},
				current: "/blog/first-post"
			},
			{
				name: "site with blocks and pages",
				site: {
					...baseSite,
					page: {
						title: "Home",
						blocks: {
							hero: { title: "Welcome", content: "Hero section content" },
							features: { title: "Features", content: "Features section content" }
						},
						pages: { about: { title: "About", content: "About page content" } }
					}
				},
				current: "/"
			},
			{
				name: "site with menu disabled blocks",
				site: {
					...baseSite,
					page: {
						title: "Home",
						blocks: {
							hero: { title: "Welcome", content: "Hero section content", menu: false },
							features: { title: "Features", content: "Features section content" }
						},
						pages: { about: { title: "About", content: "About page content" } }
					}
				},
				current: "/"
			}
		] satisfies { name: string; site: binotype.Site<string>; current: string }[])("load('$name', '$current')", ({
			site,
			current
		}) => expect(binotype.Context.Menu.load(site, current)).toMatchSnapshot())
	})
	describe("Menu.convert", () => {
		it.each([
			{ name: "empty menu", menu: { items: [] } },
			{
				name: "menu with items",
				menu: {
					items: [
						{ label: "About", description: "About page content", url: "/about", selected: undefined, items: [] },
						{
							label: "Contact",
							description: "Contact page content",
							url: "/contact",
							selected: "current" as const,
							items: []
						}
					]
				}
			},
			{
				name: "menu with nested items",
				menu: {
					items: [
						{
							label: "Blog",
							description: "Blog section",
							url: "/blog",
							selected: "parent" as const,
							items: [
								{
									label: "First Post",
									description: "Blog post content",
									url: "/blog/first-post",
									selected: "current" as const,
									items: []
								}
							]
						}
					]
				}
			}
		] satisfies { name: string; menu: binotype.Context.Menu<string> }[])("convert('$name')", ({ menu }) =>
			expect(binotype.Context.Menu.convert(menu, node => node)).toMatchSnapshot())
	})
})
