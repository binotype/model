import { binotype } from "../../index"
import { Fragment, h } from "@stencil/core"
import { Path } from "../../Path"

describe("binotype.Context.Section", () => {
	it.each([
		{
			name: "basic block with all properties",
			block: {
				title: "Introduction",
				content: <Fragment>This is the introduction section.</Fragment>,
				type: "text",
			},
			path: Path.parse("/blog/article#intro"),
		},
		{
			name: "section without fragment (empty id)",
			block: {
				title: "Main Content",
				content: <Fragment><p>Main content here</p></Fragment>,
			},
			path: Path.parse("/blog/article"),
		},
		{
			name: "minimal section with only required properties",
			block: {
				content: <Fragment></Fragment>,
			},
			path: Path.parse("/page#section1"),
		},
		{
			name: "section with complex path",
			block: {
				title: "Complex Section",
				content: <Fragment>Content with <strong class="mark">HTML</strong></Fragment>,
				type: "html",
			},
			path: Path.parse("/articles/2024/sample-post#conclusion"),
		},
		{
			name: "section with nested sections",
			block: {
				title: "Parent Section",
				type: "container",
				content: {
					child1: {
						title: "Child Section 1",
						type: "text",
						content: <Fragment>This is the first child section.</Fragment>,
					},
					child2: {
						title: "Child Section 2",
						type: "text",
						content: <Fragment>This is the second child section.</Fragment>,
					},
				},
			},
			path: Path.parse("/blog/article#parent"),
		}
	] satisfies { name: string, block: binotype.Block, path: Path }[] )("load($name)", ({ block, path }) =>
		expect(binotype.Context.Section.toObject(binotype.Context.Section.load(block as binotype.Block, path))).toMatchSnapshot()
	)
})
