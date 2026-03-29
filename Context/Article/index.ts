import { isoly } from "isoly"
import { Site } from "../../Site"
import { Header as _Header } from "./Header"
import { Mode } from "../../Mode"
import { Section as _Section } from "./Section"
import { Meta } from "../../Meta"

export interface Article {
	id: string
	link?: string
	meta: Meta
	mode: Mode
	type?: string
	class: string[]
	header?: Article.Header
	image?: string
	summary?: string
	content?: string
	sections?: Article.Section[]
	articles?: Article[]
}
export namespace Article {
	export import Header = _Header
	export import Section = _Section
	export function load(
		page: Site.Page & { path: Site.Page.Path; mode?: Mode },
		design: Site.Design,
		count?: number
	): Article | undefined {
		const mode = Mode.reduce(page.mode, page.pages ? "list" : "full")
		return mode && {
			mode,
			id: page.path.head ?? "",
			link: page.path.toString(),
			meta: page.meta ?? {},
			type: page.type,
			class: page.class ?? [],
			header: Header.load(page),
			// summary: page.content ? String(page.content).slice(0, 200) : "",
			content:
				typeof page.content == "string" && (mode == "full" || mode == "body") ? page.content : undefined,
			sections:
				typeof page.content == "object" && (mode == "full" || mode == "body")
					? Object.entries(page.content)
							.sort(
								(left, right) =>
									(left[1].weight ?? 100) - (right[1].weight ?? 100)
							)
							.slice(0, count ?? Number.MAX_SAFE_INTEGER)
							.map(([id, section]: [string, Site.Page.Section]) =>
								Section.load({
									...section,
									path: page.path.appendFragment(id),
								})
							).filter((s): s is Article.Section => !!s)
					: undefined,
			articles:
				page.pages && mode == "list"
				? Object.entries(page.pages)
					.filter(([, page]) => !page.draft && (!page.published || page.published <= isoly.DateTime.now()))
					.sort((left, right) => (right[1].published ?? "z").localeCompare(left[1].published ?? "z"))
					.sort(
						(left, right) => (left[1].weight ?? 100) - (right[1].weight ?? 100)
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
					).filter((article): article is Article => !!article) : undefined,
		}
	}
}
