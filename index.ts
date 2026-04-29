import { Block as _Block } from "./Block"
import { Content as _Content } from "./Content"
import { Context as _Context } from "./Context"
import { Design as _Design } from "./Design"
import { Meta as _Meta } from "./Meta"
import { Mode as _Mode } from "./Mode"
import { Page as _Page } from "./Page"
import { Parser as _Parser } from "./Parser"
import { Path as _Path } from "./Path"
import { Site as _Site } from "./Site"
import { Title as _Title } from "./Title"
import { Section as _Section } from "./Context/Section"
import { Article as _Article } from "./Context/Article"
import { Menu as _Menu } from "./Context/Menu"
import { Label as _Label } from "./Context/Label"

export namespace binotype {
	export import Block = _Block
	export import Content = _Content
	export import Context = _Context
	export import Design = _Design
	export import Meta = _Meta
	export import Mode = _Mode
	export import Page = _Page
	export import Parser = _Parser
	export import Path = _Path
	export import Site = _Site
	export import Title = _Title
	export import Section = _Section
	export import Article = _Article
	export import Menu = _Menu
	export import Label = _Label
}
