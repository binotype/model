import { isly } from "isly"

export class Path {
	get empty(): boolean {
		return this.parts.length == 0
	}
	get leaf(): boolean {
		return this.parts.length == 1
	}
	get head(): string | undefined {
		return this.parts.length > 0 ? this.parts[0] : undefined
	}
	get tail(): Path {
		return new Path(this.parts.slice(1))
	}
	readonly fragment?: string
	private constructor(private readonly parts: string[], fragment?: string) {
		this.fragment = fragment
	}
	getId(casing: "snake" | "camel" = "snake"): string {
		return Path.getId(this.head ?? "", casing)
	}
	append(id: string): Path {
		return new Path([...this.parts, Path.getId(id, "snake")])
	}
	appendFragment(fragment: string): Path {
		return new Path(this.parts, fragment)
	}
	toString(): string {
		return `/${this.parts.join("/")}${this.fragment ? `#${this.fragment}` : ""}`
	}
	static get empty(): Path {
		return new Path([])
	}
	static parse(path: string): Path {
		const [p, fragment] = path.split("#")
		return new Path(
			(p || "").split("/").filter(part => part != ""),
			fragment
		)
	}
	static getId(id: string, casing: "snake" | "camel" = "snake"): string {
		return casing == "snake"
			? id
					.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
					.toLowerCase()
					.normalize("NFKD")
					.replace(/[\u0300-\u036f]/g, "")
					.replace(/[^a-z0-9-]+/g, "-")
					.replace(/-+/g, "-")
					.replace(/^-+|-+$/g, "") ?? "untitled"
			: id.toLowerCase().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
	}
	static absolutify(path: string): string {
		return (path.startsWith("/") || path.includes("://") ? "" : "/") + path
	}
	static isUrl(path: string): boolean {
		return /^(?:\.\.?\/|\/|(?:https?:)?\/\/)/i.test(path)
	}
}
export namespace Path {
	export const { is, flawed, type } = isly
		.object<Path>(
			{
				empty: isly.boolean().readonly(),
				leaf: isly.boolean().readonly(),
				head: isly.string().optional().readonly(),
				tail: isly.any().readonly(),
				fragment: isly.string().optional().readonly(),
				getId: isly.function(),
				append: isly.function(),
				appendFragment: isly.function(),
				toString: isly.function(),
			},
			"binotype.Site.Page.Path"
		)
		.bind()
}
