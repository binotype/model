import { Content } from "../../Content"
import { Meta } from "../../Meta"
import { Mode } from "../../Mode"
import { Block } from "../../Block"
import { Path } from "../../Path"
import { Label } from "../Label"
import { FunctionalUtilities } from "@stencil/core"

export interface Section<C = Content> {
	id: string
	link?: string
	meta: Meta
	mode: Mode
	type?: string
	class: string[]
	title?: Label<C>
	subtitle?: C
	content?: C
	sections?: Section<C>[]
}
export namespace Section {
	export function load(block: Block, path: Path, reduction?: Mode): Section
	export function load(block: Block | undefined, path: Path, reduction?: Mode): Section | undefined
	export function load(blocks: Record<string, Block> | undefined, path: Path, reduction?: Mode): Section[] | undefined
	export function load(block: Block | Record<string, Block> | undefined, path: Path, reduction?: Mode): Section | Section[] | undefined {
		let result: Section | Section[] | undefined
		if (Block.isBlocks(block))
			result = block && Block.toArray(block).map(b => Section.load(b, path.appendFragment(b.id), reduction))
		else if (block) {
			const mode = Mode.reduce(block.mode, reduction ?? "full")
			result = mode && Object.fromEntries(Object.entries({
				id: path.fragment ?? "",
				link: path.toString(),
				meta: block.meta ?? {},
				mode,
				type: block.type,
				class: block.class ?? [],
				title: Label.get(block.title ?? `[${path.fragment ?? ""}]`),
				subtitle: block.subtitle,
				...((mode == "full" || mode == "body" || mode == "list") ? {
					content: block.content ? block.content : undefined,
					sections: load(block.blocks, path, mode),
				} : {})
			} satisfies Section).filter(([_, value]) => value !== undefined)) as Section
		}	else
			result = undefined
		return result
	}
	export function toObject(section: Section): Section<Content.Object | Content.Object[] | null> {
		return { ...section, subtitle: section.subtitle && Content.to(section.subtitle), content: section.content && Content.to(section.content), sections: section.sections?.map(Section.toObject) }
	}
}
