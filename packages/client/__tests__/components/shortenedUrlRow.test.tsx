import userEvent from '@testing-library/user-event';
import { ShortenedUrlRow } from '@/components/shortenedUrlRow';
import { act, render, screen } from '../wrapper';
import {
  queryElementByRole,
  queryElementByText,
} from '__tests__/utilityFunctions';

const copiedText = /^copied/i;
const copyText = /^copy/i;
const url = {
  longUrl: 'https://google.com',
  shortUrl: 'https://sh.rt/g',
};

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

function renderSUT() {
  render(<ShortenedUrlRow shortenedUrl={url} />);
}

async function clickCopyButton() {
  await userEvent.click(screen.getByText(copyText));
}

function assertCorrectLinkIsVisible() {
  const link = queryElementByRole('link');
  expect(link).toHaveAttribute('href', url.shortUrl);
  expect(link).toHaveAttribute('target', '_blank');
}

async function assertClickingCopyButtonChangesText() {
  expect(queryElementByText(copiedText)).toBeNull();
  await clickCopyButton();
  expect(queryElementByText(copiedText)).not.toBeNull();
}

async function assertCopiedChangesToCopyAfter5secs() {
  expect(queryElementByText(copiedText)).not.toBeNull();
  expect(queryElementByText(copyText)).toBeNull();
  await act(() => new Promise((resolve) => setTimeout(resolve, 5000)));
  expect(queryElementByText(copiedText)).toBeNull();
  expect(queryElementByText(copyText)).not.toBeNull();
}

test('clicking shortened url opens the url in a new tab', async () => {
  renderSUT();

  assertCorrectLinkIsVisible();
});

test('clicking copy button makes it change its text to "Copied"', async () => {
  renderSUT();

  await assertClickingCopyButtonChangesText();
});

test('"Copied" button changes to "Copy" after 5 secs', async () => {
  renderSUT();

  await clickCopyButton();

  await assertCopiedChangesToCopyAfter5secs();
}, 10000);
