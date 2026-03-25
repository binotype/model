---
title: "Module Export Guidelines (index.ts)"
applyTo:
  - "**/index.ts"
triggerWords: ["index", "export", "namespace", "module", "import"]
priority: high
contextSize: small
---

# Module Export Guidelines (index.ts)

## Core Export Pattern

### Standard Structure

Every `index.ts` file follows this pattern:

```typescript
// 1. Import implementation with alias
import { ComponentName as _ComponentName } from "./ComponentName"
import { SubModule as _SubModule } from "./SubModule"

// 2. Main export (class or interface)
export interface/class ComponentName {
  // Implementation
}

// 3. Namespace with re-exports and utilities
export namespace ComponentName {
  // Re-export sub-modules
  export import SubModule = _SubModule

  // Factory functions
  export function load(source: SourceType): ComponentName {
    // Factory implementation
  }

  // Static utilities
  export function isValid(value: unknown): value is ComponentName {
    // Type guard implementation
  }
}
```

## Hierarchy Patterns

### Root Level ([index.ts](index.ts))

**Single root namespace containing top-level modules.**

```typescript
import { Context as _Context } from "./Context"
import { Site as _Site } from "./Site"

export namespace binotype {
	export import Context = _Context
	export import Site = _Site
}
```

### Feature Level ([Context/index.ts](Context/index.ts))

**Class + namespace with sub-modules.**

```typescript
import { Article as _Article } from "./Article"
import { Header as _Header } from "./Header"
import { Menu as _Menu } from "./Menu"

export class Context {
	// Main implementation
}

export namespace Context {
	export import Article = _Article
	export import Header = _Header
	export import Menu = _Menu
}
```

### Leaf Level ([Context/Article/Mode.ts](Context/Article/Mode.ts))

**Pure types with empty namespace for extensibility.**

```typescript
export type Mode = "body" | "full" | "header" | "list" | "summary"
export namespace Mode {} // Reserved for future extensions
```

## Import Conventions

### Alias Strategy

Always use aliases to prevent naming conflicts:

```typescript
// DO: Use alias imports
import { Header as _Header } from "./Header"
import { Section as _Section } from "./Section"

// DON'T: Direct imports can cause conflicts
import { Header } from "./Header" // Conflicts with export
```

### Re-export Through Namespace

Provide structured access via namespace imports:

```typescript
export namespace Article {
	export import Header = _Header // Clean API
	export import Section = _Section
	export import Mode = _Mode
}

// Usage: Article.Header.load(), Article.Mode, etc.
```

## Factory Function Placement

### Standard Location

Always place factory functions in the namespace:

```typescript
export namespace ComponentName {
	// Factory function - always named 'load'
	export function load(source: SourceType): ComponentName {
		return {
			// Compose from source data
		}
	}
}
```

### Load Function Signature

```typescript
// Standard signature pattern
export function load(source: SourceData): DomainObject
export function load(page: Page, design: Design): Article // Multiple params OK
```

## Directory Structure Mapping

### Folder → Namespace Hierarchy

```
Context/
├── index.ts              → Context class + Context namespace
├── Article/
│   ├── index.ts          → Article interface + Article namespace
│   ├── Mode.ts           → Article.Mode type
│   ├── Header/
│   │   └── index.ts      → Article.Header interface
│   └── Section/
│       └── index.ts      → Article.Section interface
├── Header/
│   └── index.ts          → Context.Header interface
└── Menu/
    └── index.ts          → Context.Menu interface + Menu.Item
```

### Access Patterns

```typescript
// From root
binotype.Context.Article.load()
binotype.Context.Article.Header.load()
binotype.Context.Article.Mode
binotype.Context.Header.load()
binotype.Site.Page.load()
```

## Common Patterns

### Lazy Module Loading

For expensive sub-modules, use lazy initialization:

```typescript
export namespace Context {
  let _article: typeof import("./Article")

  export function get Article() {
    return (_article ??= require("./Article"))
  }
}
```

### Type-Only Exports

When re-exporting only types:

```typescript
export namespace Article {
	export import Mode = _Mode // Type export
	export import Header = _Header // Module export
}
```

### Extension Points

Reserve empty namespaces for future extensions:

```typescript
export type Status = "draft" | "published"
export namespace Status {
	// Reserved for future Status.parse(), Status.validate(), etc.
}
```

## Anti-Patterns

### ❌ Avoid These Patterns

```typescript
export * from "./SubModule" // Loses type safety
export default class Context {} // Breaks namespace pattern
export function loadContext() {} // Should be Context.load()
```

### ✅ Use Instead

```typescript
import { Header as _Header } from "./Header"
export namespace Context {
	export import Header = _Header
	export function load(): Context {}
}
```

````

## Testing Considerations

### Test Import Pattern

Always import from root for tests:

```typescript
// In any .spec.ts file
import { binotype } from "../index" // Always root import

// Use fully qualified names
const article = binotype.Context.Article.load(testData)
````

This ensures tests validate the complete export hierarchy and catch breaking changes in the module structure.
