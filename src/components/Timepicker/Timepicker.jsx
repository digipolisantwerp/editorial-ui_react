import { Select } from '@acpaas-ui/react-components';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { isUndefined } from '../../helpers';

import { TIME_UNIT_AMOUNTS } from './Timepicker.const';
import {
	generateTimeSelectOptions, getTimeArray, getTimeString, setInitialValues,
} from './Timepicker.helpers';
import './Timepicker.scss';

/**
 * @typedef TimePickerProps
 * @prop {string} id
 * @prop {string} [className]
 * @prop {boolean} [required]
 * @prop {boolean} [disabled]
 * @prop {number | string} [value]
 * @prop {string} [hourLabel]
 * @prop {string} [minuteLabel]
 * @prop {string} [secondLabel]
 * @prop {string} [millisecondLabel]
 * @prop {string} [hourPlaceholder]
 * @prop {string} [minutePlaceholder]
 * @prop {string} [secondPlaceholder]
 * @prop {string} [millisecondPlaceholder]
 * @prop {number} [hourStep]
 * @prop {number} [minuteStep]
 * @prop {number} [secondStep]
 * @prop {number} [millisecondStep]
 * @prop {Function} [onChange]
 */

/** @param {TimePickerProps} props */
const Timepicker = ({
	id,
	className,
	required,
	disabled = false,
	value,
	hourLabel = 'Uren',
	minuteLabel = 'Minuten',
	secondLabel = 'Seconden',
	millisecondLabel = 'Milliseconden',
	hourPlaceholder = 'hh',
	minutePlaceholder = 'mm',
	secondPlaceholder = 'ss',
	millisecondPlaceholder = 'ms',
	hourStep = 1,
	minuteStep = 5,
	secondStep,
	millisecondStep,
	onChange,
}) => {
	const roundedSecondStep = !isUndefined(secondStep) ? Math.round(secondStep) : null;
	const roundedMillisecondSecondStep = !isUndefined(millisecondStep)
		? Math.round(millisecondStep)
		: null;
	const [hours, minutes, seconds, milliseconds] = TIME_UNIT_AMOUNTS;
	const timeArray = getTimeArray(value, TIME_UNIT_AMOUNTS) || [];

	/**
	* Methods
	*/
	const handleChange = (indexValue, index) => {
		let prevValue = getTimeArray(value, TIME_UNIT_AMOUNTS);

		if (timeArray.length < index - 1) {
			prevValue = setInitialValues(index);
		}

		prevValue[index] = indexValue;

		onChange(getTimeString(prevValue));
	};

	/**
	* Render
	*/
	return (
		<div className={classnames('a-timepicker', className)}>
			<Select
				id={`${id}-hours`}
				required={required}
				label={hourLabel}
				disabled={disabled}
				options={generateTimeSelectOptions(hours, hourStep, disabled)}
				placeholder={hourPlaceholder}
				value={timeArray[0]}
				onChange={(event) => handleChange(event.target.value, 0)}
			/>
			<span className="a-timepicker__separator">:</span>
			<Select
				id={`${id}-minutes`}
				required={required}
				disabled={disabled}
				label={minuteLabel}
				options={generateTimeSelectOptions(minutes, minuteStep, disabled)}
				placeholder={minutePlaceholder}
				value={timeArray[1]}
				onChange={(event) => handleChange(event.target.value, 1)}
			/>
			{roundedSecondStep && roundedSecondStep > 0 ? (
				<>
					<span className="a-timepicker__separator">:</span>
					<Select
						id={`${id}-seconds`}
						required={required}
						disabled={disabled}
						label={secondLabel}
						options={generateTimeSelectOptions(seconds, roundedSecondStep, disabled)}
						placeholder={secondPlaceholder}
						value={timeArray[2]}
						onChange={(event) => handleChange(event.target.value, 2)}
					/>
				</>
			) : null}
			{roundedMillisecondSecondStep && roundedMillisecondSecondStep > 0 ? (
				<>
					<span className="a-timepicker__separator">:</span>
					<Select
						id={`${id}-milliseconds`}
						required={required}
						disabled={disabled}
						label={millisecondLabel}
						options={generateTimeSelectOptions(
							milliseconds,
							roundedMillisecondSecondStep,
							disabled,
						)}
						placeholder={millisecondPlaceholder}
						value={timeArray[3]}
						onChange={(event) => handleChange(event.target.value, 3)}
					/>
				</>
			) : null}
		</div>
	);
};

Timepicker.propTypes = {
	id: PropTypes.string.isRequired,
	className: PropTypes.string,
	required: PropTypes.bool,
	disabled: PropTypes.bool,
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	hourLabel: PropTypes.string,
	minuteLabel: PropTypes.string,
	secondLabel: PropTypes.string,
	millisecondLabel: PropTypes.string,
	hourPlaceholder: PropTypes.string,
	minutePlaceholder: PropTypes.string,
	secondPlaceholder: PropTypes.string,
	millisecondPlaceholder: PropTypes.string,
	hourStep: PropTypes.number,
	minuteStep: PropTypes.number,
	secondStep: PropTypes.number,
	millisecondStep: PropTypes.number,
	onChange: PropTypes.func,
};

export default Timepicker;
