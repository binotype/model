import { Block } from "../../Block"
import { Content } from "../../Content"
import { Page } from "../../Page"
import { Path } from "../../Path"
import { Title } from "../../Title"

export interface Item<Node = any> {
	label: string
	description: Content<Node>
	url: string
	selected: "current" | "parent" | undefined
	items: Item<Node>[]
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
		return !block
			? undefined
			: Block.isBlocks<Node>(block)
				? (type == "block" ? Block.toArray<Node>(block) : Page.toArray(block))
						.map(p => Item.load<Node>(p, type == "block" ? path.appendFragment(p.id) : path.append(p.id), current))
						.filter((item): item is Item<Node> => item != undefined)
				: (block as Block<Node>).menu === undefined
					? {
							label: Title.get((block as Block<Node>).title, "short"),
							description: Title.get((block as Block<Node>).title, "long-short") as Content<Node>,
							url: path.toString(),
							selected:
								current == path.toString()
									? "current"
									: current.startsWith(path.toString() + "/")
										? "parent"
										: undefined,
							items: [
								...(load<Node>((block as Block<Node>).blocks, path, current, "block") ?? []),
								...(Page.hasPages(block as any) ? load<Node>((block as any).pages, path, current, "page") : [])
							]
						}
					: undefined
	}
	export function convert<Node, Target>(item: Item<Node>, convert: (node: Node) => Target): Item<Content<Target>> {
		return {
			...item,
			description: item.description && Content.convert(item.description, convert),
			items: item.items && item.items.map(i => Item.convert(i, convert))
		}
	}
}
