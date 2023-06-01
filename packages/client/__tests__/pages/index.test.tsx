import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Index from 'pages';

const mockShortenUrl = jest.fn();
jest.mock('@/utilities/httpClient', () => {
  return {
    shortenUrl: (path: string, longUrl: string) =>
      mockShortenUrl(path, longUrl),
  };
});

function renderSUT() {
  render(<Index />);
}

function queryUrlInput(): HTMLElement | null {
  return queryElementByRole('textbox');
}

function queryElementByRole(role: string) {
  return screen.queryByRole(role);
}

async function clickShortenButton() {
  await userEvent.click(screen.getByText(shortenButtonText));
}

async function typeUrlIntoInput(validUrl: string) {
  await userEvent.type(screen.getByRole('textbox'), validUrl);
}

function assertHeadingIsVisibleWithText(text: string) {
  const heading = queryElementByRole('heading');
  expect(heading).toBeVisible();
  expect(heading).toHaveTextContent(text);
}

function assertShortenUrlRequestWasNotSent() {
  assertShortenUrlRequestTimes(0);
}

function assertShortenUrlRequestTimes(times: number) {
  expect(mockShortenUrl).toBeCalledTimes(times);
}

const shortenButtonText = /^shorten/i;

describe('Index', () => {
  test('heading is displayed', () => {
    renderSUT();

    assertHeadingIsVisibleWithText('Create Short Links');
  });

  test('url input is empty by default', () => {
    renderSUT();

    expect(queryUrlInput()).not.toHaveValue();
  });

  test('url input has proper placeholder text', () => {
    renderSUT();

    expect(queryUrlInput()).toHaveAttribute('placeholder', 'Enter link');
  });

  test('shorten button has proper text', () => {
    renderSUT();

    expect(queryElementByRole('button')).toHaveTextContent(shortenButtonText);
  });

  test('valid url triggers a request', async () => {
    const validUrl = 'https://google.com';
    renderSUT();

    await typeUrlIntoInput(validUrl);
    await clickShortenButton();

    assertShortenUrlRequestTimes(1);
    expect(mockShortenUrl).toBeCalledWith('/api/urls', validUrl);
  });

  test('empty url does not trigger a request', async () => {
    renderSUT();

    await clickShortenButton();

    assertShortenUrlRequestWasNotSent();
  });

  test('invalid url does not trigger a request', async () => {
    renderSUT();

    await typeUrlIntoInput('invalid url');
    await clickShortenButton();

    assertShortenUrlRequestWasNotSent();
  });

  test('URL input starts focused', () => {
    renderSUT();

    expect(queryUrlInput()).toHaveFocus();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
