import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';

import pkg from './package.json';

export default {
	input: 'src/index.js',
	output: [
		{ file: pkg.main, format: 'cjs' },
		{ file: pkg.module, format: 'es' },
	],
	plugins: [
		resolve({
			extensions: ['.js', '.jsx', '.scss'],
		}),
		postcss({
			extensions: ['.css', '.scss'],
			plugins: [
				autoprefixer(),
			],
		}),
		babel({
			exclude: ['node_modules/**'],
			babelHelpers: 'external',
		}),
		terser(),
	],
	external: [
		'@acpaas-ui/react-components',
		'@redactie/react-components',
		'@popperjs/core',
		'array-tree-filter',
		'classnames',
		'classnames/bind',
		'formik',
		'lodash.debounce',
		'prop-types',
		'ramda',
		'rc-trigger',
		'react',
		'react-dom',
		'react-dnd',
		'react-dnd-html5-backend',
		'react-popper',
		'sanitize-html',
	],
};
