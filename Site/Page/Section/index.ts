import { isly } from "isly"
import { Title } from "../Title"

export interface Section {
	weight?: number
	title?: Title
	menu?: false
	type?: string
	content: string | Record<string, Section>
}
export namespace Section {
	export const { is, flawed, type } = isly
		.object<Section>(
			{
				weight: isly.number().optional(),
				title: Title.type.optional(),
				menu: isly.boolean(false).optional(),
				type: isly.string().optional(),
				content: isly.union(isly.string(), isly.record(isly.string(), isly.lazy<Section>((): any => Section.type, "binotype.Site.Section"))),
			},
			"binotype.Site.Section"
		)
		.bind()
}
