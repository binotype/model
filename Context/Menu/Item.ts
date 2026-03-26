import { Site } from "../../Site"

export interface Item {
	label: string
	description?: string
	url: string
	selected: "current" | "parent" | undefined
	items: Item[]
}
export namespace Item {
	export function load(page: Site.Page, path: Site.Page.Path, current: string): Item | undefined {
		return page.menu === false
			? undefined
			: {
					label: Site.Page.Title.get(page, "short-long") ?? "(untitled)",
					description: Site.Page.Title.get(page, "long"),
					url: path.toString(),
					selected:
						current == path.toString() ? "current" : current.startsWith(path.toString() + "/") ? "parent" : undefined,
					items: [
						...Object.entries(page.pages ?? {}).map(([key, child]) => [path.append(key), child] as const),
						...Object.entries(typeof page.content == "object" && page.content ? page.content : {}).map(
							([key, child]) => [path.appendFragment(key), child] as const
						),
					]
						.sort((left, right) => (left[1].weight ?? 100) - (right[1].weight ?? 100))
						.map(([path, child]) => Item.load(child, path, current))
						.filter((item): item is Item => item != undefined),
			  }
	}
}
