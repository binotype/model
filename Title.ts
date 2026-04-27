import { isly } from "isly"
import { Content } from "./Content"

export type Title = string | { short: string; long: Content }
export namespace Title {
	export const type: isly.Union<Title> = isly
		.union<Title>(isly.string(), isly.object({ short: isly.string(), long: Content.type }))
		.rename("binotype.Title")
	export const { is, flawed } = type.bind()
	export function get(title: Title | undefined, preference: "short"): string
	export function get(title: Title | undefined, preference: "long-short"): Content
	export function get(title: Title | undefined, preference: "long" | "long-short"): Content | undefined
	export function get(
		title: Title | undefined,
		preference: "short" | "long" | "long-short" = "long-short"
	): string | Content | undefined {
		const p = preference.split("-", 2) as ["short" | "long", "short" | "long" | undefined]
		const t: { short?: string; long?: Content } = !title || typeof title == "string" ? { short: title } : title
		return t[p[0]] ?? (p[1] && t[p[1]])
	}
	export function from(short?: string, long?: Content): Title | undefined {
		return short && long ? { short, long } : short
	}
}
