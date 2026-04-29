import { isly } from "isly"
import { Title } from "../Title"
import { Meta } from "../Meta"
import { Mode } from "../Mode"
import { Content } from "../Content"

export interface Block<Node> {
	weight?: number
	title?: Title<Node>
	subtitle?: Content<Node>
	meta?: Meta
	mode?: Mode
	type?: string
	class?: string[]
	menu?: false
	content?: Content<Node>
	blocks?: Record<string, Block<Node> | undefined>
}
export namespace Block {
	export function getType<Node>(nodeType: isly.Type<Node>): isly.Object<Block<Node>> {
		return isly.object<Block<Node>>(
			{
				weight: isly.number().optional(),
				title: Title.getType<Node>(nodeType).optional(),
				subtitle: Content.getType<Node>(nodeType).optional(),
				meta: Meta.type.optional(),
				mode: Mode.type.optional(),
				type: isly.string().optional(),
				class: isly.array(isly.string()).optional(),
				menu: isly.boolean(false).optional(),
				content: Content.getType<Node>(nodeType).optional(),
				blocks: isly
					.record(
						isly.string(),
						isly.lazy((): any => Block.getType(nodeType), "binotype.Block")
					)
					.optional()
			},
			"binotype.Block<Node>"
		)
	}
	export function toArray<Node, R extends Block<Node> = Block<Node>>(
		blocks: Record<string, R | undefined> | undefined
	): (R & { id: string })[] {
		return Object.entries(blocks ?? {})
			.filter((entry): entry is [string, R] => entry[1] != undefined)
			.map(([id, block]) => ({ ...block, id }))
			.sort((left, right) => (left.weight ?? 100) - (right.weight ?? 100))
	}
	export function isBlocks<Node>(
		block: Block<Node> | Record<string, Block<Node> | undefined> | undefined
	): block is Record<string, Block<Node> | undefined> {
		return block != undefined && Object.values(block).every(b => typeof b == "object")
	}
}
