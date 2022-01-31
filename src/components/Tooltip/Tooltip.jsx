/* eslint-disable react/jsx-props-no-spreading */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, {
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';

import { TooltipTypeMap } from './Tooltip.const';
import './Tooltip.scss';

/**
 * @typedef TooltipProps
 * @prop {React.ReactNode[] | React.ReactNode} children
 * @prop {TooltipTypeMap.DEFAULT | TooltipTypeMap.PRIMARY | TooltipTypeMap.SECONDARY} [type]
 * @prop {Function | {current: Element}} targetRef
 * @prop {boolean} isVisible
 * @prop {boolean} [disablePortal]
 * @prop {React.ReactNode} [container]
 * @prop {string} [placement]
 */

/** @param {TooltipProps} props */
const Tooltip = ({
	children,
	targetRef,
	container,
	isVisible,
	type = TooltipTypeMap.DEFAULT,
	disablePortal = false,
	placement = 'bottom-start',
}) => {
	const tooltipClasses = classnames('a-tooltip', 'a-tooltip--no-arrow', {
		'a-tooltip--primary': type === TooltipTypeMap.PRIMARY,
		'a-tooltip--secondary': type === TooltipTypeMap.SECONDARY,
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
			modifiers: [{
				name: 'offset',
				options: {
					offset: [0, 10],
				},
			}, {
				name: 'arrow',
				options: {
					element: arrowRef,
				},
			}],
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
			ref={popperElement}
			{...attributes.popper}
		>
			<div ref={setArrowRef} className="arrow" />
			{children}
		</div>
	) : null);

	return !disablePortal && mountNode
		? createPortal(renderTooltip(), mountNode)
		: renderTooltip();
};

Tooltip.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
	type: PropTypes.oneOf([TooltipTypeMap.DEFAULT, TooltipTypeMap.PRIMARY, TooltipTypeMap.SECONDARY]),
	targetRef: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
	]).isRequired,
	isVisible: PropTypes.bool.isRequired,
	disablePortal: PropTypes.bool,
	container: PropTypes.node,
	placement: PropTypes.string,
};

export default Tooltip;
