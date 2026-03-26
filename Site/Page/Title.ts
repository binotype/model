import { isly } from "isly";

export type Title = string | {
	short: string;
	long: string;
};
export namespace Title {
	export const { is, flawed, type } = isly.union<Title>(isly.string(), isly.object({ short: isly.string(), long: isly.string() })).rename("binotype.Site.Page.Title").bind()
	export function get(node: { title?: Title }, preference: "short" | "long" | "short-long" | "long-short" = "long-short"): string | undefined {
		const p = preference.split("-", 2) as ["short" | "long", "short" | "long" | undefined]
		const t: { short?: string; long?: string } = !node.title || typeof node.title == "string" ? { short: node.title } : node.title
		return t[p[0]] ?? (p[1] && t[p[1]])
	}}
