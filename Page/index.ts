import { isoly } from "isoly"
import { isly } from "isly"
import { Path } from "../Path"
import { Block } from "../Block"

export interface Page<Node> extends Block<Node> {
	draft?: boolean
	published?: isoly.DateTime
	changed?: isoly.DateTime
	tags?: string[]
	author?: string
	pages?: Record<string, Page<Node> | undefined>
}
export namespace Page {
	export function getType<Node>(nodeType: isly.Type<Node>): isly.Object<Page<Node>> {
		return Block.getType<Node>(nodeType).extend<Page<Node>>(
			{
				draft: isly.boolean().optional(),
				published: isoly.DateTime.type.optional() as any,
				changed: isoly.DateTime.type.optional() as any,
				tags: isly.array(isly.string()).optional(),
				author: isly.string().optional(),
				pages: isly
					.record(
						isly.string(),
						isly.lazy<Page<Node>>((): any => Page.getType<Node>(nodeType), "binotype.Page")
					)
					.optional()
			},
			"binotype.Page"
		)
	}
	export function locate<Node>(page: Page<Node> | undefined, path: Path): Page<Node> | undefined {
		return path.empty ? page : page?.pages ? locate<Node>(page.pages[path.getId("camel")], path.tail) : undefined
	}
	export function toArray<Node>(
		pages: Record<string, Page<Node> | undefined> | undefined
	): (Page<Node> & { id: string })[] {
		return Block.toArray(pages)
			.filter(page => !page.draft && (!page.published || page.published <= isoly.DateTime.now()))
			.sort((left, right) => (right.published ?? "z").localeCompare(left.published ?? "z"))
	}
	export function hasPages<Node>(
		page: Page<Node> | undefined
	): page is Page<Node> & { pages: Record<string, Page<Node> | undefined> } {
		return !!page?.pages && Object.keys(page.pages).length > 0
	}
}
