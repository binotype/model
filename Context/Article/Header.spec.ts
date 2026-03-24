import { binotype } from "../../index"

describe("binotype.Context.Article.Header", () => {
	it.each([
		{
			name: "basic page with title",
			page: { title: "Test Page" },
			expected: {
				title: "Test Page",
				author: undefined,
				published: undefined,
				changed: undefined,
				wordCount: undefined,
				readingTime: undefined,
			},
		},
		{
			name: "page with all metadata",
			page: {
				title: "Sample Article",
				author: "John Doe",
				published: "2024-01-01T08:00:00Z" as binotype.isoly.DateTime,
				changed: "2024-01-02T10:00:00Z" as binotype.isoly.DateTime,
				content: "This is a sample article with some content that has multiple words in it.",
			},
			expected: {
				title: "Sample Article",
				author: "John Doe",
				published: "2024-01-01T08:00:00Z",
				changed: "2024-01-02T10:00:00Z",
				wordCount: 14,
				readingTime: 1,
			},
		},
		{
			name: "page with long content",
			page: {
				title: "Long Article",
				content: Array(300).fill("word").join(" "), // 300 words
			},
			expected: {
				title: "Long Article",
				author: undefined,
				published: undefined,
				changed: undefined,
				wordCount: 300,
				readingTime: 2, // Math.ceil(300 / 200)
			},
		},
		{
			name: "page with empty content",
			page: {
				title: "Empty Article",
				content: "",
			},
			expected: {
				title: "Empty Article",
				author: undefined,
				published: undefined,
				changed: undefined,
				wordCount: undefined,
				readingTime: undefined,
			},
		},
		{
			name: "page with HTML content",
			page: {
				title: "HTML Article",
				content: "<p>This is <strong>HTML</strong> content with <em>formatting</em>.</p>",
			},
			expected: {
				title: "HTML Article",
				author: undefined,
				published: undefined,
				changed: undefined,
				wordCount: 6, // "This is HTML content with formatting"
				readingTime: 1,
			},
		},
		{
			name: "page without explicit title (should use Site.Page.getTitle)",
			page: {},
			expected: {
				title: "(untitled)", // Site.Page.getTitle returns this for pages without title
				author: undefined,
				published: undefined,
				changed: undefined,
				wordCount: undefined,
				readingTime: undefined,
			},
		},
	])("load($name)", ({ page, expected }) => {
		const header = binotype.Context.Article.Header.load(page)
		expect(header).toEqual(expected)
	})
})
