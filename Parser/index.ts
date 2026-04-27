import { Content } from "../Content"
import { dom } from "@typeup/dom"
import { Page } from "../Page"
import { Mode } from "../Mode"
import { parser } from "@typeup/parser"
import { Block } from "../Block"
import { Meta } from "../Meta"

export class Parser {
	constructor(private convert: (content: string | dom.Block[] | undefined) => Promise<Content>) {}
	async import(type: "block", node: dom.Block.Section): Promise<Block & { id: string }>
	async import(type: "page", node: dom.Document): Promise<Page & { id: string }>
	async import(
		type: "block" | "page",
		node: dom.Block.Section | dom.File
	): Promise<(Block & { id: string }) | (Page & { id: string })> {
		const properties = {
			block: ["id", "weight", "title", "subtitle", "mode", "type", "class"],
			page: ["draft", "published", "changed", "tags", "author"]
		} as const
		const [variables, meta] = dom.Variables.split(
			dom.Variables.deepen(node.variables),
			...properties.block,
			...(type == "page" ? properties.page : [])
		)
		const nodes = dom.Node.split(
			node.content,
			type == "page" ? "block.chapter" : "block.section",
			...(type == "page" ? (["block.import"] as const) : [])
		)
		return {
			id: dom.Variables.parse("string", variables, "id") ?? "",
			weight: dom.Variables.parse("integer", variables, "weight"),
			title: dom.Variables.parse("string", variables, "title"),
			subtitle: await this.convert(dom.Variables.parse("string", variables, "subtitle")),
			meta: meta as Meta,
			mode: Mode.parse(dom.Variables.parse("string", variables, "mode")),
			type: dom.Variables.parse("string", variables, "type"),
			class: dom.Variables.parse("string[]", variables, "class"),
			...(type == "page"
				? {
						draft: dom.Variables.parse("boolean", variables, "draft"),
						published: dom.Variables.parse("string", variables, "published"),
						changed: dom.Variables.parse("string", variables, "changed"),
						tags: dom.Variables.parse("string[]", variables, "tags"),
						author: dom.Variables.parse("string", variables, "author")
					}
				: {}),
			content: await this.convert(nodes?.other),
			blocks: nodes
				? Object.fromEntries(
						await Promise.all(
							nodes[type == "page" ? "block.chapter" : "block.section"]?.map(
								async chapter => [chapter.variables.id, await this.import("block", chapter)] as const
							) ?? []
						)
					)
				: undefined,
			...(type == "page"
				? {
						pages: nodes
							? Object.fromEntries(
									await Promise.all(
										nodes["block.import"]?.map(
											async page => [page.variables.id, await this.import("page", page.content)] as const
										) ?? []
									)
								)
							: {}
					}
				: {})
		}
	}
	async parse(content: string): Promise<(Page & { id: string }) | undefined> {
		const document = parser.parse(content)
		return document && this.import("page", document)
	}
	async open(path: string): Promise<(Page & { id: string }) | undefined> {
		const document = parser.open(path)
		return document && this.import("page", document)
	}
}
export namespace Parser {}
