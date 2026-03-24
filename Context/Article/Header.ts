import { isoly } from "isoly"
import { Site } from "../../Site"

export interface Header {
	title: string
	published?: isoly.DateTime
	changed?: isoly.DateTime
	wordCount?: number
	readingTime?: number
	author?: string
	publication?: string
}
export namespace Header {
	export function load(page: Site.Page): Header {
		return {
			title: Site.Page.getTitle(page),
			author: page.author,
			published: page.published,
			changed: page.changed,
			wordCount: page.content ? String(page.content).split(/\s+/).length : undefined,
			readingTime: page.content ? Math.ceil(String(page.content).split(/\s+/).length / 200) : undefined,
		}
	}
}
