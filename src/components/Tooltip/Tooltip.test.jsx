import {
	act,
	fireEvent,
	render,
	waitFor,
} from '@testing-library/react';
import React, { useRef, useState } from 'react';

import Tooltip from './Tooltip';
import { TooltipTypeMap } from './Tooltip.const';

const tooltipText = 'Some tooltip info';

const ButtonWithTooltip = (props = {}) => {
	const buttonRef = useRef(null);
	const [isVisible, setVisibility] = useState(false);

	return (
		<>
			<button type="button" ref={buttonRef} onClick={() => act(() => setVisibility(true))}>Click me</button>
			<Tooltip isVisible={isVisible} targetRef={buttonRef} {...props}>{tooltipText}</Tooltip>
		</>
	);
};

const renderButtonWithTooltip = (props = {}) => render(<ButtonWithTooltip {...props} />);

describe('<Tooltip/>', () => {
	it('should render a default tooltip', async () => {
		const { queryByText } = renderButtonWithTooltip();
		const button = queryByText('Click me');

		fireEvent.click(button);

		await waitFor(() => {
			const tooltipNode = queryByText(tooltipText);
			expect(tooltipNode).toBeDefined();
		});
	});

	it('should render a primary tooltip', async () => {
		const { queryByText } = renderButtonWithTooltip({
			type: TooltipTypeMap.PRIMARY,
		});
		const button = queryByText('Click me');

		fireEvent.click(button);

		await waitFor(() => {
			const tooltipNode = queryByText(tooltipText);
			expect(tooltipNode).toHaveClass('a-tooltip--primary');
		});
	});

	it('should render a secondary tooltip', async () => {
		const { queryByText } = renderButtonWithTooltip({
			type: TooltipTypeMap.SECONDARY,
		});
		const button = queryByText('Click me');

		fireEvent.click(button);

		await waitFor(() => {
			const tooltipNode = queryByText(tooltipText);
			expect(tooltipNode).toHaveClass('a-tooltip--secondary');
		});
	});

	it('Should set a className when given', async () => {
		const className = 'c-custom-tooltip';
		const { queryByText } = renderButtonWithTooltip({ className, isVisible: true });

		await waitFor(() => {
			const tooltipNode = queryByText(tooltipText);
			expect(tooltipNode).toHaveClass(className);
		});
	});

	it('Should pass a ref to the tooltip element', async() => {
		const tooltipRef = jest.fn();
		const { queryByText } = renderButtonWithTooltip({ tooltipRef, isVisible: true });

		await waitFor(() => {
			const tooltipNode = queryByText(tooltipText);
			expect(tooltipRef).toHaveBeenLastCalledWith(tooltipNode);
		});
	});
});
