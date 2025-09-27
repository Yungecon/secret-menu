/* eslint-env node */
module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
		jest: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: false,
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'prefer-const': 'off',
		'no-console': 'off',
	},
	overrides: [
		{
			files: ['**/*.test.ts', '**/*.test.tsx', 'src/test/**'],
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
			},
		},
	],
	ignorePatterns: ['dist/', 'dev-dist/', 'node_modules/', 'coverage/', 'test-results/'],
};

