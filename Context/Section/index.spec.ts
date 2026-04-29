import { Section } from "./index"
import { Block } from "../../Block"
import { Path } from "../../Path"
import { Mode } from "../../Mode"

describe("binotype.Context.Section", () => {
	describe("Section.load", () => {
		it("should return undefined for undefined block", () =>
			expect(Section.load(undefined, Path.parse("/test"))).toBeUndefined())
		it("should handle simple block object", () =>
			expect(
				Section.load({ mode: "full", class: ["main"], meta: {}, content: "Block content" }, Path.parse("/b1"))
			).toMatchSnapshot())
		it("should handle blocks as record", () =>
			expect(
				Section.load(
					{
						b1: { mode: "full", class: ["main"], meta: {}, content: "Block content 1" },
						b2: { mode: "full", class: ["side"], meta: {}, content: "Block content 2" }
					} satisfies Record<string, Block<string>>,
					Path.parse("/")
				)
			).toMatchSnapshot())
		it("should handle reduction mode", () =>
			expect(
				Section.load(
					{ mode: "full", class: ["main"], meta: {}, content: "Block content" },
					Path.parse("/b1"),
					Mode.parse("list")
				)
			).toMatchSnapshot())
	})
	describe("Section.convert", () =>
		it("should convert Section to object", () =>
			expect(
				Section.convert(
					Section.load({ mode: "full", class: ["main"], meta: {}, content: "Block content" }, Path.parse("/b1")),
					node => node
				)
			).toMatchSnapshot()))
})
