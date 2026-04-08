import { Block } from "../../Block"
import { Content } from "../../Content"
import { Page } from "../../Page"
import { Path } from "../../Path"
import { Title } from "../../Title"

export interface Item<C = Content> {
	label: string
	description: C
	url: string
	selected: "current" | "parent" | undefined
	items: Item<C>[]
}
export namespace Item {
	export function load(block: Block, path: Path, current: string): Item
	export function load(block: Block | undefined, path: Path, current: string): Item | undefined
	export function load(block: Record<string, Block>, path: Path, current: string, type?: "block" | "page"): Item[]
	export function load(block: Record<string, Block> | undefined, path: Path, current: string, type?: "block" | "page"): Item[] | undefined
	export function load(block: Block | Record<string, Block> | undefined, path: Path, current: string, type?: "block" | "page"): Item | Item[] | undefined {
		return !block
			? undefined
			: Block.isBlocks(block)
			? (type == "block" ? Block.toArray<Block>(block) : Page.toArray(block)).map(p => Item.load(p, (type == "block" ? path.appendFragment(p.id) : path.append(p.id)), current)).filter((item): item is Item => item != undefined)
			: block.menu === undefined
			? {
					label: Title.get(block.title, "short"),
					description: Title.get(block.title, "long-short"),
					url: path.toString(),
					selected:
						current == path.toString() ? "current" : current.startsWith(path.toString() + "/") ? "parent" : undefined,
					items: [
						...load(block.blocks, path, current, "block") ?? [],
						...Page.hasPages(block) ? load(block.pages, path, current, "page") : [],
					]
			  }
			: undefined
	}
	export function toObject(item: Item): Item<Content.Object | Content.Object[] | null> {
		return { ...item, description: item.description && Content.to(item.description), items: item.items && item.items.map(Item.toObject) }
	}
}
