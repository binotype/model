import { isly } from "isly"

export interface Design {
	logotype?: string
	icon?: string
	navigation?: "header" | "body"
	styles?: string[]
	scripts?: string[]
	home?: {
		mode: "body" | "full" | "header" | "list" | "summary"
		section: string
	}
	list?: {
		mode: "body" | "full" | "header" | "list" | "summary"
	}
}
export namespace Design {
	export const { is, flawed, type } = isly
		.object<Design>(
			{
				logotype: isly.string().optional(),
				icon: isly.string().optional(),
				navigation: isly.string("value", "header", "body").optional(),
				styles: isly.array(isly.string()).optional(),
				scripts: isly.array(isly.string()).optional(),
				home: isly
					.object({
						mode: isly.string("value", "body", "full", "header", "list", "summary"),
						section: isly.string(),
					})
					.optional(),
				list: isly
					.object({
						mode: isly.string("value", "body", "full", "header", "list", "summary"),
					})
					.optional(),
			},
			"binotype.Site.Design"
		)
		.bind()
}
