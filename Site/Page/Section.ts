import { isly } from "isly"
import { Title } from "./Title"

export interface Section {
	weight?: number
	title?: Title
	menu?: false
	type?: string
	content: string
}
export namespace Section {
	export const { is, flawed, type } = isly
		.object<Section>(
			{
				weight: isly.number().optional(),
				title: Title.type.optional(),
				menu: isly.boolean(false).optional(),
				type: isly.string().optional(),
				content: isly.string(),
			},
			"binotype.Site.Section"
		)
		.bind()
}
