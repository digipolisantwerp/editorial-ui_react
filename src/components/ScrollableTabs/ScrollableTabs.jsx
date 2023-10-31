import { Tabs } from '@redactie/react-components';
import classnames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, {
	useCallback, useEffect, useRef, useState,
} from 'react';

import styles from './ScrollableTabs.module.scss';

const cx = classnames.bind(styles);

const ScrollableTabs = ({
	className,
	items = [],
	linkProps = (props) => props,
	tabStyle = 'link',
	alignTabs = 'left',
	onChange = () => {},
}) => {
	/**
	 * Hooks
	 */
	const hasInitialised = useRef(false);
	const scrollContainerRef = useRef(null);
	const tabsRef = useRef(null);
	const [activeEl, setActiveEl] = useState(null);
	const [tabsHeight, setTabsHeight] = useState(0);
	const [showLeftGradient, setShowLeftGradient] = useState(false);
	const [showRightGradient, setShowRightGradient] = useState(false);

	// Hide horizontal scrollbar
	useEffect(() => {
		if (scrollContainerRef.current) {
			const tabsEl = scrollContainerRef.current.querySelector('.m-nav-tabs');
			tabsRef.current = tabsEl;
			setTabsHeight(tabsEl.clientHeight);
		}
	}, []);

	// Set active element
	useEffect(() => {
		if (tabsRef.current && items.length) {
			setActiveEl(tabsRef.current.querySelector('.is-active'));
		}
	}, [items]);

	// Scroll active tab into view
	const scrollToActive = useCallback(() => {
		if (activeEl) {
			const tabsEl = tabsRef.current;
			const rect = activeEl.getBoundingClientRect();
			// - 24 = width of gradient, so the active tab will be fully visible
			const newX = rect.left + tabsEl.scrollLeft - 24;

			// scrollTo is not supported on IE and Safari (iOS)
			if (tabsEl.scrollTo) {
				tabsEl.scrollTo({ top: 0, left: newX, behavior: 'smooth' });
			} else {
				tabsEl.scrollLeft = newX;
			}
		}
	}, [activeEl]);

	// Set gradients to indicate it's scrollable
	const setGradients = useCallback(
		(element) => {
			if (!element) {
				return;
			}

			const containerEnd = Math.round(element.clientWidth);
			const leftOffset = Math.round(element.scrollLeft);
			const rightOffset = Math.round(element.scrollWidth - leftOffset);
			const showLeft = leftOffset > 0;
			const showRight = rightOffset > containerEnd;

			if (showLeft !== showLeftGradient) {
				setShowLeftGradient(showLeft);
			}
			if (showRight !== showRightGradient) {
				setShowRightGradient(showRight);
			}
		},
		[showLeftGradient, showRightGradient],
	);

	const onTabsScroll = useCallback(
		(e) => {
			setGradients(e.target);
		},
		[setGradients],
	);

	// Set scroll listener
	useEffect(() => {
		const tabsEl = tabsRef.current;

		if (tabsEl) {
			tabsEl.addEventListener('scroll', onTabsScroll);
		}

		return () => {
			if (tabsEl) {
				tabsEl.removeEventListener('scroll', onTabsScroll);
			}
		};
	}, [onTabsScroll]);

	// Set initial values
	useEffect(() => {
		if (!hasInitialised.current && tabsRef.current) {
			setGradients(tabsRef.current);
			hasInitialised.current = true;
		}
	}, [items.length, setGradients]);

	useEffect(() => {
		if (items.length && hasInitialised.current && activeEl) {
			scrollToActive();
		}
	}, [activeEl, items.length, scrollToActive]);

	/**
	 * Render
	 */
	return (
		<div
			className={cx(className, 'o-scrollable-tabs', {
				'o-scrollable-tabs--gradient-left': showLeftGradient,
				'o-scrollable-tabs--gradient-right': showRightGradient,
			})}
			ref={scrollContainerRef}
			style={{ height: `${tabsHeight}px` }}
		>
			{tabStyle === 'link' ? (
				<Tabs items={items} linkProps={linkProps} />
			) : (
				<ul
					className={cx('m-nav-tabs', {
						'm-nav-tabs--left': alignTabs === 'left',
						'm-nav-tabs--right': alignTabs === 'right',
					})}
				>
					{items.map((item, index) => (
						<li key={item.name}>
							<button
								type="button"
								className={cx({
									'is-active': item.active,
									'is-disabled': item.disabled,
									'has-errors': item.hasErrors,
								})}
								onClick={() => onChange(item, index)}
							>
								{item.name}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

ScrollableTabs.propTypes = {
	className: PropTypes.string,
	items: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			target: PropTypes.string,
			active: PropTypes.bool,
			disabled: PropTypes.bool,
			hasErrors: PropTypes.bool,
		}),
	),
	tabStyle: PropTypes.oneOf(['link', 'button']),
	alignTabs: PropTypes.oneOf(['left', 'right', 'center']),
	linkProps: PropTypes.func,
	onChange: PropTypes.func,
};

export default ScrollableTabs;
