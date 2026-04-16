import { Fragment, h } from "@stencil/core"
import { binotype } from "../index"

describe("binotype.Content", () => {
	it.each([
		{
			name: "null content",
			content: null,
		},
		{
			name: "single node content",
			content: <Fragment>This is a single node content.</Fragment>,
		},
		{
			name: "array of nodes content",
			content: [
				<Fragment>Content of the first node.</Fragment>,
				<Fragment><p>Content of the second node with HTML.</p></Fragment>,
			],
		},
	] as { name: string, content: binotype.Content }[] )("validate($name)", ({ content }) => {
		expect(binotype.Content.flawed(content)).toBe(false)
		expect(binotype.Content.is(content)).toBe(true)
	})
})
