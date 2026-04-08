import { isly } from "isly"
import { Node as _Node } from "./Node"
import { Object as _Object } from "./Object"

export type Content<N = Content.Node> = N | N[] | null

export namespace Content {
	export import Node = _Node
	export import Object = _Object
	export const { is, flawed, type } = isly.union<Content>(
		Node.type,
		isly.array(Node.type),
		isly.null()).rename(
		"binotype.Content"
	).bind()
	export function to(content: Content): Object | Object[] | null {
		return content &&	(Array.isArray(content)
			? content.map(Object.from)
				: Object.from(content))
	}
}
