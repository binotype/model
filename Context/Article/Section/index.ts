import { Meta } from "../../../Meta"
import { Site } from "../../../Site"

export interface Section {
	id: string
	link?: string
	meta: Meta
	type?: string
	class: string[]
	title?: string
	content?: string
	sections?: Section[]
}
export namespace Section {
	export function load(section: Site.Page.Section & { path: Site.Page.Path }): Section {
		return {
			id: section.path.fragment ?? "",
			link: section.path.toString(),
			meta: section.meta ?? {},
			type: section.type,
			class: section.class ?? [],
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
