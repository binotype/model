import { Design } from "../Design"
import { Meta } from "../Meta"
import { Mode } from "../Mode"
import { Page } from "../Page"
import { Path } from "../Path"
import { Site } from "../Site"
import { Article as _Article } from "./Article"
import { Label as _Label } from "./Label"
import { Menu as _Menu } from "./Menu"
import { Section as _Section } from "./Section"

export class Context<Node> {
	path: Path
	get title(): string {
		return this.site.title
	}
	tagline?: string
	image?: string
	description?: string
	get base(): string {
		return this.site.url
	}
	get url(): string {
		return this.site.url + this.path.toString()
	}
	get meta(): Meta {
		return this.site.meta ?? {}
	}
	get design(): Design {
		return this.site.design
	}
	private _menu: Context.Menu<Node> | undefined
	get menu(): Context.Menu<Node> {
		return (this._menu ??= Context.Menu.load(this.site, this.path.toString()))
	}
	private _article: Context.Article<Node> | undefined
	get article(): Context.Article<Node> | undefined {
		return (this._article ??=
			this.load(this.path) ?? Context.Article.load<Node>({ title: "Not Found", content: undefined }, this.path, "full"))
	}
	private constructor(
		private readonly site: Site<Node>,
		path: Path | string
	) {
		this.path = typeof path == "string" ? Path.parse(path) : path
	}
	load(path: Path | string | undefined, mode: Mode = "full", count?: number): Context.Article<Node> | undefined {
		if (!(path instanceof Path)) path = Path.parse(path ?? "")
		if (path.empty && this.site.design.home?.section) path = Path.parse(this.site.design.home.section)
		const page = Page.locate(this.site.page, path)
		return (
			page
			&& Context.Article.load(
				page,
				path,
				mode
				// this.site.design,
				// count
			)
		)
	}
	toJSON() {
		return Object.fromEntries(
			Object.entries({
				title: this.title,
				tagline: this.tagline,
				image: this.image,
				description: this.description,
				base: this.base,
				url: this.url,
				design: this.design,
				menu: Context.Menu.convert(this.menu, node => node),
				article: this.article && Context.Article.convert(this.article, node => node)
			}).filter(([_, value]) => value !== undefined)
		)
	}
	static create<Node>(site: Site<Node>, path: Path | string): Context<Node> {
		return new Context(site, path)
	}
}
export namespace Context {
	export import Article = _Article
	export import Label = _Label
	export import Menu = _Menu
	export import Section = _Section
}
