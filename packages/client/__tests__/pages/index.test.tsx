import { render, screen } from '../testUtils';
import userEvent from '@testing-library/user-event';
import Index from 'pages';

const mockShortenUrl = jest.fn();
jest.mock('@/utilities/httpClient', () => {
  return {
    shortenUrl: (longUrl: string) => mockShortenUrl(longUrl),
  };
});

function setRequestResponse(resolved: object) {
  mockShortenUrl.mockResolvedValue(resolved);
}

function renderSUT() {
  render(<Index />);
}

function getUrlInput(): HTMLElement | null {
  return queryElementByRole('textbox');
}

function getList(): HTMLElement | null {
  return queryElementByRole('list');
}

function queryElementByRole(role: string) {
  return screen.queryByRole(role);
}

async function typeValidUrlAndClickShorten() {
  await typeUrlAndClickShorten(validUrl);
}

async function typeUrlAndClickShorten(url: string) {
  await typeUrlIntoInput(url);
  await clickShortenButton();
}

async function clickShortenButton() {
  await userEvent.click(screen.getByText(shortenButtonText));
}

async function typeUrlIntoInput(validUrl: string) {
  await userEvent.type(screen.getByRole('textbox'), validUrl);
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
  const urlWithNoProtocol = url.slice(8);
  expect(listItem).toHaveTextContent(urlWithNoProtocol);
  expect(listItem).not.toHaveTextContent(url);
}

function assertCopyButtonIsInsideAListItem() {
  const copyButton = screen.queryByText(/^copy/i);
  expect(queryElementByRole('listitem')).toContainElement(copyButton);
  expect(copyButton).toBeVisible();
}

const shortenButtonText = /^shorten/i;
const validUrl = 'https://google.com/test/path/1';
const response = { longUrl: validUrl, shortUrl: 'https://sh.rt/go' };

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

  test('invalid url does not trigger a request', async () => {
    renderSUT();

    await typeUrlAndClickShorten('invalid url');

    assertShortenUrlRequestWasNotSent();
  });

  test('URL input starts focused', () => {
    renderSUT();

    expect(getUrlInput()).toHaveFocus();
  });

  test('displays a list after a successful request', async () => {
    setRequestResponse(response);
    renderSUT();

    await typeValidUrlAndClickShorten();

    expect(getList()).toBeVisible();
  });

  test('no list exists before a successful request', () => {
    renderSUT();

    expect(getList()).not.toBeInTheDocument();
  });

  test('url input is cleared after a successful request', async () => {
    setRequestResponse(response);
    renderSUT();

    await typeValidUrlAndClickShorten();

    expect(getUrlInput()).toHaveValue('');
  });

  test('displays a single listitem inside a list after a successful request', async () => {
    setRequestResponse(response);
    renderSUT();

    await typeValidUrlAndClickShorten();

    assertAListItemIsInsideAList();
  });

  test('displays long url after a successful request', async () => {
    setRequestResponse(response);
    renderSUT();

    await typeValidUrlAndClickShorten();

    assertListItemContainsUrlWithoutProtocol(response.longUrl);
  });

  test('displays shortened url after a successful request', async () => {
    setRequestResponse(response);
    renderSUT();

    await typeValidUrlAndClickShorten();

    assertListItemContainsUrlWithoutProtocol(response.shortUrl);
  });

  test('displays a copy button in a listitem after a successful request', async () => {
    setRequestResponse(response);
    renderSUT();

    await typeValidUrlAndClickShorten();

    assertCopyButtonIsInsideAListItem();
  });

  test('clicking the copy button copies short url', async () => {
    setRequestResponse(response);
    renderSUT();
    await typeValidUrlAndClickShorten();
    userEvent.setup();

    await userEvent.click(screen.getByText(/^copy/i));

    const clipText = await navigator.clipboard.readText();
    expect(clipText).toBe(response.shortUrl);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
