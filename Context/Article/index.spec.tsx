import { binotype } from "../../index"
import { Fragment, h } from "@stencil/core"

describe("binotype.Context.Article", () => {
	it.each([
		{
			name: "basic page with string content",
			page: {
				title: "Test Article",
				content: <Fragment>This is the article content.</Fragment>,
			},
			path: binotype.Path.parse("/test"),
			mode: "full" as binotype.Mode
		},
		{
			name: "page with object content (sections)",
			page: {
				title: "Page with Sections",
				blocks: {
					intro: {
						title: "Introduction",
						content: <Fragment>Intro content</Fragment>,
						weight: 1,
					},
					main: {
						title: "Main Section",
						content: <Fragment>Main content</Fragment>,
						weight: 2,
					},
				},
			},
			path: binotype.Path.parse("/sections"),
			mode: "full" as binotype.Mode
		},
		{
			name: "page with sub-pages (articles)",
			page: {
				title: "Blog",
				pages: {
					"post1": {
						title: "First Post",
						published: "2024-01-01T10:00:00Z",
						content: <Fragment>First post content</Fragment>,
					},
					"post2": {
						title: "Second Post",
						published: "2024-01-02T10:00:00Z",
						content: <Fragment>Second post content</Fragment>,
					},
					"draft": {
						title: "Draft Post",
						draft: true,
						content: <Fragment>Draft content</Fragment>,
					},
				},
			},
			path: binotype.Path.parse("/blog"),
			mode: "list" as binotype.Mode
		},
		{
			name: "page with both string content and mode body",
			page: {
				title: "Body Article",
				content: <Fragment>This content should be shown.</Fragment>,
			},
			path: binotype.Path.parse("/body"),
			mode: "body" as binotype.Mode,
		},
		{
			name: "page with mode header (no content shown)",
			page: {
				title: "Header Only",
				content: <Fragment>This content should not be shown.</Fragment>,
			},
			path: binotype.Path.parse("/header"),
			mode: "header" as binotype.Mode,
		},
	] as const satisfies ReadonlyArray<{
		name: string
		page: binotype.Page,
		path: binotype.Path,
		mode: binotype.Mode
	}>)("load($name)", ({page, path, mode }) =>
		expect(binotype.Context.Article.toObject(binotype.Context.Article.load(page as binotype.Page, path, mode))).toMatchSnapshot()
	)
})
