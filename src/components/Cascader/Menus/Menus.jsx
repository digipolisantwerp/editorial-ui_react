import { Spinner } from '@redactie/react-components';
import arrayTreeFilter from 'array-tree-filter';
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
	 * Hooks
	 */

	const [visualPath, setVisualPath] = React.useState([]);

	/**
	 * Functions
	 */

	const isActiveOption = (menuValue, menuOption, menuIndex) => menuValue[menuIndex]
		=== menuOption.value;
	const isVisualOption = (menuOption, menuIndex) => visualPath[menuIndex]
		&& visualPath[menuIndex].value === menuOption.value;

	const handleSelect = (path, option, menuIndex, e) => {
		// Prevent selecting the parent element because of nested lists
		e.stopPropagation();
		onSelect(path, option, menuIndex, e);
	};

	const openPath = (path, selectedOption, e) => {
		// Prevent hitting select
		e.stopPropagation();

		const activeOptions = arrayTreeFilter(
			options,
			(option, level) => option.value === path[level],
		);

		setVisualPath([...activeOptions, selectedOption]);
	};

	/**
	 * Render
	 */

	const renderExpandIconNode = (
		path,
		option,
		hasChildren,
	) => {
		if ((!hasChildren && option.isLeaf !== false) || option.loading) {
			return null;
		}
		return (
			<span
				className={`${prefixCls}-menu-item-expand-icon`}
				title={option.label}
				aria-label={option.label}
				role="button"
				tabIndex={0}
				onClick={(e) => openPath([...path], option, e)}
				onKeyDown={(e) => openPath([...path], option, e)}
			>
				<span className={`${prefixCls}-menu-item-expand-icon-icon fa fa-angle-right`} />
			</span>
		);
	};

	const renderLoadingIconNode = (isLoading) => {
		if (!isLoading) {
			return null;
		}
		return <Spinner className="u-margin-left-xs" size="small" />;
	};

	const renderCheckbox = () => null;
	const renderLabel = (label) => <span className="u-text-truncate">{label}</span>;

	const renderOption = (menuValue, option, menuIndex, path = []) => {
		const hasChildren = Array.isArray(option.children) && option.children.length > 0;
		const isNoLeaf = option.isLeaf === false;
		const isLoading = option.loading;
		const isActive = isActiveOption(menuValue, option, menuIndex);
		const isVisual = isVisualOption(option, menuIndex);
		const menuItemCls = classnames(`${prefixCls}-menu-item`, option.className, {
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
				onClick={(e) => handleSelect(path, option, menuIndex, e)}
				onKeyDown={(e) => handleSelect(path, option, menuIndex, e)}
			>
				<span
					className={`${prefixCls}-menu-item__label`}
					onMouseEnter={(e) => openPath([...path], option, e)}
				>
					{renderCheckbox(option, menuIndex)}
					{renderLabel(option.label)}
					{renderExpandIconNode(path, option, hasChildren)}
					{renderLoadingIconNode(isLoading)}
				</span>
				{(hasChildren || isNoLeaf) && isVisual && (
					<ul className={menuClass}>
						{option.children.map((child) => renderOption(
							menuValue,
							child,
							menuIndex + 1,
							[...path, option.value],
						))}
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
