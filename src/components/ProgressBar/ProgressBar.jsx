/* eslint-disable jsx-a11y/control-has-associated-label */
import PropTypes from 'prop-types';
import React from 'react';

const ProgressBar = ({
	value = 0,
	max = 0,
}) => {
	const progressStyle = () => {
		if (max > 0 && value > 0) {
			const res = (value / max);
			return {
				width: `${Math.floor(res * 100)}%`,
			};
		}

		return {
			width: 0,
		};
	};

	return (
		<div className="aui-progress-bar m-progress">
			<div className="m-progress__inner">
				<div
					aria-valuemax={max}
					aria-valuenow={value}
					style={progressStyle()}
					aria-valuemin="0"
					className="m-progress__bar"
					role="progressbar"
				/>
			</div>
		</div>
	);
};

ProgressBar.propTypes = {
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	max: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};

export default ProgressBar;
