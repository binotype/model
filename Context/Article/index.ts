import { isoly } from "isoly"
import { Mode } from "../../Mode"
import { Section } from "../Section"
import { Path } from "../../Path"
import { Page } from "../../Page"
import { Content } from "../../Content"
import { Block } from "../../Block"

export interface Article<Node> extends Section<Node> {
	author?: string
	published?: isoly.DateTime
	changed?: isoly.DateTime
	// wordCount?: number
	// readingTime?: number
	articles?: Article<Node>[]
}
export namespace Article {
	export function load<Node>(page: Page<Node>, path: Path, reduction?: Mode): Article<Node>
	export function load<Node>(page: Page<Node> | undefined, path: Path, reduction?: Mode): Article<Node> | undefined
	export function load<Node>(
		pages: Record<string, Page<Node> | undefined> | undefined,
		path: Path,
		reduction?: Mode
	): Article<Node>[] | undefined
	export function load<Node>(
		page: Page<Node> | Record<string, Page<Node> | undefined> | undefined,
		path: Path,
		reduction?: Mode
	): Article<Node> | Article<Node>[] | undefined {
		let result: Article<Node> | Article<Node>[] | undefined
		if (!page) result = undefined
		else if (Block.isBlocks(page))
			result = page && Page.toArray(page).map(p => Article.load<Node>(p, path.appendFragment(p.id), reduction))
		else {
			const mode = Mode.reduce(
				(page as Page<Node>).mode,
				((page as Page<Node>).pages ? reduction : undefined) ?? "full"
			)
			result =
				mode
				&& (Object.fromEntries(
					Object.entries({
						...Section.load<Node>(page as Page<Node>, path, mode),
						author: (page as Page<Node>).author,
						published: (page as Page<Node>).published,
						changed: (page as Page<Node>).changed,
						// wordCount: text ? text.split(/\s+/).length : undefined,
						// readingTime: text ? Math.ceil(text.split(/\s+/).length / 200) : undefined,
						...(mode == "list" ? { articles: load<Node>((page as Page<Node>).pages, path, mode) } : {})
					} satisfies Article<Node>).filter(([_, value]) => value != undefined)
				) as Article<Node>)
		}
		return result
	}
	export function convert<Node, Target>(
		article: Article<Node>,
		convert: (node: Node) => Target
	): Article<Content<Target>> {
		return { ...Section.convert(article, convert), articles: article.articles?.map(a => Article.convert(a, convert)) }
	}
}
