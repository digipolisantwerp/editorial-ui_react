import { Icon } from '@redactie/react-components';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { propOr } from 'ramda';
import React, { useEffect, useRef, useState } from 'react';

import { ScrollableTabs } from '../ScrollableTabs';
import { Tooltip, TooltipTypeMap } from '../Tooltip';

import { setActiveLanguage } from './LanguageHeader.helpers';
import styles from './LanguageHeader.module.scss';
import { LanguageHeaderContext } from './LanguageHeaderContext';

const cx = classNames.bind(styles);

const LanguageHeader = ({
	className,
	children,
	isVisible = true,
	languages = [],
	activeLanguage,
	tooltipText,
	onChangeLanguage,
}) => {
	const buttonRef = useRef(null);
	const [visibility, setVisibility] = useState(false);
	const [availableLanguages, setLanguages] = useState(null);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (activeLanguage) {
			const i = languages.findIndex((l) => l.key === activeLanguage.key);
			setLanguages(setActiveLanguage(languages, i));
		}
	}, [languages, activeLanguage]);

	const handleChangeLanguage = (lang, i) => {
		setLanguages(setActiveLanguage(languages, i));
		onChangeLanguage(lang.name);
	};

	const renderTabs = () => {
		if (availableLanguages && availableLanguages.length > 0) {
			return (
				<ScrollableTabs
					className={cx('o-language-header__tabs')}
					items={availableLanguages.map((l) => {
						if (propOr([], l.name, errors).length) {
							return { ...l, hasErrors: true };
						}
						return l;
					})}
					tabStyle="button"
					onChange={handleChangeLanguage}
				/>
			);
		}

		return null;
	};

	const classNameRoot = cx(className, 'u-bg-white', 'o-language-header');

	return (
		<div className={classNameRoot}>
			{ isVisible && languages.length > 1 && (
				<div className={cx('o-language-header__top-section')}>
					{renderTabs()}
					{tooltipText && (
						<div>
							<button
								type="button"
								className="a-button a-button-transparent has-icon"
								ref={buttonRef}
								onMouseEnter={() => setVisibility(true)}
								onMouseLeave={() => setVisibility(false)}
							>
								<Icon name="globe" />

								<Tooltip
									isVisible={visibility}
									targetRef={buttonRef}
									type={TooltipTypeMap.PRIMARY}
									placement="bottom-end"
								>
									{tooltipText}
								</Tooltip>
							</button>
						</div>
					)}
				</div>
			)}
			<div className={cx('o-language-header__form-section')}>
				<LanguageHeaderContext.Provider value={
					// eslint-disable-next-line react/jsx-no-constructed-context-values
					{ languages, activeLanguage, setErrors }
				}
				>
					{children}
				</LanguageHeaderContext.Provider>
			</div>
		</div>
	);
};

const languageType = PropTypes.shape({
	key: PropTypes.string.isRequired,
	primary: PropTypes.bool,
});

LanguageHeader.propTypes = {
	/**
	 * Class name that will be added to the root element
	 * of the component
	 */
	className: PropTypes.string,
	children: PropTypes.node,
	/** languages, which are shown on the top of the component */
	languages: PropTypes.arrayOf(languageType).isRequired,
	activeLanguage: languageType,
	tooltipText: PropTypes.string,
	onChangeLanguage: PropTypes.func,
	isVisible: PropTypes.bool,
};

export default LanguageHeader;
