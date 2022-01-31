import classnames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';

import { Tooltip, TooltipTypeMap } from '../Tooltip';

import styles from './EllipsisWithTooltip.module.scss';

const cx = classnames.bind(styles);

/**
 * @typedef EllipsisProp
 * @prop {string} [className]
 * @prop {string} [value]
 * @prop {React.ReactNode[] | React.ReactNode} children
 * @prop {object} [style]
 * @prop {TooltipTypeMap.DEFAULT| TooltipTypeMap.PRIMARY | TooltipTypeMap.SECONDARY} [type]
 * @prop {number} [delayShow]
 *
 */

/** @param {EllipsisProp} props */
const EllipsisWithTooltip = ({
	children,
	style,
	className,
	value,
	type = TooltipTypeMap.PRIMARY,
	delayShow = 700,
}) => {
	const targetRef = useRef(null);
	const [isVisible, setVisibility] = useState(false);
	const [delayShowLoop, setDelayShowLoop] = useState(null);

	const handleMouseEnter = () => {
		setDelayShowLoop(setTimeout(() => {
			setVisibility(true);
		}, parseInt(delayShow, 10)));
	};

	const handleMouseLeave = useCallback(
		() => {
			if (delayShowLoop) {
				clearTimeout(delayShowLoop);
			}
			setVisibility(false);
		},
		[delayShowLoop],
	);

	return (
		<>
			<span
				style={style}
				ref={targetRef}
				className={cx(className, 'ellipsis', 'u-text-truncate')}
			>
				<span
					className={cx('ellipsis__text')}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					{children}
				</span>
			</span>
			<Tooltip type={type} isVisible={isVisible} targetRef={targetRef}>{value ?? children}</Tooltip>
		</>
	);
};

EllipsisWithTooltip.propTypes = {
	className: PropTypes.string,
	value: PropTypes.string,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
	style: PropTypes.shape(),
	type: PropTypes.oneOf([TooltipTypeMap.DEFAULT, TooltipTypeMap.PRIMARY, TooltipTypeMap.SECONDARY]),
	delayShow: PropTypes.number,
};

export default EllipsisWithTooltip;
