import { isoly } from "isoly"
import { isly } from "isly"
import { Design as _Design } from "./Design"
import { Page as _Page } from "./Page"

export interface Site {
	url: string
	language: isoly.Locale
	title: string
	tagline: string
	description?: string
	keywords?: string[]
	author?: string
	design: Site.Design
	page: Site.Page
}
export namespace Site {
	export import Design = _Design
	export import Page = _Page
	export const { is, flawed, type }: { is: any; flawed: any; type: any } = isly
		.object<Site>(
			{
				url: isly.string(),
				language: isoly.Locale.type as any,
				title: isly.string(),
				tagline: isly.string(),
				description: isly.string().optional(),
				keywords: isly.array(isly.string()).optional(),
				author: isly.string().optional(),
				design: Design.type,
				page: Page.type,
			},
			"binotype.Site"
		)
		.bind()
}
