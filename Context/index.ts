import { Site } from "../Site"
import { Article as _Article } from "./Article"
import { Header as _Header } from "./Header"
import { Menu as _Menu } from "./Menu"

export class Context {
	path: Site.Page.Path
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
	get design(): Site.Design {
		return this.site.design
	}
	private _menu: Context.Menu | undefined
	get menu(): Context.Menu {
		return (this._menu ??= Context.Menu.load(this.site, this.path.toString()))
	}
	private _article: Context.Article | undefined
	get article(): Context.Article {
		return (this._article ??=
			this.load(this.path) ??
			Context.Article.load(
				{
					path: this.path,
					mode: "full",
					title: "Not Found",
					content: "The requested page was not found.",
				},
				this.site.design
			))
	}
	private constructor(private readonly site: Site, path: Site.Page.Path | string) {
		this.path = typeof path == "string" ? Site.Page.Path.parse(path) : path
	}
	load(
		path: Site.Page.Path | string | undefined,
		mode: Context.Article.Mode = "full",
		count?: number
	): Context.Article | undefined {
		if (!(path instanceof Site.Page.Path))
			path = Site.Page.Path.parse(path ?? "")
		if (path.empty && this.site.design.home?.section)
			path = Site.Page.Path.parse(this.site.design.home.section)
		const page = Site.Page.locate(this.site.page, path)
		return (
			page &&
			Context.Article.load(
				{
					...page,
					path,
					mode: mode,
				},
				this.site.design,
				count
			)
		)
	}
	toJSON() {
		return {
			title: this.title,
			tagline: this.tagline,
			image: this.image,
			description: this.description,
			base: this.base,
			url: this.url,
			design: this.design,
			menu: this.menu,
			article: this.article,
		}
	}
	static create(site: Site, path: Site.Page.Path | string): Context {
		return new Context(site, path)
	}
}
export namespace Context {
	export import Article = _Article
	export import Header = _Header
	export import Menu = _Menu
}
