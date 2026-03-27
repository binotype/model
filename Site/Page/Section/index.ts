import { isly } from "isly"
import { Title } from "../Title"
import { Meta } from "../../../Meta"

export interface Section {
	weight?: number
	title?: Title
	meta?: Meta
	type?: string
	class?: string[]
	menu?: false
	content: string | Record<string, Section>
}
export namespace Section {
	export const { is, flawed, type } = isly
		.object<Section>(
			{
				weight: isly.number().optional(),
				title: Title.type.optional(),
				meta: Meta.type.optional(),
				type: isly.string().optional(),
				class: isly.array(isly.string()).optional(),
				menu: isly.boolean(false).optional(),
				content: isly.union(isly.string(), isly.record(isly.string(), isly.lazy<Section>((): any => Section.type, "binotype.Site.Section"))),
			},
			"binotype.Site.Section"
		)
		.bind()
}
