import { isoly } from "isoly"
import { isly } from "isly"
import { Path as _Path } from "./Path"
import { Section as _Section } from "./Section"
import { Title as _Title } from "./Title"
import { Meta } from "../../Meta"
import { Mode } from "../../Mode"

export interface Page {
	weight?: number
	title?: Page.Title
	subtitle?: string
	author?: string
	meta?: Meta
	mode?: Mode
	type?: string
	class?: string[]
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
	export import Title = _Title
	export const type: isly.Type<Page> = isly.object<Page>({
		weight: isly.number().optional(),
		title: Title.type.optional(),
		subtitle: isly.string().optional(),
		author: isly.string().optional(),
		meta: Meta.type.optional(),
		mode: Mode.type.optional(),
		type: isly.string().optional(),
		class: isly.array(isly.string()).optional(),
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
}
