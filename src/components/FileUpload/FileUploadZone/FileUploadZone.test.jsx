import { createEvent, fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { NEVER, of } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { FileUploadDescription, FileUploadMessage } from '../FileUpload.slots';
import { Uploader } from '../Uploader';

import FileUploadZone from './FileUploadZone';

jest.mock('../Uploader');

const FileUploadDescriptionComponent = () => (<span data-testid="description" />);
const FileUploadMessageComponent = () => (<span data-testid="message" />);
const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
const uploadResponse = {
	file: {
		name: 'example.png',
	},
};

const renderFileUploadZone = (props, MessageComponent, DescriptionComponent) => {
	const defaultProps = {
		id: 'upload_id',
	};
	return render(
		<FileUploadZone {...defaultProps} {...props}>
			{ MessageComponent && (
				<FileUploadMessage>
					<MessageComponent />
				</FileUploadMessage>
			)}

			{
				DescriptionComponent && (
					<FileUploadDescription>
						<DescriptionComponent />
					</FileUploadDescription>
				)
			}
		</FileUploadZone>,
	);
};

const fireFileUpload = (container, f) => {
	const fileInput = container.querySelector('.m-upload__input');

	if (!fileInput) {
		throw new Error('FileInput not found!');
	}

	act(() => {
		fireEvent.change(
			fileInput,
			{
				target: {
					files: [f],
				},
			},
		);
	});
};

const fireFileUploadOnDrop = (container, f) => {
	const fileInput = container.querySelector('.m-upload__input');
	const fileDropEvent = createEvent.drop(fileInput);
	const fileList = [f];

	Object.defineProperty(fileDropEvent, 'dataTransfer', {
		value: {
			files: fileList,
		},
	});

	fireEvent(fileInput, fileDropEvent);
};

describe('<FileUploadZone/>', () => {
	let uploader;
	beforeEach(() => {
		Uploader.mockClear();
		uploader = new Uploader();
	});

	describe('upload a file by clicking on the file upload zone', () => {
		describe('upload an invalid file', () => {
			it('should call the `invalidFiles` callback with the invalid files', async () => {
				const invalidFiles = [
					{
						reasons: ['INVALID_FILE_TYPE'],
						file,
					},
				];
				uploader.validateFiles.mockReturnValue({
					invalidFiles,
					validFiles: [],
				});
				const validateFilesSpy = jest.spyOn(uploader, 'validateFiles');
				const handleInvalidFiles = jest.fn();
				const { container } = renderFileUploadZone({
					uploader,
					invalidFiles: handleInvalidFiles,
				});

				await waitFor(() => {
					fireFileUpload(container, file);
					expect(validateFilesSpy).toHaveBeenCalledWith([file]);
					expect(handleInvalidFiles).toHaveBeenCalledWith(invalidFiles);
				});
			});
		});

		describe('upload a valid file', () => {
			const validFiles = [file];
			let validateFilesSpy;
			let uploadFilesSpy;

			beforeEach(() => {
				uploader.validateFiles.mockReturnValue({
					invalidFiles: [],
					validFiles,
				});
				validateFilesSpy = jest.spyOn(uploader, 'validateFiles');
				uploadFilesSpy = jest.spyOn(uploader, 'uploadFiles');
			});

			it('should show the file name a progress bar when the file is uploading', async () => {
				uploader.uploadFiles.mockReturnValue(NEVER.pipe(startWith({
					progress: 0.5,
				})));
				const { container, queryByRole, queryByText } = renderFileUploadZone({
					uploader,
				});

				await waitFor(() => {
					fireFileUpload(container, file);
					const progressBar = queryByRole('progressbar');
					const fileNode = queryByText('example.png');
					expect(fileNode).toBeDefined();
					expect(progressBar).toBeDefined();
					expect(progressBar.style.width).toBe('50%');
				});
			});

			it('should call the `uploadedFiles`callback when the file has been successfully uploaded', async () => {
				uploader.uploadFiles.mockReturnValue(of({
					progress: 1,
					status: 200,
					data: uploadResponse,
				}));
				const handleUploadedFiles = jest.fn();
				const { container } = renderFileUploadZone({
					uploader,
					uploadedFiles: handleUploadedFiles,
				});

				await waitFor(() => {
					fireFileUpload(container, file);
					expect(validateFilesSpy).toHaveBeenCalledWith([file]);
					expect(uploadFilesSpy).toHaveBeenCalledWith(validFiles);
					expect(handleUploadedFiles).toHaveBeenCalledWith(uploadResponse);
				});
			});
		});
	});

	describe('upload a file on drop', () => {
		it('should have the same behavior then when a user has clicked on the file input', () => {
			uploader.validateFiles.mockReturnValue({
				invalidFiles: [],
				validFiles: [],
			});
			const validateFilesSpy = jest.spyOn(uploader, 'validateFiles');
			const { container } = renderFileUploadZone({
				uploader,
			});
			fireFileUploadOnDrop(container, file);
			expect(validateFilesSpy).toHaveBeenCalledWith([file]);
		});
	});

	describe('custom handlers', () => {
		it('Should not upload when autoUpload is false', async () => {
			uploader.validateFiles.mockReturnValue({
				invalidFiles: [],
			});
			const uploadFilesSpy = jest.spyOn(uploader, 'uploadFiles');
			const { container } = renderFileUploadZone({
				uploader,
				autoUpload: false,
			});

			await waitFor(() => {
				fireFileUpload(container, file);
				expect(uploadFilesSpy).not.toHaveBeenCalled();
			});
		});

		it('should call custom click handler when given', async () => {
			const validateFilesSpy = jest.spyOn(uploader, 'validateFiles');
			const onCustomClick = jest.fn();
			const { container } = renderFileUploadZone({
				uploader,
				onCustomClick,
			});
			const inputEl = container.querySelector('.m-upload__input');

			await waitFor(() => {
				fireEvent.click(inputEl);
				expect(onCustomClick).toHaveBeenCalledTimes(1);
				expect(validateFilesSpy).not.toHaveBeenCalled();
			});
		});

		it('should call custom drop handler when given', async () => {
			uploader.validateFiles.mockReturnValue({
				invalidFiles: [],
				validFiles: [file],
			});
			uploader.uploadFiles.mockReturnValue(of({
				data: uploadResponse,
			}));
			const onCustomDrop = jest.fn();
			const { container } = renderFileUploadZone({
				uploader,
				onCustomDrop,
			});

			await waitFor(() => {
				fireFileUploadOnDrop(container, file);
				expect(onCustomDrop).toHaveBeenCalledTimes(1);
				expect(onCustomDrop).toHaveBeenCalledWith([file]);
			});
		});
	});

	describe('slots', () => {
		it('should show an upload message', () => {
			const { findByTestId } = renderFileUploadZone({
				uploader,
			}, FileUploadMessageComponent);
			const message = findByTestId('message');

			expect(message).toBeDefined();
		});

		it('should show a description text', () => {
			const { findByTestId } = renderFileUploadZone({
				uploader,
			}, null, FileUploadDescriptionComponent);
			const description = findByTestId('description');

			expect(description).toBeDefined();
		});
	});
});
