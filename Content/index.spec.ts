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
})
