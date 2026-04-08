import { Content } from "../../Content"
import { Path } from "../../Path"
import { Site } from "../../Site"
import { Item as _Item } from "./Item"

export interface Menu<C = Content> {
	items: Menu.Item<C>[]
}
export namespace Menu {
	export import Item = _Item
	export function load(site: Site, current: string): Menu {
		return {
			items:
				Item.load(site.page, Path.empty, current)?.items ??
				[],
		}
	}
	export function toObject(menu: Menu): Menu<Content.Object | Content.Object[] | null> {
		return {
			items: menu.items.map(Item.toObject),
		}
	}
}
