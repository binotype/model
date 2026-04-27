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

export class Context {
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
	private _menu: Context.Menu | undefined
	get menu(): Context.Menu {
		return (this._menu ??= Context.Menu.load(this.site, this.path.toString()))
	}
	private _article: Context.Article | undefined
	get article(): Context.Article | undefined {
		return (this._article ??=
			this.load(this.path) ?? Context.Article.load({ title: "Not Found", content: undefined }, this.path, "full"))
	}
	private constructor(
		private readonly site: Site,
		path: Path | string
	) {
		this.path = typeof path == "string" ? Path.parse(path) : path
	}
	load(path: Path | string | undefined, mode: Mode = "full", count?: number): Context.Article | undefined {
		if (!(path instanceof Path)) path = Path.parse(path ?? "")
		if (path.empty && this.site.design.home?.section) path = Path.parse(this.site.design.home.section)
		const page = Page.locate(this.site.page, path)
		return (
			page
			&& Context.Article.load(
				page,
				path,
				mode
				//				this.site.design,
				//				count
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
				menu: Context.Menu.toObject(this.menu),
				article: this.article && Context.Article.toObject(this.article)
			}).filter(([_, value]) => value !== undefined)
		)
	}
	static create(site: Site, path: Path | string): Context {
		return new Context(site, path)
	}
}
export namespace Context {
	export import Article = _Article
	export import Label = _Label
	export import Menu = _Menu
	export import Section = _Section
}
