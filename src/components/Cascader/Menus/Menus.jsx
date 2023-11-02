import { Spinner } from '@redactie/react-components';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const Menus = ({
	value = [],
	options = [],
	onSelect = () => null,
	prefixCls = 'o-cascader',
}) => {
	const menuClass = `${prefixCls}-menu m-flyout__content`;

	/**
	 * Functions
	 */

	const isActiveOption = (menuValue, menuOption, menuIndex) => menuValue[menuIndex]
		=== menuOption.value;

	const handleSelect = (option, menuIndex, e) => {
		// Prevent selecting the parent element because of nested lists
		e.stopPropagation();
		onSelect(option, menuIndex, e);
	};

	/**
	 * Render
	 */

	const renderExpandIconNode = (hasChildren, isNoLeaf, isLoading) => {
		if ((!hasChildren && !isNoLeaf) || isLoading) {
			return null;
		}
		return <span className={`${prefixCls}-menu-item-expand-icon fa fa-angle-right`} />;
	};

	const renderLoadingIconNode = (isLoading) => {
		if (!isLoading) {
			return null;
		}
		return <Spinner className="u-margin-left-xs" size="small" />;
	};

	const renderOption = (menuValue, option, menuIndex) => {
		const hasChildren = Array.isArray(option.children) && option.children.length > 0;
		const isNoLeaf = option.isLeaf === false;
		const isLoading = option.loading;
		const isActive = isActiveOption(menuValue, option, menuIndex);
		const menuItemCls = classnames(`${prefixCls}-menu-item`, {
			[`${prefixCls}-menu-item--active`]: isActive,
			[`${prefixCls}-menu-item--disabled`]: option.disabled,
			[`${prefixCls}-menu-item--loading`]: isLoading,
		});
		return (
			<li
				key={`${option.value}-${menuIndex}`}
				className={menuItemCls}
				title={option.label}
				role="menuitem"
				onClick={(e) => handleSelect(option, menuIndex, e)}
				onKeyDown={(e) => handleSelect(option, menuIndex, e)}
			>
				<span className={`${prefixCls}-menu-item__label`}>
					<span className="u-text-truncate">{option.label}</span>
					{renderExpandIconNode(hasChildren, isNoLeaf, isLoading)}
					{renderLoadingIconNode(isLoading)}
				</span>
				{(hasChildren || isNoLeaf) && isActive && (
					<ul className={menuClass}>
						{option.children.map((child) => renderOption(menuValue, child, menuIndex + 1))}
					</ul>
				)}
			</li>
		);
	};

	return (
		<ul className={menuClass}>
			{options.map((option) => renderOption(value, option, 0))}
		</ul>
	);
};

const CasCaderOption = PropTypes.shape({
	/**
	 * Value of the option
	 */
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	/**
	 * Human readable label
	 */
	label: PropTypes.node,
	/**
	 * True when loading
	 */
	loading: PropTypes.bool,
	/**
	 * Indicates the end of a cascader tree
	 */
	isLeaf: PropTypes.bool,
});

CasCaderOption.children = PropTypes.arrayOf(CasCaderOption);

Menus.propTypes = {
	prefixCls: PropTypes.string,
	/**
	 * Value
	 */
	value: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.arrayOf(PropTypes.number),
	]),
	/**
	 * Options
	 */
	options: PropTypes.arrayOf(PropTypes.shape({
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
		]),
		label: PropTypes.node,
		loading: PropTypes.bool,
		isLeaf: PropTypes.bool,
		children: PropTypes.arrayOf(CasCaderOption),
	})),
	/**
	 * Callback when selecting an option
	 */
	onSelect: PropTypes.func,
};

export default Menus;
