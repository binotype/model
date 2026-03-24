import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
	{
		ignores: ["dist/**", "node_modules/**", "coverage/**"]
	},
	{
		files: ["**/*.{ts,tsx}"],
		plugins: {
			"@typescript-eslint": typescriptEslint
		},
		languageOptions: {
			parser: tsParser
		},
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-namespace": "off"
		}
	}
];