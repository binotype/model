import { Block } from "../../Block"
import { Content } from "../../Content"
import { Page } from "../../Page"
import { Path } from "../../Path"
import { Title } from "../../Title"

export interface Item<Node = any> {
	label: string
	description: Content<Node>
	url: string
	selected?: "current" | "parent"
	items?: Item<Node>[]
}
export namespace Item {
	export function load<Node = any>(block: Block<Node>, path: Path, current: string): Item<Node>
	export function load<Node = any>(block: Block<Node> | undefined, path: Path, current: string): Item<Node> | undefined
	export function load<Node = any>(
		block: Record<string, Block<Node> | undefined>,
		path: Path,
		current: string,
		type?: "block" | "page"
	): Item<Node>[]
	export function load<Node = any>(
		block: Record<string, Block<Node> | undefined> | undefined,
		path: Path,
		current: string,
		type?: "block" | "page"
	): Item<Node>[] | undefined
	export function load<Node = any>(
		block: Block<Node> | Record<string, Block<Node> | undefined> | undefined,
		path: Path,
		current: string,
		type?: "block" | "page"
	): Item<Node> | Item<Node>[] | undefined {
		return !block || block.menu == false
			? undefined
			: Block.isBlocks<Node>(block)
				? (type == "block" ? Block.toArray<Node>(block) : Page.toArray(block))
						.map(p => Item.load<Node>(p, type == "block" ? path.appendFragment(p.id) : path.append(p.id), current))
						.filter((item): item is Item<Node> => item != undefined)
				: {
						label: typeof block.menu == "string" ? block.menu : Title.get(block.title, "short"),
						description: Title.get(block.title, "long-short") as Content<Node>,
						url: path.toString(),
						...(current == path.toString()
							? { selected: "current" }
							: current.startsWith(path.toString() + "/")
								? { selected: "parent" }
								: {}),
						...(items => (items.length > 0 ? { items } : {}))([
							...(load<Node>(block.blocks, path, current, "block") ?? []),
							...(Page.hasPages(block) ? load<Node>(block.pages, path, current, "page") : [])
						])
					}
	}
	export function convert<Node, Target>(
		{ description, items, ...item }: Item<Node>,
		convert: (node: Node) => Target
	): Item<Content<Target>> {
		return {
			description: description && Content.convert(description, convert),
			...(items ? { items: items.map(i => Item.convert(i, convert)) } : {}),
			...item
		}
	}
}
