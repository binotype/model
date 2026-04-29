import { isly } from "isly"

export type Content<Node> = Node | Node[] | null

export namespace Content {
	export function getType<Node>(nodeType: isly.Type<Node>): isly.Union<Content<Node>> {
		return isly.union<Content<Node>>(nodeType, isly.array(nodeType), isly.null())
	}
	export function convert<Node, Target>(content: Content<Node>, from: (node: Node) => Target): Content<Target> {
		return content && (Array.isArray(content) ? content.map(from) : from(content))
	}
	export function plain<Node>(content: Content<Node>, plain: (node: Node) => string): string {
		return content ? (Array.isArray(content) ? content.map(plain).join("") : plain(content)) : ""
	}
}
