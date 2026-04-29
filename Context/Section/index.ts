import { Content } from "../../Content"
import { Meta } from "../../Meta"
import { Mode } from "../../Mode"
import { Block } from "../../Block"
import { Path } from "../../Path"
import { Label } from "../Label"
import { FunctionalUtilities } from "@stencil/core"

export interface Section<Node> {
	id: string
	link?: string
	meta: Meta
	mode: Mode
	type?: string
	class: string[]
	title?: Label<Node>
	subtitle?: Content<Node>
	content?: Content<Node>
	sections?: Section<Node>[]
}
export namespace Section {
	export function load<Node>(block: Block<Node>, path: Path, reduction?: Mode): Section<Node>
	export function load<Node>(block: Block<Node> | undefined, path: Path, reduction?: Mode): Section<Node> | undefined
	export function load<Node>(
		blocks: Record<string, Block<Node> | undefined> | undefined,
		path: Path,
		reduction?: Mode
	): Section<Node>[] | undefined
	export function load<Node>(
		block: Block<Node> | Record<string, Block<Node>> | undefined,
		path: Path,
		reduction?: Mode
	): Section<Node> | Section<Node>[] | undefined {
		let result: Section<Node> | Section<Node>[] | undefined
		if (Block.isBlocks(block))
			result = block && Block.toArray(block).map(b => Section.load<Node>(b, path.appendFragment(b.id), reduction))
		else if (block) {
			const mode = Mode.reduce(block.mode, reduction ?? "full")
			result =
				mode
				&& (Object.fromEntries(
					Object.entries({
						id: path.fragment ?? "",
						link: path.toString(),
						meta: block.meta ?? {},
						mode,
						type: block.type,
						class: block.class ?? [],
						title: Label.get<Node>(block.title ?? `[${path.fragment ?? ""}]`),
						subtitle: block.subtitle,
						...(mode == "full" || mode == "body" || mode == "list"
							? { content: block.content ? block.content : undefined, sections: load<Node>(block.blocks, path, mode) }
							: {})
					} satisfies Section<Node>).filter(([_, value]) => value !== undefined)
				) as Section<Node>)
		} else result = undefined
		return result
	}
	export function convert<Node, Target>(
		section: Section<Node>,
		from: (node: Node) => Target
	): Section<Content<Target>> {
		return {
			...section,
			title: section.title && Label.convert(section.title, from),
			subtitle: section.subtitle && Content.convert(section.subtitle, from),
			content: section.content && Content.convert(section.content, from),
			sections: section.sections?.map(s => Section.convert(s, from))
		}
	}
}
