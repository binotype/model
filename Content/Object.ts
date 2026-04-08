import { Node } from "./Node"

export interface Object {
	tag: string | number | Function
	key?: string | number
	text?: string
	children?: Object[]
	attributes?: any
	name?: string
}
export namespace Object {
	export function from(node: Node): Object {
		return globalThis.Object.fromEntries(globalThis.Object.entries({
			tag: node.$tag$,
			key: node.$key$,
			text: node.$text$,
			children: node.$children$ && node.$children$.map(from),
			attributes: node.$attrs$ && globalThis.Object.fromEntries(globalThis.Object.entries(node.$attrs$).filter(([key, value]) => !key.startsWith("__") && value !== undefined && value !== null)),
			name: node.$name$,
		}).filter(([_, value]) => value !== undefined && value !== null)) as Object
	}
}
