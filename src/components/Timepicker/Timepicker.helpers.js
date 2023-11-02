import { isNil } from '../../helpers';

export const setInitialValues = (index) => {
	const initialValues = [];

	for (let i = 1; i < index; i += 1) {
		initialValues.push('');
	}

	return initialValues;
};

const isPowerOfTen = (value) => Math.log10(value) % 1 === 0;
const getTimeOption = (value, amount) => {
	if (isNil(value)) {
		return;
	}

	const valueString = value.toString();
	const amountLength = amount.toString().length;
	const targetLength = isPowerOfTen(amount) ? amountLength - 1 : amountLength;
	const label = valueString.length <= targetLength
		? valueString.padStart(targetLength, '0')
		: valueString;

	return { label, value: label };
};

export const generateTimeSelectOptions = (amount, step, disabled = false) => {
	const a = [];
	let b = 0;

	while (b < amount) {
		a.push({
			key: b,
			disabled,
			...getTimeOption(b, amount),
		});
		b += step;
	}
	return a;
};

export const getTimeArray = (timeString, timeUnitAmounts) => {
	if (!timeString || timeString === '') {
		return [];
	}

	const timeArray = timeString.split(':');
	const slicedArray = timeArray.slice(0, 2);

	return slicedArray.map((time, index) => getTimeOption(time, timeUnitAmounts[index])?.value ?? '');
};

export const getTimeString = (timeArray) => timeArray.join(':');
