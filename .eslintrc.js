/**
 * https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
 */
module.exports = {
	env: {
		browser: true,
		node: true
	},
	overrides: [
		{
			files: ['**/*.ts', '**/*.tsx'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				project: 'tsconfig.json',
				sourceType: 'module'
			},
			plugins: [
				'@typescript-eslint',
				'import',
				'prefer-arrow',
				'@angular-eslint',
				'deprecation',
				'import',
				'sonarjs'
			],
			extends: [
				//Prettier documentation says to keep this at the end of 'extends' so it overrides other configs (but 'rules' has priority regardless)
				'prettier'
			],
			rules: {
				'@typescript-eslint/adjacent-overload-signatures': 'error',
				'@typescript-eslint/array-type': 'error',
				'@typescript-eslint/class-name-casing': 0,
				'@typescript-eslint/consistent-type-assertions': 'error',
				'@typescript-eslint/consistent-type-definitions': 'error',
				'@typescript-eslint/explicit-member-accessibility': [
					'error',
					{
						accessibility: 'explicit',
						overrides: { constructors: 'no-public' }
					}
				],
				'@typescript-eslint/indent': ['off', 'tabs'],
				'@typescript-eslint/naming-convention': [
					'error',
					{
						'selector': 'interface',
						'format': ['PascalCase'],
						'custom': {
							'regex': '^I[A-Z]',
							'match': true,
						}
					}
				],
				'@typescript-eslint/member-ordering': [
					'error',
					{
						default: [
							'public-static-field',
							'protected-static-field',
							'private-static-field',

							'public-abstract-field',
							'protected-abstract-field',

							'field',

							'constructor',

							'public-static-method',
							'protected-static-method',
							'private-static-method',

							'public-abstract-method',
							'protected-abstract-method',

							'public-method',
							'protected-method',
							'private-method',

							'method'
						]
					}
				],
				'@typescript-eslint/no-empty-function': 'error',
				'@typescript-eslint/no-empty-interface': 'error',
				'@typescript-eslint/no-explicit-any': 'error',
				'@typescript-eslint/no-floating-promises': 'off',
				'@typescript-eslint/no-for-in-array': 'error',
				'@typescript-eslint/typedef': [
					'error',
					{
						arrayDestructuring: false,
						arrowParameter: false,
						memberVariableDeclaration: false,
						objectDestructuring: false,
						parameter: true,
						propertyDeclaration: true,
						variableDeclaration: false
					}
				],
				'@typescript-eslint/prefer-readonly': 'error',
				'@typescript-eslint/no-misused-new': 'error',
				'@typescript-eslint/no-namespace': 'error',
				'@typescript-eslint/no-non-null-assertion': 'error',
				'@typescript-eslint/no-parameter-properties': 'off',
				'@typescript-eslint/no-var-requires': 'error',
				'@typescript-eslint/prefer-for-of': 'warn',
				'@typescript-eslint/prefer-function-type': 'error',
				'@typescript-eslint/prefer-namespace-keyword': 'error',
				'@typescript-eslint/promise-function-async': 'off',
				'@typescript-eslint/triple-slash-reference': 'error',
				'@typescript-eslint/unified-signatures': 'error',
				'arrow-body-style': ['error', 'as-needed', {requireReturnForObjectLiteral: true}],
				camelcase: 'off',
				'comma-dangle': 'off',
				complexity: 'off',
				'constructor-super': 'error',
				curly: 'error',
				'dot-notation': 'error',
				eqeqeq: ['error', 'smart'],
				'guard-for-in': 'error',
				'id-blacklist': 'off',
				'id-match': 'off',
				'import/no-deprecated': 'warn',
				'import/order': 'off',
				'max-classes-per-file': ['error', 1],
				'max-len': [
					'error',
					{
						code: 120,
						ignoreUrls: true,
						ignoreRegExpLiterals: true,
						ignorePattern: '\\s+from\\s.+;$|^export.+class.+|.*extends.+|.*implements.+'
					}
				],
				'no-bitwise': 'error',
				'no-caller': 'error',
				'no-cond-assign': 'error',
				'no-console': [
					'error',
					{
						allow: [
							'log',
							'warn',
							'dir',
							'timeLog',
							'assert',
							'clear',
							'count',
							'countReset',
							'group',
							'groupEnd',
							'table',
							'dirxml',
							'error',
							'groupCollapsed',
							'Console',
							'profile',
							'profileEnd',
							'timeStamp',
							'context'
						]
					}
				],
				'no-debugger': 'error',
				'no-duplicate-case': 'error',
				'no-duplicate-imports': 'error',
				'no-empty': 'error',
				'no-eval': 'error',
				'no-fallthrough': 'off',
				'no-invalid-this': 'off',
				'no-magic-numbers': 'off',
				'no-new-wrappers': 'error',
				'no-redeclare': 'error',
				'no-restricted-imports': [
					'error',
					{
						patterns: ['@libusoftcicom/lc-datepicker/*']
					}
				],
				// namjerno no-shadow ugasen i koristimo noviji rule za ts @typescript-eslint/no-shadow, vise na linku ispod:
				// https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
				'no-shadow': 'off',
				'@typescript-eslint/no-shadow': 'error',
				'no-template-curly-in-string': 'error',
				'no-undef-init': 'error',
				'no-underscore-dangle': 'off',
				'no-unsafe-finally': 'error',
				'no-unused-expressions': 'error',
				'no-unused-labels': 'error',
				'no-var': 'error',
				'object-shorthand': 'error',
				'one-var': ['error', 'never'],
				'padding-line-between-statements': [
					'off',
					'error',
					{
						blankLine: 'always',
						prev: '*',
						next: 'return'
					}
				],
				'prefer-arrow/prefer-arrow-functions': 'error',
				'prefer-const': 'error',
				radix: 'off',
				'spaced-comment': 'error',
				'use-isnan': 'error',
				'valid-typeof': 'off',
				// ban types info: https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-types.md
				// trenutno ignoriramo ovaj rule zbog legacia gdje smo s razlogom stavljali {} objekte.
				'@typescript-eslint/ban-types': [
					'error',
					{
						'extendDefaults': false
					},
				],
				'@typescript-eslint/no-dynamic-delete': 'error',

				// Note: you must disable the base rule as it can report incorrect errors
				'no-unused-vars': 'off',
				'@typescript-eslint/no-unused-vars': 'error',

				'@typescript-eslint/no-inferrable-types': ['error', {ignoreParameters: true, ignoreProperties: true}],

				// Note: you must disable the base rule as it can report incorrect errors
				'no-throw-literal': 'off',
				'@typescript-eslint/no-throw-literal': 'error',

				// Note: you must disable the base rule as it can report incorrect errors
				'no-use-before-define': 'off',
				'@typescript-eslint/no-use-before-define': 'error',

				// Sonar rules
				'sonarjs/cognitive-complexity': 'error',

				//Angular ESLint rules
				'@angular-eslint/no-output-on-prefix': 'error',
				'@angular-eslint/no-inputs-metadata-property': 'error',
				'@angular-eslint/no-outputs-metadata-property': 'error',
				'@angular-eslint/no-host-metadata-property': 'error',
				'@angular-eslint/no-input-rename': 'off',
				'@angular-eslint/no-output-rename': 'error',
				'@angular-eslint/use-lifecycle-interface': 'error',
				'@angular-eslint/use-pipe-transform-interface': 'error',
				'@angular-eslint/component-class-suffix': 'error',
				'@angular-eslint/directive-class-suffix': 'error',
				'deprecation/deprecation': 'warn',
				'import/no-duplicates': 'error',
			}
		}
	],


};
