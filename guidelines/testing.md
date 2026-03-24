---
title: "Testing Guidelines"
applyTo:
  - "**/*.spec.ts"
  - "**/*.test.ts"
triggerWords: ["test", "spec", "describe", "it", "expect", "snapshot"]
priority: high
contextSize: medium
---

# Testing Guidelines

## File Organization

### Naming Convention

- Test files: `*.spec.ts` (not `*.test.ts`)
- Place alongside source files: `Component/index.ts` → `Component/index.spec.ts`
- Import from root: `import { binotype } from "../index"`

### Test Structure

```typescript
import { binotype } from "../index"

describe("binotype.Context.Article", () => {
	describe("Article.load", () => {
		it("should create article from valid source", () => {
			// Test implementation
		})
	})
})
```

## Core Testing Patterns

### 1. Snapshot Testing (Primary)

**Use for complex object structures and regression protection.**

```typescript
describe("Article rendering", () => {
	it("should match snapshot", () => {
		const article = binotype.Context.Article.load(testData)
		expect(article).toMatchSnapshot()
	})
})
```

### 2. Parameterized Testing

**Use `it.each()` for testing multiple scenarios.**

```typescript
const testCases = [
	["empty path", "", true],
	["root path", "/", false],
	["nested path", "/home/user", false],
] as const

describe("Path.empty", () => {
	it.each(testCases)("should handle %s", (_desc, input, expected) => {
		const path = Path.parse(input)
		expect(path.empty).toBe(expected)
	})
})
```

### 3. Data-Driven Testing

**Define comprehensive test datasets in test files.**

```typescript
const pathTestData = [
	{ input: "/home/user#section", head: "home", tail: "/user#section" },
	{ input: "simple", head: "simple", tail: "" },
	{ input: "", head: "", tail: "" },
] as const

describe("Path operations", () => {
	it.each(pathTestData)("should parse $input correctly", ({ input, head, tail }) => {
		const path = Path.parse(input)
		expect(path.head).toBe(head)
		expect(path.tail).toBe(tail)
	})
})
```

## Test Coverage Areas

### Required Test Categories

1. **Parser Edge Cases**
   - Empty strings: `""`
   - Root paths: `"/"`
   - Malformed input: `"//"`, `"///"`
   - Fragment handling: `"/path#fragment"`

2. **Computed Properties**
   - Getters that derive values
   - Boolean flags (`empty`, `leaf`, `valid`)
   - Transformations (`head`, `tail`)

3. **String Transformations**
   - Case conversions (camelCase ↔ snake_case)
   - Accent normalization
   - URL encoding/decoding

4. **Factory Functions**
   - Valid input scenarios
   - Invalid input handling
   - Composition from source data

## Testing Conventions

### Describe Block Naming

Use fully qualified names for clarity:

```typescript
describe("binotype.Site.Page.Path", () => {
	describe("Path.parse", () => {
		// Specific method tests
	})

	describe("Path.head", () => {
		// Property tests
	})
})
```

### Test Data Organization

```typescript
// Define test data as const assertions
const validArticles = [
	{ title: "Test", path: "/test", content: "..." },
	{ title: "Another", path: "/another", content: "..." },
] as const

// Use descriptive names for edge cases
const edgeCases = {
	emptyPath: "",
	rootPath: "/",
	fragmentOnly: "#section",
	doubleSlash: "//path",
} as const
```

### Assertion Patterns

#### Snapshots for Complex Objects

```typescript
it("should create valid article", () => {
	const result = Article.load(sourceData)
	expect(result).toMatchSnapshot()
})
```

#### Specific Assertions for Primitives

```typescript
it("should extract title correctly", () => {
	const article = Article.load(sourceData)
	expect(article.title).toBe("Expected Title")
	expect(article.path).toMatch(/^\/[a-z-]+$/)
})
```

#### Type Guards

```typescript
it("should validate article type", () => {
	const result = Article.load(sourceData)
	expect(Article.is(result)).toBe(true)
})
```

## Test Organization Best Practices

### Group Related Tests

- Group by functionality, not by method
- Use nested `describe` blocks for hierarchy
- Keep related test data together

### Test Independence

- Each test should be self-contained
- Avoid shared mutable state
- Create fresh objects for each test

### Performance Testing

- Test lazy initialization behavior
- Verify caching works correctly
- Test memory usage for large datasets

### Error Scenarios

```typescript
describe("error handling", () => {
	it("should handle invalid input gracefully", () => {
		expect(() => Path.parse(null as any)).toThrow()
	})

	it("should return validation errors", () => {
		const result = Article.flawed(invalidData)
		expect(result).toHaveProperty("error")
	})
})
```

## Coverage Goals

- **Statements**: 100%
- **Branches**: 90%+ (allow for defensive programming)
- **Functions**: 100%
- **Lines**: 90%+

Focus on testing public APIs and critical business logic paths.
