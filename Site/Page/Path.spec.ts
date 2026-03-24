import { describe, expect, it } from "vitest"
import { binotype } from "../../index"

describe("binotype.Site.Page.Path", () => {
	it.each([
		{ input: "", expected: { parts: [], fragment: undefined } },
		{ input: "/", expected: { parts: [], fragment: undefined } },
		{ input: "/home", expected: { parts: ["home"], fragment: undefined } },
		{ input: "/home/user", expected: { parts: ["home", "user"], fragment: undefined } },
		{ input: "home/user", expected: { parts: ["home", "user"], fragment: undefined } },
		{ input: "/home/user#section", expected: { parts: ["home", "user"], fragment: "section" } },
		{ input: "home#fragment", expected: { parts: ["home"], fragment: "fragment" } },
		{ input: "#fragment", expected: { parts: [], fragment: "fragment" } },
		{ input: "//double//slash", expected: { parts: ["double", "slash"], fragment: undefined } },
	])("parse('$input') == '$expected'", ({ input, expected }) => {
		const path = binotype.Site.Page.Path.parse(input)
		expect(path.empty).toBe(expected.parts.length == 0)
		expect(path.leaf).toBe(expected.parts.length == 1)
		expect(path.head).toBe(expected.parts[0])
		expect(path.fragment).toBe(expected.fragment)
	})
	it("empty path", () => {
		const empty = binotype.Site.Page.Path.empty
		expect(empty.empty).toBe(true)
		expect(empty.leaf).toBe(false)
		expect(empty.head).toBeUndefined()
		expect(empty.fragment).toBeUndefined()
	})
	it.each([
		{ path: binotype.Site.Page.Path.empty, empty: true, leaf: false, head: undefined },
		{ path: binotype.Site.Page.Path.parse("/home"), empty: false, leaf: true, head: "home" },
		{ path: binotype.Site.Page.Path.parse("/home/user"), empty: false, leaf: false, head: "home" },
		{ path: binotype.Site.Page.Path.parse("/a/b/c"), empty: false, leaf: false, head: "a" },
	])("empty leaf head", ({ path, empty, leaf, head }) => {
		expect(path.empty).toBe(empty)
		expect(path.leaf).toBe(leaf)
		expect(path.head).toBe(head)
	})
	it.each([
		{ input: binotype.Site.Page.Path.empty, expected: binotype.Site.Page.Path.empty },
		{ input: binotype.Site.Page.Path.parse("/home"), expected: binotype.Site.Page.Path.empty },
		{ input: binotype.Site.Page.Path.parse("/home/user"), expected: binotype.Site.Page.Path.parse("/user") },
		{ input: binotype.Site.Page.Path.parse("/a/b/c"), expected: binotype.Site.Page.Path.parse("/b/c") },
	])("('$input').tail == '$expected'", ({ input, expected }) => expect(input.tail.toString()).toBe(expected.toString()))
	it.each([
		{ input: "camelCase", casing: "snake", expected: "camel-case" },
		{ input: "PascalCase", casing: "snake", expected: "pascal-case" },
		{ input: "UPPERCASE", casing: "snake", expected: "uppercase" },
		{ input: "already-snake", casing: "snake", expected: "already-snake" },
		{ input: "with spaces", casing: "snake", expected: "with-spaces" },
		{ input: "with_underscores", casing: "snake", expected: "with-underscores" },
		{ input: "special@chars#here", casing: "snake", expected: "special-chars-here" },
		{ input: "café", casing: "snake", expected: "cafe" },
		{ input: "múltiple-áccénts", casing: "snake", expected: "multiple-accents" },
		{ input: "", casing: "snake", expected: "" },
		{ input: "---", casing: "snake", expected: "" },
		{ input: "hello-world", casing: "camel", expected: "helloWorld" },
		{ input: "multi-word-string", casing: "camel", expected: "multiWordString" },
		{ input: "single", casing: "camel", expected: "single" },
		{ input: "already-camelCase", casing: "camel", expected: "alreadyCamelcase" },
	] as const)("static getId('$input', '$casing') == '$expected'", ({ input, casing, expected }) =>
		expect(binotype.Site.Page.Path.getId(input, casing)).toBe(expected)
	)
	it.each([
		{ path: binotype.Site.Page.Path.parse("/camelCase"), casing: "snake", expected: "camel-case" },
		{ path: binotype.Site.Page.Path.parse("/PascalCase"), casing: "camel", expected: "pascalcase" },
		{ path: binotype.Site.Page.Path.empty, casing: "snake", expected: "" },
		{ path: binotype.Site.Page.Path.parse("/hello-world"), casing: "camel", expected: "helloWorld" },
	] as const)("getId('$path', '$casing') == '$expected'", ({ path, casing, expected }) =>
		expect(path.getId(casing)).toBe(expected)
	)
	it.each([
		{ path: binotype.Site.Page.Path.empty, id: "home", expected: "/home" },
		{ path: binotype.Site.Page.Path.parse("/home"), id: "user", expected: "/home/user" },
		{ path: binotype.Site.Page.Path.parse("/home"), id: "CamelCase", expected: "/home/camel-case" },
		{ path: binotype.Site.Page.Path.parse("/a/b"), id: "special chars", expected: "/a/b/special-chars" },
	])("append('$path', '$id') == '$expected'", ({ path, id, expected }) =>
		expect(path.append(id).toString()).toBe(expected)
	)
	it.each([
		{ path: binotype.Site.Page.Path.empty, fragment: "section", expected: "/#section" },
		{ path: binotype.Site.Page.Path.parse("/home"), fragment: "top", expected: "/home#top" },
		{ path: binotype.Site.Page.Path.parse("/home/user"), fragment: "content", expected: "/home/user#content" },
		{ path: binotype.Site.Page.Path.parse("/home#old"), fragment: "new", expected: "/home#new" },
	])("appendFragment('$path', '$fragment') == '$expected'", ({ path, fragment, expected }) =>
		expect(path.appendFragment(fragment).toString()).toBe(expected)
	)
	it.each([
		{ path: binotype.Site.Page.Path.empty, expected: "/" },
		{ path: binotype.Site.Page.Path.parse("/home"), expected: "/home" },
		{ path: binotype.Site.Page.Path.parse("/home/user"), expected: "/home/user" },
		{ path: binotype.Site.Page.Path.parse("/home#section"), expected: "/home#section" },
		{ path: binotype.Site.Page.Path.parse("/a/b/c#fragment"), expected: "/a/b/c#fragment" },
	])("toString('$path') == '$expected'", ({ path, expected }) => expect(path.toString()).toBe(expected))
	it.each([
		{ input: "/already/absolute", expected: "/already/absolute" },
		{ input: "relative/path", expected: "/relative/path" },
		{ input: "https://example.com/path", expected: "https://example.com/path" },
		{ input: "http://example.com/path", expected: "http://example.com/path" },
		{ input: "//protocol-relative.com/path", expected: "//protocol-relative.com/path" },
		{ input: "ftp://example.com/file", expected: "ftp://example.com/file" },
		{ input: "", expected: "/" },
		{ input: "single", expected: "/single" },
	])("absolutify('$input') == '$expected'", ({ input, expected }) =>
		expect(binotype.Site.Page.Path.absolutify(input)).toBe(expected)
	)
	it.each([
		{ input: "/absolute/path", expected: true },
		{ input: "./relative/path", expected: true },
		{ input: "../parent/path", expected: true },
		{ input: "https://example.com", expected: true },
		{ input: "http://example.com", expected: true },
		{ input: "//protocol-relative.com", expected: true },
		{ input: "relative/path", expected: false },
		{ input: "filename.txt", expected: false },
		{ input: "simple", expected: false },
		{ input: "", expected: false },
		{ input: "mailto:user@example.com", expected: false },
		{ input: "ftp://example.com", expected: false },
	])("isUrl('$input') == $expected", ({ input, expected }) =>
		expect(binotype.Site.Page.Path.isUrl(input)).toBe(expected)
	)
	it("append append appendFragment", () => {
		const path = binotype.Site.Page.Path.parse("/home/user#section")
			.append("documents")
			.append("Important File")
			.appendFragment("conclusion")
		expect(path.toString()).toBe("/home/user/documents/important-file#conclusion")
		expect(path.empty).toBe(false)
		expect(path.leaf).toBe(false)
		expect(path.head).toBe("home")
		expect(path.fragment).toBe("conclusion")
	})
	it("immutability", () => {
		const original = binotype.Site.Page.Path.parse("/home/user")
		expect(original.toString()).toBe("/home/user")
		expect(original.append("documents").toString()).toBe("/home/user/documents")
		expect(original.appendFragment("section").toString()).toBe("/home/user#section")
	})
})
