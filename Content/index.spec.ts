import { isly } from "isly"
import { binotype } from "../index"

describe("binotype.Content", () => {
	it.each([
		{ name: "null content", content: null },
		{ name: "single node content", content: "This is a single node content." },
		{ name: "array of nodes content", content: "Content of the first node.\nContent of the second node with HTML." }
	] as { name: string; content: binotype.Content<string> }[])("validate($name)", ({ content }) => {
		expect(binotype.Content.getType(isly.string()).flawed(content)).toBe(false)
		expect(binotype.Content.getType(isly.string()).is(content)).toBe(true)
	})
	describe("plain", () => {
		const toString = (s: string) => s.toUpperCase()
		it.each([
			{ content: null, expected: "" },
			{ content: "hello", expected: "HELLO" },
			{ content: ["foo", "bar"], expected: "FOOBAR" },
			{ content: ["a", "b", "c"], expected: "ABC" }
		] as { content: binotype.Content<string>; expected: string }[])("plain($content)", ({ content, expected }) =>
			expect(binotype.Content.plain(content, toString)).toBe(expected))
	})
})
