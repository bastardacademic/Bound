/**
 * @jest-environment jsdom
 */
import { render, fireEvent } from '@testing-library/svelte';
import PostForm from '../src/lib/components/PostForm.svelte';

test('validates and does not submit on error', async () => {
  const mockValidate = jest.fn().mockReturnValue({ text: 'Required' });
  const mockSuccess = jest.fn();
  const { getByText } = render(PostForm, {
    endpoint: '/api/test',
    initialData: { text: '', foo: '' },
    validate: mockValidate,
    onSuccess: mockSuccess
  });
  await fireEvent.click(getByText('Post'));
  expect(mockValidate).toHaveBeenCalled();
  expect(mockSuccess).not.toHaveBeenCalled();
});
