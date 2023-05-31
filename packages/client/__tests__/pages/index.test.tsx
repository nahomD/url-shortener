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

function getUrlInput(): HTMLElement {
  return getElementByRole('textbox');
}

function getElementByRole(role: string) {
  return screen.getByRole(role);
}

async function clickShortenButton() {
  await userEvent.click(screen.getByText(shortenButtonText));
}

async function typeUrlIntoInput(validUrl: string) {
  await userEvent.type(getUrlInput(), validUrl);
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

    expect(getElementByRole('heading')).toHaveTextContent('Create Short Links');
  });

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

    expect(getElementByRole('button')).toHaveTextContent(shortenButtonText);
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

  afterEach(() => {
    jest.clearAllMocks();
  });
});
