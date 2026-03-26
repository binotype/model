import { isoly } from "isoly"
import { isly } from "isly"
import { Path as _Path } from "./Path"
import { Section as _Section } from "./Section"

export interface Page {
	weight?: number
	title?: string | { short: string, long: string }
	author?: string
	published?: isoly.DateTime
	changed?: isoly.DateTime
	menu?: false
	tags?: string[]
	draft?: boolean
	content?: string | Record<string, Page.Section>
	pages?: Record<string, Page>
}
export namespace Page {
	export import Path = _Path
	export import Section = _Section
	export const type: isly.Type<Page> = isly.object<Page>({
		weight: isly.number().optional(),
		title: isly.union(isly.string(), isly.object({ short: isly.string(), long: isly.string() })).optional(),
		author: isly.string().optional(),
		published: isoly.DateTime.type.optional() as any,
		changed: isoly.DateTime.type.optional() as any,
		menu: isly.boolean(false).optional(),
		tags: isly.array(isly.string()).optional(),
		draft: isly.boolean().optional(),
		content: isly.union(isly.string(), isly.record(isly.string(), Section.type)).optional(),
		pages: isly
			.record(
				isly.string(),
				isly.lazy<Page>(() => Page.type, "binotype.Site.Page")
			)
			.optional(),
	})
	export const { is, flawed } = type.bind()
	export function locate(page: Page | undefined, path: Path): Page | undefined {
		return path.empty ? page : page?.pages ? locate(page.pages[path.getId("camel")], path.tail) : undefined
	}
	export function getTitle(page: Page, preference: "short" | "long" | "short-long" | "long-short" = "short-long"): string | undefined {
		const p = preference.split("-", 2) as ["short" | "long", "short" | "long" | undefined]
		const t: { short?: string; long?: string } = !page.title || typeof page.title == "string" ? { short: page.title } : page.title
		return t[p[0]] ?? (p[1] && t[p[1]])
	}
}
