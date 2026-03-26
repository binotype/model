import { Site } from "../../../Site"

export interface Section {
	id: string
	link?: string
	type?: string
	title?: string
	content?: string
}
export namespace Section {
	export function load(section: Site.Page.Section & { path: Site.Page.Path }): Section {
		return {
			id: section.path.fragment ?? "",
			link: section.path.toString(),
			type: section.type,
			title: Site.Page.Title.get(section),
			content: section.content,
		}
	}
}
