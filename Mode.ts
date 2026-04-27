import { isly } from "isly"

export type Mode = (typeof Mode.values)[number]
export namespace Mode {
	export const values = ["full", "header", "body", "summary", "list"] as const
	export const { is, flawed, type } = isly
		.string("value", ...values)
		.rename("binotype.Mode")
		.bind()
	export function reduce(mode: Mode | undefined, reduction: Mode = "full"): Mode | undefined {
		let result: Mode | undefined
		switch (reduction) {
			case "full":
				result = mode ?? "full"
				break
			case "header":
				result = mode != "body" ? "header" : undefined
				break
			case "body":
				result = mode != "header" ? "body" : undefined
				break
			case "summary":
				result = mode != "header" ? "summary" : undefined
				break
			case "list":
				result = mode != "body" ? "list" : undefined
				break
		}
		return result
	}
	export function parse(value: string | undefined): Mode | undefined {
		return values.find(v => v == value)
	}
}
