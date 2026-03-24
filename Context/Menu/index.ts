import { Site } from "../../Site"
import { Item as _Item } from "./Item"

export interface Menu {
	items: Menu.Item[]
}
export namespace Menu {
	export import Item = _Item
	export function load(site: Site, current: string): Menu {
		return {
			items:
				Item.load(site.page, Site.Page.Path.empty, current)?.items.filter((item): item is Item => item != undefined) ??
				[],
		}
	}
}
