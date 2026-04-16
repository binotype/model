import { isoly } from "isoly"
import { isly } from "isly"
import { Design } from "../Design"
import { Page } from "../Page"
import { Meta } from "../Meta"

export interface Site {
	url: string
	language: isoly.Locale
	title: string
	tagline: string
	description?: string
	keywords?: string[]
	author?: string
	meta?: Meta
	design: Design
	page: Page
}
export namespace Site {
	export const type = isly
		.object<Site>(
			{
				url: isly.string(),
				language: isoly.Locale.type as any,
				title: isly.string(),
				tagline: isly.string(),
				description: isly.string().optional(),
				keywords: isly.array(isly.string()).optional(),
				author: isly.string().optional(),
				meta: Meta.type.optional(),
				design: Design.type,
				page: Page.type,
			},
			"binotype.Site"
		)
	export const { is, flawed } = type.bind()
}
