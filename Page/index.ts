import { isoly } from "isoly"
import { isly } from "isly"
import { Path } from "../Path"
import { Block } from "../Block"

export interface Page extends Block {
	draft?: boolean
	published?: isoly.DateTime
	changed?: isoly.DateTime
	tags?: string[]
	author?: string
	pages?: Record<string, Page | undefined>
}
export namespace Page {
	export const type: isly.Object<Page> = Block.type.extend<Page>(
		{
			draft: isly.boolean().optional(),
			published: isoly.DateTime.type.optional() as any,
			changed: isoly.DateTime.type.optional() as any,
			tags: isly.array(isly.string()).optional(),
			author: isly.string().optional(),
			pages: isly
				.record(
					isly.string(),
					isly.lazy<Page>((): any => Page.type, "binotype.Page")
				)
				.optional()
		},
		"binotype.Page"
	)
	export const { is, flawed } = type.bind()
	export function locate(page: Page | undefined, path: Path): Page | undefined {
		return path.empty ? page : page?.pages ? locate(page.pages[path.getId("camel")], path.tail) : undefined
	}
	export function toArray(pages: Record<string, Page | undefined> | undefined): (Page & { id: string })[] {
		return Block.toArray<Page>(pages)
			.filter(page => !page.draft && (!page.published || page.published <= isoly.DateTime.now()))
			.sort((left, right) => (right.published ?? "z").localeCompare(left.published ?? "z"))
	}
	export function hasPages(page: Page | undefined): page is Page & { pages: Record<string, Page | undefined> } {
		return !!page?.pages && Object.keys(page.pages).length > 0
	}
}
