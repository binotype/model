import { isoly } from "isoly"
import { Block } from "../../Block"
import { Content } from "../../Content"
import { Modes } from "../../Modes"
import { Page } from "../../Page"
import { Path } from "../../Path"
import { Section } from "../Section"

export interface Article<Node> extends Section<Node> {
	list: Modes["list"]
	author?: string
	published?: isoly.DateTime
	changed?: isoly.DateTime
	// wordCount?: number
	// readingTime?: number
	articles?: Article<Node>[]
}
export namespace Article {
	export function load<Node>(page: Page<Node>, path: Path, reduction?: Modes, fallback?: Modes): Article<Node>
	export function load<Node>(
		page: Page<Node> | undefined,
		path: Path,
		reduction?: Modes,
		fallback?: Modes
	): Article<Node> | undefined
	export function load<Node>(
		pages: Record<string, Page<Node> | undefined> | undefined,
		path: Path,
		reduction?: Modes,
		fallback?: Modes
	): Article<Node>[] | undefined
	export function load<Node>(
		page: Page<Node> | Record<string, Page<Node> | undefined> | undefined,
		path: Path,
		reduction: Modes = { mode: "full", list: "full" },
		fallback: Modes = reduction
	): Article<Node> | Article<Node>[] | undefined {
		let result: Article<Node> | Article<Node>[] | undefined
		const modes = Modes.reduce(page, reduction, fallback)
		if (!page) result = undefined
		else if (Block.isBlocks(page))
			result =
				page
				&& Page.toArray(page)
					.slice(0, modes.list.limit)
					.map(p => Article.load<Node>(p, path.append(p.id), reduction, fallback))
		else {
			result = !modes.mode
				? undefined
				: (Object.fromEntries(
						Object.entries({
							...Section.load<Node>(page as Page<Node>, path, reduction, modes),
							list: { mode: "none", ...modes.list },
							author: page.author,
							published: page.published,
							changed: page.changed,
							// wordCount: text ? text.split(/\s+/).length : undefined,
							// readingTime: text ? Math.ceil(text.split(/\s+/).length / 200) : undefined,
							...(modes.list.mode != "none" && page.pages
								? {
										articles: Article.load<Node>(
											page.pages,
											path,
											{ mode: modes.list.mode, list: modes.list },
											fallback
										)
									}
								: {})
						} satisfies Article<Node>).filter(([_, value]) => value != undefined)
					) as Article<Node>)
		}
		return result
	}
	export function convert<Node, Target>(
		article: Article<Node>,
		convert: (node: Node) => Target
	): Article<Content<Target>> {
		return {
			list: article.list,
			author: article.author,
			published: article.published,
			changed: article.changed,
			...Section.convert(article, convert),
			articles: article.articles?.map(a => Article.convert(a, convert))
		}
	}
}
