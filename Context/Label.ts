import { Content } from "../Content"
import { Title } from "../Title"

export interface Label<Node> {
	plain: string
	formatted: Content<Node>
}
export namespace Label {
	export function get<Node>(title: Title<Node>): Label<Node>
	export function get<Node>(title: Title<Node> | undefined): Label<Node> | undefined
	export function get<Node>(title: Title<Node> | undefined): Label<Node> | undefined {
		return title != undefined
			? { plain: Title.get(title, "short"), formatted: Title.get(title, "long-short") as Content<Node> }
			: undefined
	}
	export function convert<Node, Target>(label: Label<Node>, from: (node: Node) => Target): Label<Content<Target>> {
		return { plain: label.plain, formatted: label.formatted && Content.convert(label.formatted, from) }
	}
}
