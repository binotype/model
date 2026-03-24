import { isoly } from "isoly"
import { Site } from "../../Site"
import { Header } from "./Header"
import { Mode as _Mode } from "./Mode"
import { Section as _Section } from "./Section"

export interface Article {
	mode: Article.Mode
	id: string
	link?: string
	header?: Header
	image?: string
	summary?: string
	content?: string
	sections?: Article.Section[]
	articles?: Article[]
}
export namespace Article {
	export import Mode = _Mode
	export import Section = _Section
	export function load(
		page: Site.Page & { path: Site.Page.Path; mode: Article.Mode },
		design: Site.Design,
		count?: number
	): Article {
		return {
			mode: page.mode ?? (page.pages ? "list" : "full"),
			id: page.path.head ?? "",
			link: page.path.toString(),
			header: Header.load(page),
			// summary: page.content ? String(page.content).slice(0, 200) : "",
			content:
				typeof page.content == "string" && (page.mode == "full" || page.mode == "body") ? page.content : undefined,
			sections:
				typeof page.content == "object"
					? Object.entries(page.content)
							.sort(
								(left, right) =>
									(right[1].weight ?? Number.MAX_SAFE_INTEGER) - (left[1].weight ?? Number.MAX_SAFE_INTEGER)
							)
							.slice(0, count ?? Number.MAX_SAFE_INTEGER)
							.map(([id, section]: [string, Site.Page.Section]) =>
								Section.load({
									...section,
									path: page.path.appendFragment(id),
								})
							)
					: undefined,
			articles:
				page.pages &&
				Object.entries(page.pages)
					.filter(([, page]) => !page.draft && (!page.published || page.published <= isoly.DateTime.now()))
					.sort((left, right) => (right[1].published ?? "z").localeCompare(left[1].published ?? "z"))
					.sort(
						(left, right) => (right[1].weight ?? Number.MAX_SAFE_INTEGER) - (left[1].weight ?? Number.MAX_SAFE_INTEGER)
					)
					.slice(0, count ?? Number.MAX_SAFE_INTEGER)
					.map(([id, subpage]: [string, Site.Page]) =>
						Article.load(
							{
								...subpage,
								path: page.path.append(id),
								mode: typeof page.content == "object" ? "full" : design.list?.mode || "list",
							},
							design
						)
					),
		}
	}
}
