---
title: "Coding Guidelines Index"
description: "Quick reference for finding the right coding guidelines"
---

# Coding Guidelines

This directory contains domain-specific coding guidelines for AI agents and developers working on this TypeScript project.

## Quick Navigation

### 🔧 By File Type

| Working on...                      | Use this guideline                     |
| ---------------------------------- | -------------------------------------- |
| `*.ts` files (classes, interfaces) | [typescript.md](typescript.md)         |
| `*.spec.ts` test files             | [testing.md](testing.md)               |
| `index.ts` export files            | [module-exports.md](module-exports.md) |

### 🎯 By Task

| Task                       | Guideline      | Key Patterns                         |
| -------------------------- | -------------- | ------------------------------------ |
| Creating domain objects    | TypeScript     | Interface + Namespace pattern        |
| Writing factory functions  | TypeScript     | `load()` functions in namespaces     |
| Implementing value objects | TypeScript     | Private constructor + static methods |
| Writing tests              | Testing        | Snapshot + parameterized testing     |
| Organizing module exports  | Module Exports | Alias imports + namespace re-exports |
| Setting up test data       | Testing        | `it.each()` with data arrays         |

### 📋 Quick Reference

#### TypeScript Core Patterns

- **Primary**: Interface + Namespace (data + behavior)
- **Value Objects**: Private constructor + static factories
- **Type Validation**: Use `isly` library
- **Factories**: Always name them `load()`

#### Testing Essentials

- **File naming**: `*.spec.ts`
- **Import pattern**: `import { binotype } from "../index"`
- **Primary approach**: Snapshot testing
- **Edge cases**: Test empty, root, malformed inputs

#### Module Organization

- **Import alias**: `import { X as _X } from "./X"`
- **Re-export**: `export import X = _X`
- **Hierarchy**: Root → Feature → SubFeature → Domain
- **Factory placement**: In namespace alongside interface

## Agent Integration

Each guideline file includes YAML frontmatter for automatic agent targeting:

```yaml
applyTo: ["**/*.ts"] # File pattern matching
triggerWords: ["interface"] # Context activation keywords
contextSize: medium # Context loading strategy
priority: high # Loading precedence
```

## Getting Started

1. **New TypeScript file**: Start with [typescript.md](typescript.md)
2. **Adding tests**: Follow [testing.md](testing.md)
3. **Creating exports**: Use [module-exports.md](module-exports.md)

These guidelines reflect the actual patterns used in this codebase and are designed to maintain consistency across the project.
