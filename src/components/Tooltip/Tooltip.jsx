/* eslint-disable react/jsx-props-no-spreading */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, {
	useEffect, useMemo, useRef, useState,
} from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';

import { mergeRefs } from '../../helpers';

import { TooltipSizeMap, TooltipTypeMap } from './Tooltip.const';
import './Tooltip.scss';

const Tooltip = ({
	children,
	className,
	targetRef,
	tooltipRef = null,
	container,
	isVisible,
	type = TooltipTypeMap.DEFAULT,
	disablePortal = false,
	placement = 'bottom-start',
	size = 'normal',
}) => {
	const tooltipClasses = classnames(className, 'a-tooltip', 'a-tooltip--no-arrow', {
		'a-tooltip--primary': type === TooltipTypeMap.PRIMARY,
		'a-tooltip--secondary': type === TooltipTypeMap.SECONDARY,
		'a-tooltip--white': type === TooltipTypeMap.WHITE,
		'a-tooltip--dark': type === TooltipTypeMap.DARK,
		'a-tooltip--small': size === TooltipSizeMap.SMALL,
	});
	const [mountNode, setMountNode] = useState(null);
	const popperElement = useRef(null);
	const [arrowRef, setArrowRef] = useState(null);

	useEffect(() => {
		if (!disablePortal) {
			const node = container || document.body;
			setMountNode(node);
		}
	}, [container, disablePortal]);

	const popperOptions = useMemo(
		() => ({
			placement,
			modifiers: [
				{
					name: 'offset',
					options: {
						offset: [0, 10],
					},
				},
				{
					name: 'arrow',
					options: {
						element: arrowRef,
					},
				},
			],
		}),
		[arrowRef, placement],
	);

	const { styles, attributes } = usePopper(
		targetRef.current,
		popperElement.current,
		popperOptions,
	);

	if (!isVisible) return null;

	const renderTooltip = () => (isVisible ? (
		<div
			className={tooltipClasses}
			style={styles.popper}
			ref={mergeRefs([popperElement, tooltipRef])}
			{...attributes.popper}
		>
			<div ref={setArrowRef} className="arrow">
				{type === TooltipTypeMap.WHITE && <div className="innerArrow" />}
			</div>
			{children}
		</div>
	) : null);

	return !disablePortal && mountNode
		? createPortal(renderTooltip(), mountNode)
		: renderTooltip();
};

Tooltip.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	type: PropTypes.oneOf([
		TooltipTypeMap.DEFAULT,
		TooltipTypeMap.PRIMARY,
		TooltipTypeMap.SECONDARY,
		TooltipTypeMap.WHITE,
		TooltipTypeMap.DARK,
	]),
	size: PropTypes.oneOf([
		TooltipSizeMap.SMALL,
		TooltipSizeMap.NORMAL,
	]),
	targetRef: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
	]).isRequired,
	tooltipRef: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
	]),
	isVisible: PropTypes.bool.isRequired,
	disablePortal: PropTypes.bool,
	container: PropTypes.node,
	placement: PropTypes.string,
};

export default Tooltip;
