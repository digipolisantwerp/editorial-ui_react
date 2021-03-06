import { isNil, isObject, isString } from '../../helpers';

const getCellValue = (rowData, key, fallback) => {
	if (!key) {
		return null;
	}

	const value = rowData[key];

	if (isObject(value)) {
		return String(value);
	}

	if (isNil(value) && fallback) {
		return fallback;
	}

	return value;
};

const getFormatValue = (rowData, col, rowIndex) => {
	if (isString(col)) {
		return getCellValue(rowData, col);
	}

	const cellValue = getCellValue(rowData, col.value, col.fallback);

	return col.format
		? col.format(cellValue, col, rowData, rowIndex)
		: cellValue;
};

export const getHeaderProps = (col, activeSorting, onSortClick) => {
	const keyPrefix = 'table-header';

	if (isString(col)) {
		return { key: `${keyPrefix}-${col}`, label: col };
	}

	return {
		key: `${keyPrefix}-${col.label}`,
		component: col.headerComponent,
		classList: col.classList,
		disableSorting: col.disableSorting,
		label: col.label,
		value: col.value,
		width: col.width,
		activeSorting,
		onSortClick,
	};
};

export const getCellProps = (col, rowData, rowIndex) => {
	const keyPrefix = 'table-cell';

	if (isString(col)) {
		return { key: `${keyPrefix}-${col}`, label: col };
	}

	return {
		key: `${keyPrefix}-${col.label}`,
		classList: col.classList,
		component: col.component,
		ellipsis: col.ellipsis,
		rowData,
		rowIndex,
		value: getFormatValue(rowData, col, rowIndex),
	};
};
