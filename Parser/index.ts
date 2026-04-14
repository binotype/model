import { Content } from "../Content"
import { dom } from "@typeup/dom"
import { Page } from "../Page"
import { Mode } from "../Mode"
import { parser } from "@typeup/parser"
import { Block } from "../Block"
import { Meta } from "../Meta"

export class Parser {
	constructor(private convert: (content: string | dom.Block[] | undefined) => Content) {
	}
	import(type: "block", node: dom.Block.Section): Block & { id: string }
	import(type: "page", node: dom.Document): Page & { id: string }
	import(type: "block" | "page", node: dom.Block.Section | dom.File): Block & { id: string } | Page & { id: string } {
		const properties = { block: ["id", "weight", "title", "subtitle", "mode", "type", "class"], page: ["draft", "published", "changed", "tags", "author"] } as const
		const [variables, meta] = dom.Variables.split(dom.Variables.deepen(node.variables), ...properties.block, ...(type == "page" ? properties.page : []))
		const nodes = dom.Node.split(node.content, type == "page" ? "block.chapter" : "block.section", ...(type == "page" ? ["block.import"] as const : []))
		return {
			id: dom.Variables.parse("string", variables, "id") ?? "",
			weight: dom.Variables.parse("integer", variables, "weight"),
			title: dom.Variables.parse("string", variables, "title"),
			subtitle: this.convert(dom.Variables.parse("string", variables, "subtitle")),
			meta: meta as Meta,
			mode: Mode.parse(dom.Variables.parse("string", variables, "mode")),
			type: dom.Variables.parse("string", variables, "type"),
			class: dom.Variables.parse("string[]", variables, "class"),
			...(type == "page" ? {
				draft: dom.Variables.parse("boolean", variables, "draft"),
				published: dom.Variables.parse("string", variables, "published"),
				changed: dom.Variables.parse("string", variables, "changed"),
				tags: dom.Variables.parse("string[]", variables, "tags"),
				author: dom.Variables.parse("string", variables, "author")
			} : {}),
			content: this.convert(nodes?.other),
			blocks: nodes ? Object.fromEntries(nodes[type == "page" ? "block.chapter" : "block.section"]?.map(({ id, ...chapter }) => [id, this.import("block", chapter)] as const) ?? []) : undefined,
			...(type == "page" ? { pages: nodes ? Object.fromEntries(nodes["block.import"]?.map(({ id, ...page }) => [id, this.import("page", page)] as const) ?? []) : {} } : {})
		}
	}
	parse(content: string): Page & { id: string } | undefined {
		const document = parser.parse(content)
		return document && this.import("page", document)
	}
	open(path: string): Page & { id: string } | undefined {
		const document = parser.open(path)
		return document && this.import("page", document)
	}
}
export namespace Parser {}
