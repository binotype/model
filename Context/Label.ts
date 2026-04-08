import { Content } from "../Content"
import { Title } from "../Title"


export interface Label<C = Content> {
	plain: string
	formatted: Content
}
export namespace Label {
	export function get(title: Title): Label {
		return { plain: Title.get(title, "short"), formatted: Title.get(title, "long-short") };
	}
}
