import { isly } from "isly"
import { Mode } from "../Mode"
import { Modes } from "../Modes"

export interface Design {
	logotype?: string
	icon?: string
	navigation?: "header" | "body"
	styles?: string[]
	scripts?: string[]
	home?: string
	mode?: Mode
	list?: Modes["list"]
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
			list: isly
				.union(Mode.type, isly.object({ mode: Mode.type.optional(), limit: isly.number().optional() }))
				.optional(),
			menu: isly.object({ depth: isly.number().optional() }).optional()
		},
		"binotype.Site.Design"
	)
	export const { is, flawed } = type.bind()
}
