import { isly } from "isly"
import { isoly } from "isoly"
import { Block } from "../Block"
import { Mode } from "../Mode"
import { Modes } from "../Modes"
import { Path } from "../Path"

export interface Page<Node> extends Block<Node> {
	list?: Modes["list"]
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
				list: isly
					.union(Mode.type, isly.object({ mode: Mode.type.optional(), limit: isly.number().optional() }))
					.optional(),
				draft: isly.boolean().optional(),
				published: isoly.DateTime.type.optional() as any,
				changed: isoly.DateTime.type.optional() as any,
				tags: isly.array(isly.string()).optional(),
				author: isly.string().optional(),
				pages: isly
					.record(
						isly.string(),
						isly.lazy<Page<Node>>((): any => Page.getType<Node>(nodeType), `binotype.Page<${nodeType.name}>`)
					)
					.optional()
			},
			`binotype.Page<${nodeType.name}>`
		)
	}
	export function locate<Node>(page: Page<Node> | undefined, path: Path): Page<Node> | undefined {
		return path.empty
			? page
			: !page?.pages || !path.head
				? undefined
				: locate<Node>(page.pages[path.get("head")], path.tail)
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
