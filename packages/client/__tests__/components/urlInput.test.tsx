import { render } from '../wrapper';

import { UrlInput } from '../../components/urlInput';
import {
  getUrlInput,
  queryElementByRole,
  queryElementByText,
} from '__tests__/utilityFunctions';

const shortenButtonText = /^shorten/i;

function renderSUT(isLoading = false) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const emptyFunction = () => {};
  render(
    <UrlInput
      isLoading={isLoading}
      onLinkChange={emptyFunction}
      onSubmit={emptyFunction}
      error=""
      link=""
    />
  );
}

function queryShortenButtonByText(): HTMLElement | null {
  return queryElementByText(shortenButtonText);
}

describe('Url Input', () => {
  test('url input is empty by default', () => {
    renderSUT();

    expect(getUrlInput()).not.toHaveValue();
  });

  test('url input has proper placeholder text', () => {
    renderSUT();

    expect(getUrlInput()).toHaveAttribute('placeholder', 'Enter link');
  });

  test('shorten button has proper text', () => {
    renderSUT();

    expect(queryElementByRole('button')).toHaveTextContent(shortenButtonText);
  });

  test('url input starts focused', () => {
    renderSUT();

    expect(getUrlInput()).toHaveFocus();
  });

  test('shorten button state while loading', () => {
    renderSUT(true);

    expect(queryElementByRole('button')).toBeDisabled();
    expect(queryShortenButtonByText()).not.toBeInTheDocument();
  });

  test('shorten button state when not loading', () => {
    renderSUT(false);

    expect(queryShortenButtonByText()).toBeEnabled();
    expect(queryShortenButtonByText()).toBeVisible();
  });
});
