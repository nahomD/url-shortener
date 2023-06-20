import { screen } from './wrapper';

export function queryElementByRole(role: string) {
  return screen.queryByRole(role);
}

export function queryElementByText(text: string | RegExp): HTMLElement | null {
  return screen.queryByText(text);
}

export function getUrlInput(): HTMLElement {
  return screen.getByRole('textbox');
}

export const copyText = /^copy/i;
