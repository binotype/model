import { h, Fragment } from "@stencil/core"
import { binotype } from "../../index"

describe("binotype.Content.Node", () => {
	const data = [
		{
			name: "paragraph node",
			value: <p>Hello</p>,
		},
		{
			name: "nested element node",
			value: <p>Hello <strong>world</strong></p>,
		},
		{ name: "fragment", value: <Fragment>Hello <strong>world</strong></Fragment> },
	] as const

	it.each(data)("is: $name", ({ value }) =>
		expect(binotype.Content.Node.is(value)).toBe(true)
	)
	it.each(data)("flawed: $name", ({ value }) =>
		expect(binotype.Content.Node.flawed(value)).toBe(false)
	)
	it.each(data)("Object.from: $name", ({ value }) =>
		expect(binotype.Content.Object.from(value)).toMatchSnapshot()
	)
	it("paragraph node", () =>
		expect(<p>test</p>).toMatchObject({
			"$attrs$": {
				"__self": expect.any(Object),
				"__source": expect.any(Object),
			},
			"$children$": [
				{
					"$attrs$": null,
					"$children$": null,
					"$elm$": null,
					"$flags$": 0,
					"$key$": null,
					"$name$": null,
					"$tag$": null,
					"$text$": "test",
				},
			],
			"$elm$": null,
			"$flags$": 0,
			"$key$": null,
			"$name$": null,
			"$tag$": "p",
			"$text$": null,
		}))
	it("Fragment node", () =>
		expect(<Fragment>test</Fragment>).toMatchObject({
			"$attrs$": {
				"__self": {},
				"__source": {},
			},
			"$children$": [
				{
					"$attrs$": null,
					"$children$": null,
					"$elm$": null,
					"$flags$": 0,
					"$key$": null,
					"$name$": null,
					"$tag$": null,
					"$text$": "test",
				},
			],
			"$elm$": null,
			"$flags$": 0,
			"$key$": null,
			"$name$": null,
			"$tag$": undefined,
			"$text$": null,
		}))
})
