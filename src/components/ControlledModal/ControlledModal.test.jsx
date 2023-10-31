import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import ControlledModal from './ControlledModal';
import { ControlledModalBody, ControlledModalFooter, ControlledModalHeader } from './ControlledModal.slots';

const defaultProps = { show: true };

const renderControlledModal = ({ children, ...rest } = {}, renderOptions = {}) => render(
	<ControlledModal {...defaultProps} {...rest}>
		{children || (
			<>
				<ControlledModalHeader><span data-testid="header" /></ControlledModalHeader>
				<ControlledModalBody><span data-testid="body" /></ControlledModalBody>
				<ControlledModalFooter><span data-testid="footer" /></ControlledModalFooter>
			</>
		)}
	</ControlledModal>,
	renderOptions,
);

describe('<ControlledModal />', () => {
	it('Should set the correct classNames', () => {
		const className = 'custom-modal';
		const overlayClassName = 'custom-overlay';
		const { baseElement } = renderControlledModal({ className, overlayClassName, size: 'large' });
		const overlayEl = baseElement.querySelector('.m-overlay');
		const modalEl = baseElement.querySelector('.m-modal');

		expect(overlayEl).toHaveClass(overlayClassName);
		expect(modalEl).toHaveClass(className);
		expect(modalEl).toHaveClass('m-modal--large');
	});

	it('Should portal in a given `node`', () => {
		const node = document.createElement('div');
		const { queryByTestId } = renderControlledModal({ node }, { container: node });
		const modalEl = queryByTestId('body').closest('.m-modal');

		expect(modalEl).not.toBeNull();
	});

	it('Should be visble based on `show` prop', () => {
		const { baseElement, rerender } = render(<ControlledModal show={false} />);

		expect(baseElement.querySelector('.m-overlay')).not.toHaveClass('is-active');
		rerender(<ControlledModal show />);
		expect(baseElement.querySelector('.m-overlay')).toHaveClass('is-active');
	});

	it('Should trigger `onClose` when given', () => {
		const onClose = jest.fn();
		const { baseElement } = renderControlledModal({ onClose });
		const closeEl = baseElement.querySelector('.m-modal__close');

		fireEvent.click(closeEl);

		expect(closeEl).not.toBeNull();
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('Should render children if no slots are given', () => {
		const { baseElement, queryByTestId } = renderControlledModal({
			children: <span data-testid="only-children" />,
			onClose: () => null,
		});
		const childEl = queryByTestId('only-children');
		const closeEl = baseElement.querySelector('.m-modal__close');

		expect(childEl).not.toBeNull();
		expect(closeEl).not.toBeNull();
	});

	it('Should render slots', () => {
		const { queryByTestId } = renderControlledModal();
		const headerEl = queryByTestId('header');
		const bodyEl = queryByTestId('body');
		const footerEl = queryByTestId('footer');

		expect(headerEl).not.toBeNull();
		expect(bodyEl).not.toBeNull();
		expect(footerEl).not.toBeNull();
	});

	it('Should lock body scroll based on `show` prop', () => {
		const { baseElement, rerender } = render(<ControlledModal show />);

		expect(baseElement).toHaveStyle('overflow: hidden');

		rerender(<ControlledModal show={false} />);

		expect(baseElement).toHaveAttribute('style', '');
	});
});
