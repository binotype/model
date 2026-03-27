import { Meta } from "../../../Meta"
import { Site } from "../../../Site"

export interface Section {
	id: string
	link?: string
	type?: string
	meta: Meta
	title?: string
	content?: string
	sections?: Section[]
}
export namespace Section {
	export function load(section: Site.Page.Section & { path: Site.Page.Path }): Section {
		return {
			id: section.path.fragment ?? "",
			link: section.path.toString(),
			type: section.type,
			meta: section.meta ?? {},
			title: Site.Page.Title.get(section),
			content: section.content == undefined || typeof section.content == "string" ? section.content : undefined,
			sections: typeof section.content == "object"
				? Object.entries(section.content)
						.sort(
							(left, right) =>
								(right[1].weight ?? 100) - (left[1].weight ?? 100)
						)
						.map(([id, s]: [string, Site.Page.Section]) => Section.load({ ...s, path: section.path.appendFragment(id) }))
				: undefined
		}
	}
}
