import { render, screen, waitFor } from '../testUtils';
import userEvent from '@testing-library/user-event';
import Index from 'pages';

const mockShortenUrl = jest.fn();
jest.mock('@/utilities/httpClient', () => {
  return {
    shortenUrl: (longUrl: string) => mockShortenUrl(longUrl),
  };
});

const shortenButtonText = /^shorten/i;
const validUrl = 'https://google.com/test/path/1';
const invalidUrl = 'invalid url';
const response = { longUrl: validUrl, shortUrl: 'https://sh.rt/go' };

function setRequestResponse() {
  mockShortenUrl.mockResolvedValue(response);
}

function setResponseWithDelay() {
  mockShortenUrl.mockImplementation(() => {
    return new Promise((resolve) => setTimeout(() => resolve(response), 250));
  });
}

function renderSUT() {
  render(<Index />);
}

function getList(): HTMLElement | null {
  return queryElementByRole('list');
}

function queryElementByRole(role: string) {
  return screen.queryByRole(role);
}

function queryShortenButtonByText(): HTMLElement | null {
  return queryElementByText(shortenButtonText);
}

function queryElementByText(text: string | RegExp): HTMLElement | null {
  return screen.queryByText(text);
}

async function typeValidUrlAndClickShorten() {
  await typeUrlAndClickShorten(validUrl);
}

async function typeInvalidUrlAndClickShorten() {
  await typeUrlAndClickShorten(invalidUrl);
}

async function typeUrlAndClickShorten(url: string) {
  await typeUrlIntoInput(url);
  await clickShortenButton();
}

async function clickShortenButton() {
  await userEvent.click(screen.getByText(shortenButtonText));
}

async function typeUrlIntoInput(validUrl: string) {
  await userEvent.type(getUrlInput(), validUrl);
}

async function clearUrlInput() {
  await userEvent.clear(getUrlInput());
}

function getUrlInput(): HTMLElement {
  return screen.getByRole('textbox');
}

async function clickCopyButton() {
  userEvent.setup();
  await userEvent.click(screen.getByText(/^copy/i));
}

function removeProtocol(url: string) {
  return url.slice(8);
}

function assertHeadingWithText(text: string) {
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

function assertAListItemIsInsideAList() {
  const listItems = screen.queryAllByRole('listitem');
  expect(listItems.length).toBe(1);
  const fLItem = listItems[0];
  expect(fLItem).toBeVisible();
  expect(getList()).toContainElement(fLItem);
}

function assertListItemContainsUrlWithoutProtocol(url: string) {
  const listItem = queryElementByRole('listitem');
  const urlWithNoProtocol = removeProtocol(url);
  expect(listItem).toHaveTextContent(urlWithNoProtocol);
  expect(listItem).not.toHaveTextContent(url);
}

function assertCopyButtonIsInsideAListItem() {
  const copyButton = queryElementByText(/^copy/i);
  expect(queryElementByRole('listitem')).toContainElement(copyButton);
  expect(copyButton).toBeVisible();
}

function assertInvalidLinkTextIsNotDisplayed() {
  expect(queryElementByText('Invalid Link')).not.toBeInTheDocument();
}

async function assertClipBoardContainsShortUrl() {
  const clipText = await navigator.clipboard.readText();
  expect(clipText).toBe(response.shortUrl);
}

async function assertWhileLoadingAndAfterLoading(
  assertWhileLoading: () => void,
  assertAfterLoading: () => void
) {
  const url = removeProtocol(response.shortUrl);
  await waitFor(() => {
    expect(queryElementByText(url)).not.toBeInTheDocument();
    assertWhileLoading();
  });
  await waitFor(() => {
    expect(queryElementByText(url)).toBeInTheDocument();
    assertAfterLoading();
  });
}

describe('Index', () => {
  test('heading is displayed', () => {
    renderSUT();

    assertHeadingWithText('Create Short Links');
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

    expect(queryElementByRole('button')).toHaveTextContent(shortenButtonText);
  });

  test('valid url triggers a request', async () => {
    renderSUT();

    await typeValidUrlAndClickShorten();

    assertShortenUrlRequestTimes(1);
    expect(mockShortenUrl).toBeCalledWith(validUrl);
  });

  test('empty url does not trigger a request', async () => {
    renderSUT();

    await clickShortenButton();

    assertShortenUrlRequestWasNotSent();
  });

  test('"Link is required" text appears if the requested url is empty', async () => {
    renderSUT();

    await clickShortenButton();

    await waitFor(() => {
      expect(queryElementByText('Link is required')).toBeVisible();
    });
  });

  test('"Invalid Link" text appears if url is invalid', async () => {
    renderSUT();

    await typeInvalidUrlAndClickShorten();

    expect(queryElementByText('Invalid Link')).toBeVisible();
  });

  test('"Invalid Link" text is not found at the beginning', () => {
    renderSUT();

    assertInvalidLinkTextIsNotDisplayed();
  });

  test('already existing "Invalid Link" text is removed if url is valid', async () => {
    setRequestResponse();
    renderSUT();

    await typeInvalidUrlAndClickShorten();
    await clearUrlInput();
    await typeValidUrlAndClickShorten();

    assertInvalidLinkTextIsNotDisplayed();
  });

  test('invalid url does not trigger a request', async () => {
    renderSUT();

    await typeInvalidUrlAndClickShorten();

    assertShortenUrlRequestWasNotSent();
  });

  test('URL input starts focused', () => {
    renderSUT();

    expect(getUrlInput()).toHaveFocus();
  });

  test('displays a list after a successful request', async () => {
    setRequestResponse();
    renderSUT();

    await typeValidUrlAndClickShorten();

    expect(getList()).toBeVisible();
  });

  test('no list exists before a successful request', () => {
    renderSUT();

    expect(getList()).not.toBeInTheDocument();
  });

  test('url input is cleared after a successful request', async () => {
    setRequestResponse();
    renderSUT();

    await typeValidUrlAndClickShorten();

    expect(getUrlInput()).toHaveValue('');
  });

  test('displays a single listitem inside a list after a successful request', async () => {
    setRequestResponse();
    renderSUT();

    await typeValidUrlAndClickShorten();

    assertAListItemIsInsideAList();
  });

  test('displays long url after a successful request', async () => {
    setRequestResponse();
    renderSUT();

    await typeValidUrlAndClickShorten();

    assertListItemContainsUrlWithoutProtocol(response.longUrl);
  });

  test('displays shortened url after a successful request', async () => {
    setRequestResponse();
    renderSUT();

    await typeValidUrlAndClickShorten();

    assertListItemContainsUrlWithoutProtocol(response.shortUrl);
  });

  test('displays a copy button in a listitem after a successful request', async () => {
    setRequestResponse();
    renderSUT();

    await typeValidUrlAndClickShorten();

    assertCopyButtonIsInsideAListItem();
  });

  test('clicking the copy button copies short url', async () => {
    setRequestResponse();
    renderSUT();
    await typeValidUrlAndClickShorten();

    await clickCopyButton();

    await assertClipBoardContainsShortUrl();
  });

  test('shorten button is disabled while loading and enabled after loading response', async () => {
    setResponseWithDelay();
    renderSUT();

    await typeValidUrlAndClickShorten();

    await assertWhileLoadingAndAfterLoading(
      assertButtonIsDisabled,
      assertButtonIsEnabled
    );
    function assertButtonIsDisabled() {
      expect(screen.queryByTestId('shorten-button')).toBeDisabled();
    }
    function assertButtonIsEnabled() {
      expect(queryShortenButtonByText()).toBeEnabled();
    }
  }, 10000);

  test('shorten button text is removed while loading response and restored after loading response', async () => {
    setResponseWithDelay();
    renderSUT();

    await typeValidUrlAndClickShorten();

    await assertWhileLoadingAndAfterLoading(
      assertTextIsRemoved,
      assertTextIsVisible
    );
    function assertTextIsRemoved() {
      expect(queryShortenButtonByText()).not.toBeInTheDocument();
    }

    function assertTextIsVisible() {
      expect(queryShortenButtonByText()).toBeVisible();
    }
  }, 10000);

  afterEach(() => {
    jest.clearAllMocks();
  });
});
