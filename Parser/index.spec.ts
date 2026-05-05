import { writeFileSync, rmSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"
import "mendly/node"
import { binotype } from "../index"

const parser = new binotype.Parser<unknown>(async data => data)

describe("binotype.Parser", () => {
	describe("parse", () => {
		it.each([
			{ input: "", expected: { id: "" } },
			{ input: "id = home\n", expected: { id: "home" } },
			{ input: "id = p\ntitle = My Page\n", expected: { title: "My Page" } },
			{ input: "id = p\ndraft = true\n", expected: { draft: true } },
			{ input: "id = p\ndraft = false\n", expected: { draft: false } },
			{ input: "id = p\nauthor = Jane Doe\n", expected: { author: "Jane Doe" } },
			{ input: "id = p\nweight = 5\n", expected: { weight: 5 } },
			{ input: "id = p\npublished = 2024-01-01T00:00:00.000Z\n", expected: { published: "2024-01-01T00:00:00.000Z" } },
			{ input: "id = p\nmode = full\n", expected: { mode: "full" } },
			{ input: "id = p\ntype = article\n", expected: { type: "article" } },
			{ input: "id = p\ntags = typescript,testing\n", expected: { tags: ["typescript", "testing"] } },
			{ input: "id = p\nclass = hero featured\n", expected: { class: ["hero", "featured"] } },
			{ input: "id = page\n===\nid = ch1\n", expected: { blocks: { ch1: expect.anything() } } },
			{
				input: "id = page\n===\nid = first\n===\nid = second\n",
				expected: { blocks: { first: expect.anything(), second: expect.anything() } }
			},
			{
				input: "id = page\n===\nid = ch1\n---\nid = sec1\n",
				expected: { blocks: { sec1: { blocks: { sec1: expect.anything() } } } }
			}
		])("$input", async ({ input, expected }) => expect(await parser.parse(input)).toMatchObject(expected))
		it("accepts a name parameter", async () =>
			expect(await parser.parse("id = named\n", "named-page")).toMatchObject({ id: "named" }))
	})
	describe("open", () => {
		const file = join(tmpdir(), "parser-test.tup")
		beforeAll(() => writeFileSync(file, "id = from-file\ntitle = File Page\n"))
		afterAll(() => rmSync(file))
		it("parses a file from disk", async () =>
			expect(await parser.open(file)).toMatchObject({ id: "from-file", title: "File Page" }))
		it("returns undefined for a non-existent file", async () =>
			expect(await parser.open("/non/existent/path.tup")).toBeUndefined())
	})
})
