import arrayTreeFilter from 'array-tree-filter';
import PropTypes from 'prop-types';
import Trigger from 'rc-trigger';
import React, { useEffect, useRef, useState } from 'react';

import { KEY_CODE } from '../../const';

import { ALLOWED_KEYS, BUILT_IN_PLACEMENTS, REOPEN_POPUP_KEYS } from './Cascader.const';
import { Menus } from './Menus';
import './Cascader.scss';

/**
 * @typedef {object} CascaderOption
* Value of the option
* @prop {string|number} value
* Human readable label
* @prop {React.ReactNode} label
* True when loading
* @prop {boolean} CascaderOptionsProps.loading
* Indicates the end of a cascader tree
* @prop {boolean} CascaderOptionsProps.isLeaf
 */

/**
 * @typedef CascaderProps
 * Component class prefix
 * @prop {string} [prefixCls]
 * Default value
 * @prop {string[] | number[]} [defaultValue]
 * Value
 * @prop {string[] | number[]} [value]
 * Cascader options
 * @prop {object[]} [options]
 * @prop {string | number} [options.value]
 * @prop {React.ReactNode} [options.label]
 * @prop {boolean} [options.loading]
 * @prop {boolean} [options.isLeaf]
 * @prop {CascaderOption[]} [options.children]
 * Change the value on each selection, by default it will only
 * trigger the onchange event when selecting a leaf option
 * @prop {boolean} [changeOnSelect]
 * Callback when finisching the cascader select
 * @prop {Function} [onChange]
 * Lazy load children
 * @prop {Function} [loadData]
 * Selecting an option is not possible when disabled
 * @prop {boolean} [disabled]
 * @prop {React.ReactElement} [children]
 */

/** @param {CascaderProps} props */
const Cascader = ({
	defaultValue,
	value,
	options,
	disabled = false,
	changeOnSelect = false,
	children,
	prefixCls = 'o-cascader',
	onChange = () => null,
	loadData = () => null,
}) => {
	const [popupVisible, setPopupVisible] = useState(false);
	const [activeValue, setActiveValue] = useState(defaultValue ?? []);
	const triggerEl = useRef(null);

	/**
	 * Hooks
	 */
	useEffect(() => {
		if (Array.isArray(value)) {
			setActiveValue(value);
		}
	}, [value]);

	/**
	 * Functions
	 */
	const getActiveOptions = (cascadeOptions = [], cascadeActiveValue = []) => arrayTreeFilter(
		cascadeOptions,
		(option, level) => option.value === cascadeActiveValue[level],
	);

	const getCurrentLevelOptions = () => {
		if (!Array.isArray(options) || !Array.isArray(activeValue)) {
			return [];
		}
		const result = getActiveOptions(options, activeValue);

		if (result[result.length - 2]) {
			return result[result.length - 2].children;
		}
		return options.filter((o) => !o.disabled);
	};

	const getNextIndex = (currentOptions, currentIndex, e) => {
		if (currentIndex === -1) {
			return 0;
		}
		const nextIndexDown = currentIndex + 1;
		const nextIndexUp = currentIndex - 1;

		if (e.keyCode === KEY_CODE.DOWN) {
			return nextIndexDown >= currentOptions.length ? 0 : nextIndexDown;
		}

		return nextIndexUp < 0 ? currentOptions.length - 1 : nextIndexUp;
	};

	const handleChange = (activeOptions, visible, e) => {
		if (e.type !== 'keydown' || e.keyCode === KEY_CODE.ENTER) {
			onChange(activeOptions.map((activeOption) => activeOption.value), activeOptions);
			setPopupVisible(visible);
		}
	};

	const handleMenuSelect = (targetOption, menuLevel, e) => {
		const triggerNode = triggerEl.current.getRootDomNode();
		if (triggerNode && triggerNode.focus && !targetOption.children) {
			triggerNode.focus();
		}

		if (!targetOption || targetOption.disabled) {
			return;
		}

		const newActiveValue = activeValue.slice(0, menuLevel + 1);
		newActiveValue[menuLevel] = targetOption.value;
		const activeOptions = getActiveOptions(options, newActiveValue);

		/**
		 * When the targetOption is not a leaf and it has no children
		 * It must have a loadData function to lazy load the children
		 */
		if (targetOption.isLeaf === false && !targetOption.children && loadData) {
			// Call the onchange function on evry select when change on select is set to
			// true
			if (changeOnSelect) {
				handleChange(activeOptions, true, e);
			}
			setActiveValue(newActiveValue);
			loadData(activeOptions, menuLevel);
			return;
		}

		// check if the target option is a leaf
		if (
			!targetOption.children
			|| !targetOption.children.length
			|| targetOption.children.length === 0
		) {
			// close popup and handle change
			handleChange(activeOptions, false, e);
		} else if (changeOnSelect && (e.type === 'click' || e.type === 'keydown')) {
			// handle change on every select
			handleChange(activeOptions, true, e);
		}
		setActiveValue(newActiveValue);
	};

	const handleKeyDown = (e) => {
		// Only hanlde the keys listed underneath
		if (!ALLOWED_KEYS.includes(e.keyCode)) {
			return;
		}

		// Reopen the popup when the user hits one of the keys
		// listed underneath
		if (
			!popupVisible
			&& REOPEN_POPUP_KEYS.includes(e.keyCode)
		) {
			// open the popup and do nothing else
			setPopupVisible(true);
			return;
		}

		/**
		 * Key functionality when the popup is open.
		 * The user can navigate through the cascade by using a set of key strokes
		 */
		const events = {
			isGoingUpOrDown: e.keyCode === KEY_CODE.DOWN || e.keyCode === KEY_CODE.UP,
			isGoingLeft: e.keyCode === KEY_CODE.LEFT || e.keyCode === KEY_CODE.BACKSPACE,
			isGoingRight: e.keyCode === KEY_CODE.RIGHT,
			isLoosingFocus: e.keyCode === KEY_CODE.ESC || e.keyCode === KEY_CODE.TAB,
		};
		const newActiveValue = [...activeValue];
		const currentLevel = newActiveValue.length - 1 < 0 ? 0 : newActiveValue.length - 1;
		const currentOptions = getCurrentLevelOptions();
		const currentIndex = currentOptions
			.map((option) => option.value).indexOf(newActiveValue[currentLevel]);

		if (events.isGoingUpOrDown) {
			e.preventDefault();
			const nextIndex = getNextIndex(currentOptions, currentIndex, e);
			newActiveValue[currentLevel] = currentOptions[nextIndex].value;
		} else if (events.isGoingLeft) {
			e.preventDefault();
			newActiveValue.splice(newActiveValue.length - 1, 1);
		} else if (events.isGoingRight) {
			e.preventDefault();
			if (currentOptions[currentIndex] && currentOptions[currentIndex].children) {
				newActiveValue.push(
					currentOptions[currentIndex].children[0].value,
				);
			}
		} else if (events.isLoosingFocus) {
			setPopupVisible(false);
			return;
		}

		if (newActiveValue.length === 0) {
			setPopupVisible(false);
		}

		const activeOptions = getActiveOptions(options, newActiveValue);
		const targetOption = activeOptions[activeOptions.length - 1];

		handleMenuSelect(targetOption, activeOptions.length - 1, e);
	};

	/**
	 * Render
	 */

	const renderPopupNode = () => {
		if (!Array.isArray(options) || options.length === 0) {
			return null;
		}

		return (
			<Menus
				value={activeValue}
				onSelect={handleMenuSelect}
				options={options}
			/>
		);
	};

	return (
		<Trigger
			ref={triggerEl}
			popupPlacement="bottomLeft"
			builtinPlacements={BUILT_IN_PLACEMENTS}
			action={disabled ? [] : ['click']}
			popupVisible={disabled ? false : popupVisible}
			onPopupVisibleChange={setPopupVisible}
			prefixCls={`${prefixCls}-menus`}
			popup={renderPopupNode()}
		>
			{React.cloneElement(children, {
				onKeyDown: handleKeyDown,
				tabIndex: disabled ? undefined : 0,
			})}
		</Trigger>
	);
};

const CascaderOption = PropTypes.shape({
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

CascaderOption.children = PropTypes.arrayOf(CascaderOption);

Cascader.propTypes = {
	/**
	 * Component class prefix
	 */
	prefixCls: PropTypes.string,
	/**
	 * Default value
	 */
	defaultValue: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.arrayOf(PropTypes.number),
	]),
	/**
	 * Value
	 */
	value: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.arrayOf(PropTypes.number),
	]),
	/**
	 * Cascader options
	 */
	options: PropTypes.arrayOf(PropTypes.shape({
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
		]),
		label: PropTypes.node,
		loading: PropTypes.bool,
		isLeaf: PropTypes.bool,
		children: PropTypes.arrayOf(CascaderOption),
	})),
	/**
	 * Change the value on each selection, by default it will only
	 * trigger the onchange event when selecting a leaf option
	 */
	changeOnSelect: PropTypes.bool,
	/**
	 * Callback when finisching the cascader select
	 */
	onChange: PropTypes.func,
	/**
	 * Lazy load children
	 */
	loadData: PropTypes.func,
	/**
	 * Selecting an option is not possible when disabled
	 */
	disabled: PropTypes.bool,
	children: PropTypes.element,
};

export default Cascader;
