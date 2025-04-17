module.exports = {
	extends: 'stylelint-config-standard-scss',
	ignoreFiles: [
		'node_modules/',
		'dist/',
		'.storybook',
	],
	rules: {
		'at-rule-no-unknown': null,
		'scss/at-rule-no-unknown': true,
		indentation: 'tab',
		// eslint-disable-next-line prefer-regex-literals
		'selector-class-pattern': new RegExp(
			'^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)*(--([a-z0-9]+-?)+){0,2}$', // see https://gist.github.com/Potherca/f2a65491e63338659c3a0d2b07eee382
		),
		'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
	},
};
