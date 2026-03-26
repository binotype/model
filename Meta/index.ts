import { isly } from "isly"

export interface Meta { [key: string]: Meta.Value | undefined }

export namespace Meta {
	export type Value =  string | number | boolean | Value[] | Meta
	export namespace Value {
		export const { is, flawed, type } = isly.union<Value>(
			isly.string(),
			isly.number(),
			isly.boolean(),
			isly.array<Value>(isly.lazy<Value>((): any => Value.type, "binotype.Meta.Value")),
			isly.lazy<Meta>((): any => Meta.type, "binotype.Meta")
		).rename("binotype.Meta.Value").bind()
	}
	export const { is, flawed, type } = isly.record<Meta>(isly.string(), Value.type).bind()
}
