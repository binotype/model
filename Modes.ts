import { isly } from "isly"
import { Mode } from "./Mode"

export interface Modes {
	mode?: Mode
	list?: Mode
}
export namespace Modes {
	export const {
		is,
		flawed,
		type
	}: isly.BindResult<Modes, isly.Object<Modes>> = isly
		.object<Modes>({ mode: Mode.type.optional(), list: Mode.type.optional() }, "binotype.Modes")
		.bind()
}
