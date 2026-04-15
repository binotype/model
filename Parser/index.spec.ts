import { binotype } from "../index"
import { dom } from "@typeup/dom"
import { parser } from "@typeup/parser"
import { h } from "@stencil/core"
import { vi, describe, it, expect, beforeEach, MockedFunction } from "vitest"

// Mock the parser module
vi.mock("@typeup/parser", () => ({
	parser: {
		parse: vi.fn()
	}
}))

const mockedParser = parser as {
	parse: MockedFunction<typeof parser.parse>
}

describe("binotype.Parser", () => {
	let testParser: binotype.Parser
	let convertFunction: MockedFunction<(content: string | dom.Block[] | undefined) => Promise<binotype.Content>>

	beforeEach(() => {
		convertFunction = vi.fn().mockImplementation(async (content) => {
			if (typeof content === "string") {
				return h("p", {}, content)
			} else if (Array.isArray(content)) {
				return content.map(block => h("div", {}, `Block: ${JSON.stringify(block)}`))
			}
			return null
		})
		testParser = new binotype.Parser(convertFunction)
		vi.clearAllMocks()
	})

	describe("Parser.parse", () => {
		const mockDocument: dom.Document = {
			variables: {
				id: "test-page",
				title: "Test Page Title",
				draft: false,
				published: "2024-01-01T08:00:00Z",
				tags: ["test", "example"],
				author: "Test Author"
			},
			content: []
		}

		const validInputs = [
			{
				description: "simple page content",
				content: "---\nid: simple\ntitle: Simple Page\n---\n\n# Content",
				variables: { id: "simple", title: "Simple Page" }
			},
			{
				description: "page with metadata",
				content: "---\nid: blog-post\ntitle: Blog Post\nauthor: John Doe\ntags: [tech, programming]\npublished: 2024-01-01\n---\n\n## Blog Content",
				variables: {
					id: "blog-post",
					title: "Blog Post",
					author: "John Doe",
					tags: ["tech", "programming"],
					published: "2024-01-01"
				}
			},
			{
				description: "page with blocks",
				content: "---\nid: complex\ntitle: Complex Page\n---\n\n# Section 1\n\n## Subsection",
				variables: { id: "complex", title: "Complex Page" }
			}
		] as const

		const invalidInputs = [
			{
				description: "empty string",
				content: ""
			},
			{
				description: "malformed frontmatter",
				content: "---\ninvalid yaml\n-"
			},
			{
				description: "missing id",
				content: "---\ntitle: No ID\n---\n\nContent"
			},
			{
				description: "content without frontmatter",
				content: "Just plain text content"
			}
		] as const

		it.each(validInputs)("should parse %s", async ({ content, variables }) => {
			// Setup mock document with expected variables
			const mockDoc: dom.Document = {
				variables,
				content: []
			}
			mockedParser.parse.mockReturnValue(mockDoc)

			const result = await testParser.parse(content)

			expect(mockedParser.parse).toHaveBeenCalledWith(content)
			expect(result).toBeDefined()
			expect(result?.id).toBe(variables.id)
			expect(result?.title).toBe(variables.title)
			if (variables.author) {
				expect(result?.author).toBe(variables.author)
			}
			if (variables.tags) {
				expect(result?.tags).toEqual(variables.tags)
			}
		})

		it.each(invalidInputs)("should handle %s gracefully", async ({ content }) => {
			mockedParser.parse.mockReturnValue(undefined)

			const result = await testParser.parse(content)

			expect(mockedParser.parse).toHaveBeenCalledWith(content)
			expect(result).toBeUndefined()
		})

		it("should return null when parser returns null", async () => {
			mockedParser.parse.mockReturnValue(null)

			const result = await testParser.parse("any content")

			expect(result).toBeNull()
		})

		it("should return false when parser returns false", async () => {
			mockedParser.parse.mockReturnValue(false)

			const result = await testParser.parse("any content")

			expect(result).toBe(false)
		})

		it("should call convert function for content", async () => {
			const mockDoc: dom.Document = {
				variables: { id: "test" },
				content: "test content"
			}
			mockedParser.parse.mockReturnValue(mockDoc)

			await testParser.parse("test input")

			// The convert function should be called when processing the content
			expect(convertFunction).toHaveBeenCalled()
		})

		describe("complex page scenarios", () => {
			const complexTestCases = [
				{
					description: "page with nested blocks and imports",
					document: {
						variables: {
							id: "complex-page",
							title: "Complex Page",
							draft: false,
							published: "2024-01-01T08:00:00Z"
						},
						content: [
							{ type: "block.chapter", id: "intro", content: "Introduction" },
							{ type: "block.import", id: "external", content: "External content" }
						]
					}
				},
				{
					description: "page with all metadata fields",
					document: {
						variables: {
							id: "full-metadata",
							title: "Full Metadata Page",
							subtitle: "A comprehensive example",
							draft: true,
							published: "2024-12-01T10:00:00Z",
							changed: "2024-12-15T14:30:00Z",
							tags: ["comprehensive", "example", "metadata"],
							author: "Content Author",
							weight: 100,
							mode: "article",
							type: "blog",
							class: ["featured", "highlight"]
						},
						content: "Rich content here"
					}
				}
			] as const

			it.each(complexTestCases)("should handle %s", async ({ document }) => {
				mockedParser.parse.mockReturnValue(document as dom.Document)

				const result = await testParser.parse("complex content")

				expect(result).toBeDefined()
				expect(result).toMatchSnapshot()
			})
		})

		describe("edge cases", () => {
			it("should handle very long content", async () => {
				const longContent = "---\nid: long\ntitle: Long\n---\n\n" + "Lorem ipsum ".repeat(1000)
				const mockDoc: dom.Document = {
					variables: { id: "long", title: "Long" },
					content: "Lorem ipsum ".repeat(1000)
				}
				mockedParser.parse.mockReturnValue(mockDoc)

				const result = await testParser.parse(longContent)

				expect(result?.id).toBe("long")
			})

			it("should handle special characters in content", async () => {
				const specialContent = "---\nid: special\ntitle: Spëcïål Çhäracters\n---\n\n# Heading with émojis 🚀"
				const mockDoc: dom.Document = {
					variables: { id: "special", title: "Spëcïål Çhäracters" },
					content: "# Heading with émojis 🚀"
				}
				mockedParser.parse.mockReturnValue(mockDoc)

				const result = await testParser.parse(specialContent)

				expect(result?.title).toBe("Spëcïål Çhäracters")
			})
		})
	})
})
