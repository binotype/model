export type Clean<T> = T extends null | undefined | [] | Record<string, never>
	? never
	: T extends Array<infer U>
		? Clean.Array<U>
		: T extends object
			? Clean.Object<T>
			: T
export namespace Clean {
	export type Array<T> = Clean<T> extends never ? never : Clean<T>[]
	export type Object<T extends object> = {
		[K in keyof T as Clean<T[K]> extends never | Record<string, never> ? never : K]: Clean<T[K]>
	}
	export type Result<T> = T extends null | undefined | [] | Record<string, never> ? undefined : Clean<T>
	export function clean<T extends object>(dirty: T | undefined | null): Object<T> | undefined
	export function clean<T>(dirty: T | undefined | null): Clean.Result<T>
	export function clean(dirty: unknown): unknown
	export function clean(dirty: unknown): unknown {
		return dirty == null
			? undefined
			: Array.isArray(dirty)
				? (cleaned => (cleaned.length > 0 ? cleaned : undefined))(dirty.map(clean).filter(v => v !== undefined))
				: typeof dirty == "object"
					? ((cleaned: Record<string, unknown>) => (Object.keys(cleaned).length > 0 ? cleaned : undefined))(
							Object.fromEntries(
								Object.entries(dirty)
									.map(([key, value]) => [key, clean(value)] as const)
									.filter(([, value]) => value !== undefined)
							)
						)
					: dirty
	}
}
