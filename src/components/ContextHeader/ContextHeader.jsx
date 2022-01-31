import { Label } from '@acpaas-ui/react-components';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import { useSlot } from '../../hooks';
import { ScrollableTabs } from '../ScrollableTabs';

import styles from './ContextHeader.module.scss';
import { ContextHeaderActionsSection, ContextHeaderTopSection } from './ContextHeader.slots';

const cx = classNames.bind(styles);

/**
 * @typedef ContextHeaderProps
 * @prop {string} [className]
 * @prop {React.ReactNode|React.ReactNode[]} [children]
 * @prop {string | React.ReactNode} [title]
 * @prop {object[]} [badges]
 * @prop {'primary' | 'secondary' | 'success' | 'warning' | 'danger'} badges.type
 * @prop {string} badges.name
 * @prop {object[]} [tabs]
 * @prop {string} tabs.name
 * @prop {string} tabs.target
 * @prop {boolean} [tabs.active]
 * @prop {boolean} [tabs.disabled]
 * @prop {Function} [linkProps]
 *
 */
/** @param {ContextHeaderProps} props */
const ContextHeader = ({
	className,
	children,
	title = '',
	linkProps = (props) => props,
	badges = [],
	tabs = [],
}) => {
	const topSectionSlot = useSlot(ContextHeaderTopSection, children);
	const actionsSlot = useSlot(ContextHeaderActionsSection, children);

	const renderBadges = () => {
		if (badges && badges.length > 0) {
			return (
				<div className="o-context-header__badges">
					{
						badges.map((badge, index) => (
							<Label
								className="u-margin-right-xs u-margin-top-xs u-margin-bottom-xs"
								key={index}
								type={badge.type}
							>
								{badge.name}
							</Label>
						))
					}
				</div>
			);
		}

		return null;
	};

	const renderTabs = () => {
		if (tabs && tabs.length > 0) {
			return (
				<ScrollableTabs
					className={cx('o-context-header__tabs')}
					items={tabs}
					linkProps={linkProps}
				/>
			);
		}

		return null;
	};

	const classNameRoot = cx(className, 'u-bg-light', 'o-context-header');
	const classNameTopSection = cx('o-context-header__top-section');
	const classNameBody = cx('o-context-header__body');
	const classNameBodyTitle = cx('o-context-header__body__title');

	return (
		<div className={classNameRoot}>
			<div className="u-container u-wrapper">
				{
					topSectionSlot && (
						<div className={classNameTopSection}>
							{topSectionSlot}
						</div>
					)
				}
				<div className={classNameBody}>
					<div className={classNameBodyTitle}>
						<h1 className="h2 u-margin-right-xs">{title}</h1>
						{renderBadges()}
					</div>
					{
						actionsSlot && (
							<div>
								{actionsSlot}
							</div>
						)
					}
				</div>
				{renderTabs()}
			</div>
		</div>
	);
};

ContextHeader.propTypes = {
	/**
	 * Class name that will be added to the root element
	 * of the component
	 */
	className: PropTypes.string,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]),
	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.node,
	]).isRequired,
	/** Badges, which are shown on the right side of the title */
	badges: PropTypes.arrayOf(PropTypes.shape({
		type: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger']).isRequired,
		name: PropTypes.string.isRequired,
	})),
	/** tabs, which are shown on the bottom of the component */
	tabs: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		target: PropTypes.string.isRequired,
		active: PropTypes.bool,
		disabled: PropTypes.bool,
	})),
	/**
	 * Use this to pass a custom link-component to override the default <a> tag used inside the tabs
	 * */
	linkProps: PropTypes.func,
};

export default ContextHeader;
