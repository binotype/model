import { isly } from "isly"
import { Mode } from "../Mode"

export interface Design {
	logotype?: string
	icon?: string
	navigation?: "header" | "body"
	styles?: string[]
	scripts?: string[]
	home?: string
	mode?: Mode
	list?: Mode
	menu?: { depth?: number }
}
export namespace Design {
	export const type = isly.object<Design>(
		{
			logotype: isly.string().optional(),
			icon: isly.string().optional(),
			navigation: isly.string("value", "header", "body").optional(),
			styles: isly.array(isly.string()).optional(),
			scripts: isly.array(isly.string()).optional(),
			home: isly.string().optional(),
			mode: Mode.type.optional(),
			list: Mode.type.optional(),
			menu: isly.object({ depth: isly.number().optional() }).optional()
		},
		"binotype.Site.Design"
	)
	export const { is, flawed } = type.bind()
}
