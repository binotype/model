import { isly } from "isly"
import { Mode } from "./Mode"

export interface Modes {
	mode?: Mode
	list?: Mode | { mode?: Mode; limit?: number }
}
export namespace Modes {
	export const {
		is,
		flawed,
		type
	}: isly.BindResult<Modes, isly.Object<Modes>> = isly
		.object<Modes>(
			{
				mode: Mode.type.optional(),
				list: isly.union(
					Mode.type.optional(),
					isly.object({ mode: Mode.type.optional(), limit: isly.number().optional() }).optional()
				)
			},
			"binotype.Modes"
		)
		.bind()
	export interface Normalized {
		mode?: Mode
		list: { mode?: Mode; limit?: number }
	}
	export function normalize(modes: Modes | undefined): Normalized {
		return {
			mode: modes?.mode,
			list:
				typeof modes?.list == "string" ? { mode: modes.list } : { mode: modes?.list?.mode, limit: modes?.list?.limit }
		}
	}
	export function limit(value: number | undefined, limit: number | undefined): number | undefined {
		return value !== undefined && limit !== undefined ? Math.min(value, limit) : (value ?? limit)
	}
	export function reduce(modes: Modes | undefined, reduction: Modes = {}, fallback: Modes | undefined): Normalized {
		const m = normalize(modes)
		const r = normalize(reduction)
		const f = normalize(fallback)
		const l = limit(m.list.limit ?? f.list.limit, r.list.limit)
		return {
			mode: Mode.reduce(m.mode ?? f.mode, r.mode),
			list: { mode: Mode.reduce(m.list.mode ?? f.list.mode, r.list.mode), ...(l === undefined ? {} : { limit: l }) }
		}
	}
}
