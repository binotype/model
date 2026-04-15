import { ChildNode, FunctionalUtilities, VNode } from "@stencil/core"
import { isly } from "isly"

export type Node = VNode

export namespace Node {
	export const { is, flawed, type } = (isly.object({
		$flags$: isly.number(),
		$tag$: isly.union(isly.string(), isly.number(), isly.function(), isly.undefined()),
		$elm$: isly.union(isly.any(), isly.null()),
		$text$: isly.union(isly.string(), isly.null()),
		// $children$: isly.union(isly.array(isly.lazy<Node>((): isly.Object<Node> => Node.type, "VNode")), isly.null()),
		$attrs$: isly.any().optional(),
		$name$: isly.union(isly.string(), isly.null()),
		$key$: isly.union(isly.string(), isly.number(), isly.null())
	},"binotype.Node") as isly.Object<Node>).bind()
	export function plain(node: Node): string {
		return [node.$text$ ?? "", ...node.$children$?.map(plain)].join("")
	}
}

/*
$attrs$ = any
$children$ = [ {$flags$: 0, $tag$: null, $text$: 'This is a single node content.', $elm$: null, $children$: null, …} ]
$attrs$ = null
$children$ = null
$elm$ = null
$flags$ = 0
$key$ = null
$name$ = null
$tag$ = null
$text$ = 'This is a single node content.'
$elm$ = null
$flags$ = 0
$key$ = null
$name$ = null
$tag$ = undefined
$text$ = null
*/
