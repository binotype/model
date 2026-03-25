---
title: "TypeScript Coding Guidelines"
applyTo:
  - "**/*.ts"
  - "!**/*.spec.ts"
triggerWords: ["typescript", "interface", "namespace", "class", "factory"]
priority: high
contextSize: medium
---

# TypeScript Coding Guidelines

## Core Patterns

### 1. Interface + Namespace Pattern (Primary)

**Use this pattern for domain objects with both data and behavior.**

```typescript
// Define the interface for the data shape
export interface Article {
	readonly title: string
	readonly path: string
	readonly content: string
}

// Extend with static utilities and sub-modules in namespace
export namespace Article {
	export import Header = _Header // Re-export sub-modules
	export import Section = _Section

	// Factory function - always named 'load'
	export function load(source: SourceType): Article {
		return {
			/* compose from source */
		}
	}

	// Static utilities
	export function isValid(article: unknown): article is Article {
		return /* validation logic */
	}
}
```

### 2. Value Objects with Private Constructor

**For immutable value types with rich behavior.**

```typescript
export class Path {
	private constructor(private readonly segments: string[]) {}

	static parse(path: string): Path {
		return new Path(/* parsing logic */)
	}

	get empty(): boolean {
		return this.segments.length === 0
	}
	get leaf(): string {
		return this.segments[this.segments.length - 1]
	}

	append(segment: string): Path {
		return new Path([...this.segments, segment]) // Return new instance
	}
}
```

### 3. Type Unions for Enums

**For closed set of string literals.**

```typescript
export type Mode = "body" | "full" | "header" | "list" | "summary"
export namespace Mode {} // Empty namespace for future extensibility
```

## Class Design Principles

### Immutability

- Use `readonly` fields where possible
- Private constructors for value objects
- Static factory methods for object creation
- Return new instances instead of mutating

### Computed Properties

- Use getters for derived values
- Lazy initialization with null coalescing:

```typescript
private _menu?: Context.Menu

get menu(): Context.Menu {
  return (this._menu ??= Context.Menu.load(this.source))
}
```

### Factory Functions

- Always name factory functions `load()`
- Place in namespace alongside interface
- Accept source data, return domain object
- Handle composition and validation

## Type Validation

### Runtime Type Checking with isly

**For objects requiring runtime validation.**

```typescript
import { isly } from "isly"

export interface Design {
	readonly theme: string
	readonly layout: string
}

export const { is, flawed, type } = isly
	.object<Design>({
		theme: isly.string(),
		layout: isly.string(),
	})
	.bind()
```

## Import/Export Conventions

### Internal Imports

- Use alias imports to avoid naming conflicts:

```typescript
import { Header as _Header } from "./Header"
import { Section as _Section } from "./Section"
```

### Namespace Re-exports

- Re-export through namespace for structured API:

```typescript
export namespace Article {
	export import Header = _Header
	export import Section = _Section
}
```

## Error Handling

### Validation Errors

- Use type guards for runtime checks
- Provide meaningful error messages
- Validate at boundaries (load functions)

### Optional Chaining

- Use `?.` for optional properties
- Use `??` for null coalescing
- Prefer type safety over runtime checks

## Code Style

### Control Flow Statements

**Prefer braceless single statements for brevity, but use braces for clarity when needed.**

```typescript
// ✅ Preferred - clean single statements
if (condition) return early
while (items.length > 0) processItem(items.shift())

// ✅ Acceptable - braces for clarity or team standards
if (condition) {
	return early
}

// ✅ Required - braces for multiple statements
if (condition) {
	const result = process()
	return result
}
```

### Return Statements

**Prefer single return statements when practical, but allow early returns for guard clauses.**

**Use the variable name `result` for computed return values.**

```typescript
// ✅ Preferred - single return for computed values
function processItem(item: Item): ProcessResult {
	const result = item.isValid()
		? { status: "success", data: item.process() }
		: { status: "error", message: "Invalid item" }
	return result
}

// ✅ Acceptable - early return for guard clauses
function processItem(item: Item): ProcessResult {
	if (!item.isValid())
		return { status: "error", message: "Invalid item" }
	return { status: "success", data: item.process() }
}

// ✅ Direct return for simple cases
function getUserName(user: User): string {
	return user.profile?.name ?? "Anonymous"
}
```

## Performance Considerations

### Lazy Loading

- Initialize expensive computations on demand
- Cache results using null coalescing assignment
- Use getters for computed values

### Memory Efficiency

- Prefer readonly interfaces over classes when no behavior needed
- Use string literals and unions over objects for constants
- Minimize object creation in hot paths
