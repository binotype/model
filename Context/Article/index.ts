import { isoly } from "isoly"
import { Mode } from "../../Mode"
import { Section } from "../Section"
import { Path } from "../../Path"
import { Page } from "../../Page"
import { Content } from "../../Content"
import { Block } from "../../Block"

export interface Article<C = Content> extends Section<C> {
	author?: string
	published?: isoly.DateTime
	changed?: isoly.DateTime
	// wordCount?: number
	// readingTime?: number
	articles?: Article<C>[]
}
export namespace Article {
	export function load(page: Page, path: Path, reduction?: Mode): Article
	export function load(page: Page | undefined, path: Path, reduction?: Mode): Article | undefined
	export function load(page: Record<string, Page> | undefined, path: Path, reduction?: Mode): Article[] | undefined
	export function load(page: Page | Record<string, Page> | undefined, path: Path, reduction?: Mode): Article | Article[] | undefined {
		let result: Article | Article[] | undefined
		if (!page)
			result = undefined
		else if (Block.isBlocks(page))
			result = page && Page.toArray(page).map(p => Article.load(p, path.appendFragment(p.id), reduction))
		else {
			const mode = Mode.reduce(page.mode, reduction ?? page.pages ? "list" : "full")
			result = mode && Object.fromEntries(Object.entries({
				...Section.load(page, path, mode),
				author: page.author,
				published: page.published,
				changed: page.changed,
				// wordCount: page.content ? String(page.content).split(/\s+/).length : undefined,
				// readingTime: page.content ? Math.ceil(String(page.content).split(/\s+/).length / 200) : undefined,
				...((mode == "list") ? {
					articles: load(page.pages, path, mode),
				} : {})
			} satisfies Article).filter(([_, value]) => value !== undefined)) as Article
		}
		return result
	}
	export function toObject(article: Article): Article<Content.Object | Content.Object[] | null> {
		return { ...Section.toObject(article), articles: article.articles?.map(Article.toObject) }
	}
}
