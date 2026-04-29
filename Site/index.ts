import { isoly } from "isoly"
import { isly } from "isly"
import { Design } from "../Design"
import { Page } from "../Page"
import { Meta } from "../Meta"

export interface Site<Node> {
	url: string
	language: isoly.Locale
	title: string
	tagline: string
	description?: string
	keywords?: string[]
	author?: string
	meta?: Meta
	design: Design
	page: Page<Node>
}
export namespace Site {
	export function getType<Node>(nodeType: isly.Type<Node>): isly.Object<Site<Node>> {
		return isly.object<Site<Node>>(
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
				page: Page.getType<Node>(nodeType)
			},
			"binotype.Site"
		)
	}
}
