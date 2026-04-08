import { isly } from "isly"
import { Title } from "../Title"
import { Meta } from "../Meta"
import { Mode } from "../Mode"
import { Content } from "../Content"

export interface Block {
	weight?: number
	title?: Title
	subtitle?: Content
	meta?: Meta
	mode?: Mode
	type?: string
	class?: string[]
	menu?: false
	content?: Content
	blocks?: Record<string, Block>
}
export namespace Block {
	export const { is, flawed, type } = isly
		.object<Block>(
			{
				weight: isly.number().optional(),
				title: Title.type.optional(),
				subtitle: Content.type.optional(),
				meta: Meta.type.optional(),
				mode: Mode.type.optional(),
				type: isly.string().optional(),
				class: isly.array(isly.string()).optional(),
				menu: isly.boolean(false).optional(),
				content: Content.type.optional(),
				blocks: isly.record(isly.string(), isly.lazy((): any => Block.type, "binotype.Block")).optional(),
			},
			"binotype.Block"
		)
		.bind()
	export function toArray<R extends { weight?: number } = Block>(blocks: Record<string, R> | undefined): (R & { id: string })[] {
		return Object.entries(blocks ?? {})
		.map(([id, block]) => ({ ...block, id }))
		.sort(
			(left, right) =>
				(left.weight ?? 100) - (right.weight ?? 100)
		)
	}
	export function isBlocks(block: Block | Record<string, Block> | undefined): block is Record<string, Block> {
		return block != undefined && Object.values(block).every(b => typeof b == "object")
	}
}
