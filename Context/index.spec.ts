import { describe, expect, it } from "vitest"
import { binotype } from "../index"

describe("binotype.Context", () => {
	const site: binotype.Site = {
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
	}
	it.each(["/", "/about", "/nonexistent", "invalid-path"] as const)("create(site, %s)", path =>
		expect(binotype.Context.create(site, path)).toMatchSnapshot()
	)
})
