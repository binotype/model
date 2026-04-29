import { isly } from "isly"
import { Content } from "./Content"

export type Title<Node> = string | { short: string; long: Content<Node> }
export namespace Title {
	export function getType<Node>(nodeType: isly.Type<Node>): isly.Union<Title<Node>> {
		return isly
			.union<Title<Node>>(isly.string(), isly.object({ short: isly.string(), long: Content.getType(nodeType) }))
			.rename("binotype.Title")
	}
	export function get<Node>(title: Title<Node> | undefined, preference: "short"): string
	export function get<Node>(title: Title<Node> | undefined, preference: "long-short"): Content<Node>
	export function get<Node>(
		title: Title<Node> | undefined,
		preference: "long" | "long-short"
	): Content<Node> | undefined
	export function get<Node>(
		title: Title<Node> | undefined,
		preference: "short" | "long" | "long-short" = "long-short"
	): string | Content<Node> | undefined {
		const p = preference.split("-", 2) as ["short" | "long", "short" | "long" | undefined]
		const t: { short?: string; long?: Content<Node> } = !title || typeof title == "string" ? { short: title } : title
		return t[p[0]] ?? (p[1] && t[p[1]])
	}
	export function from<Node>(short?: string, long?: Content<Node>): Title<Node> | undefined {
		return short && long ? { short, long } : short
	}
}
