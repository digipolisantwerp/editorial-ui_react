module.exports = {
	setupFilesAfterEnv: ['<rootDir>/scripts/jest-setup.js'],

	// Module file extensions for importing
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

	// ignore scss files
	moduleNameMapper: {
		'^.+\\.(css|less|scss)$': 'identity-obj-proxy',
	},

	transformIgnorePatterns: [
		'node_modules/(?!react-dnd)/'
	],

	// https://jestjs.io/docs/configuration#testenvironment-string
	testEnvironment: 'jest-environment-jsdom',
};
