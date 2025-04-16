export const CASCADER_MOCK_CITY_OPTIONS = [{
	value: 'belgium',
	label: 'Belgium',
	children: [{
		value: 'antwerp',
		label: 'Antwerp',
		children: [{
			value: 'lier',
			label: 'Lier',
		}, {
			value: 'kontich',
			label: 'Kontich',
		},
		{
			value: 'lint',
			label: 'Lint',
		}],
	}],
}, {
	value: 'netherland',
	label: 'Netherland',
	children: [{
		value: 'sealand',
		label: 'Sealand',
		children: [{
			value: 'cadzand',
			label: 'Cadzand',
		}, {
			value: 'breskens',
			label: 'Breskens',
			disabled: true,
		}],
	}],
}];

export const CASCADER_MOCK_LAZY_LOADED_CITY_OPTIONS = [
	{
		value: 'netherland',
		label: 'Netherland',
		children: [{
			value: 'sealand',
			label: 'Sealand',
			isLeaf: false,
		}],
	},
];

export const CASCADER_MOCK_CITY_OPTIONS_STYLING_TEST = [{
	value: 'belgium',
	label: 'Belgium',
	children: [{
		value: 'antwerp',
		label: 'Antwerp',
		className: 'top-dashed-border',
		children: [{
			value: 'lier',
			label: 'Lier',
		}, {
			value: 'kontich',
			label: 'Kontich',
		},
		{
			value: 'lint',
			label: 'Lint',
			className: 'top-dashed-border',
		}],
	}],
}, {
	value: 'netherland',
	label: 'Netherland',
	className: 'top-dashed-border',
	children: [{
		value: 'sealand',
		label: 'Sealand',
		className: 'top-dashed-border',
		children: [{
			value: 'cadzand',
			label: 'Cadzand',
		}, {
			value: 'breskens',
			label: 'Breskens',
			disabled: true,
		}],
	}],
}];
