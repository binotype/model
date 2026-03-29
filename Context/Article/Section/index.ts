import { Meta } from "../../../Meta"
import { Mode } from "../../../Mode"
import { Site } from "../../../Site"

export interface Section {
	id: string
	link?: string
	meta: Meta
	mode: Mode
	type?: string
	class: string[]
	title?: string
	subtitle?: string
	content?: string
	sections?: Section[]
}
export namespace Section {
	export function load(section: Site.Page.Section & { path: Site.Page.Path }, reduction?: Mode): Section | undefined {
		const mode = Mode.reduce(section.mode, reduction ?? "full")
		return mode && {
			id: section.path.fragment ?? "",
			link: section.path.toString(),
			meta: section.meta ?? {},
			mode,
			type: section.type,
			class: section.class ?? [],
			title: Site.Page.Title.get(section),
			subtitle: section.subtitle,
			content: typeof section.content == "string" && (mode == "full" || mode == "body") ? section.content : undefined,
			sections: typeof section.content == "object" && (mode == "full" || mode == "body")
				? Object.entries(section.content)
						.sort(
							(left, right) =>
								(left[1].weight ?? 100) - (right[1].weight ?? 100)
						)
						.map(([id, s]: [string, Site.Page.Section]) => Section.load({ ...s, path: section.path.appendFragment(id) }))
						.filter((s): s is Section => !!s)
				: undefined
		}
	}
}
