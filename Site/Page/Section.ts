import { isly } from "isly"

export interface Section {
	weight?: number
	title?: string
	menu?: false
	type?: string
	content: string
}
export namespace Section {
	export const { is, flawed, type } = isly
		.object<Section>(
			{
				weight: isly.number().optional(),
				title: isly.string().optional(),
				menu: isly.boolean(false).optional(),
				type: isly.string().optional(),
				content: isly.string(),
			},
			"binotype.Site.Section"
		)
		.bind()
}
