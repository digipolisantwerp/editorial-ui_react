import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { useSlot } from '../../hooks';

import styles from './ActionBar.module.scss';
import { ActionBarContentSection } from './ActionBar.slots';

const cx = classNames.bind(styles);

/**
 * @typedef ActionBarProps
 * @prop {string} [className]
 * @prop {React.ReactNode} [children]
 * @prop {React.ReactNode} [container]
 * @prop {boolean} [disablePortal]
 * @prop {boolean} isOpen
 */

/** @param {ActionBarProps} props */
const ActionBar = ({
	children,
	className,
	container,
	disablePortal = false,
	isOpen,
}) => {
	const [mountNode, setMountNode] = useState(null);
	const contentSlot = useSlot(ActionBarContentSection, children);

	useEffect(() => {
		if (!disablePortal) {
			const node = container || document.body;
			setMountNode(node);
		}
	}, [container, disablePortal]);

	const renderActionBar = () => (isOpen ? (
		<div className={cx(className, 'o-action-bar')}>
			<div className="u-container">
				<div className="o-action-bar__content u-margin-top-xs u-margin-bottom-xs">
					{contentSlot}
				</div>
			</div>
		</div>
	) : null);

	return !disablePortal && mountNode
		? createPortal(renderActionBar(), mountNode)
		: renderActionBar();
};

ActionBar.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
	container: PropTypes.node,
	disablePortal: PropTypes.bool,
	isOpen: PropTypes.bool.isRequired,
};

export default ActionBar;
