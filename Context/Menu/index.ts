import { Content } from "../../Content"
import { Path } from "../../Path"
import { Site } from "../../Site"
import { Item as _Item } from "./Item"

export interface Menu<Node> {
	items: Menu.Item<Node>[]
	depth?: number
}
export namespace Menu {
	export import Item = _Item
	export function load<Node>(site: Site<Node>, current: string): Menu<Node> {
		return { items: Item.load(site.page, Path.empty, current)?.items ?? [], depth: site.design?.menu?.depth }
	}
	export function convert<Node, Target>(menu: Menu<Node>, convert: (node: Node) => Target): Menu<Content<Target>> {
		return { items: menu.items.map(i => Item.convert(i, convert)), depth: menu.depth }
	}
}
