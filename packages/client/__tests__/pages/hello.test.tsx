import { render, screen } from '@testing-library/react';
import Hello from 'pages/hello';

const mockFetch = jest.fn();
jest.mock('@/utilities/httpClient', () => {
  return {
    fetch: (path: string) => mockFetch(path),
  };
});

function renderSUT() {
  render(<Hello />);
}

async function findElementByRole(role: string) {
  await screen.findByRole(role);
}

function assertElementHasText(role: string, text: string) {
  expect(screen.getByRole(role)).toHaveTextContent(text);
}

describe('Hello', () => {
  test('displays greeting', async () => {
    const greeting = 'Greetings World';
    mockFetch.mockReturnValue(Promise.resolve(greeting));
    renderSUT();

    const role = 'heading';
    await findElementByRole(role);

    assertElementHasText(role, greeting);
    expect(mockFetch).toBeCalledWith('/api');
  });

  test('displays error if fetch fails', async () => {
    mockFetch.mockImplementation(() => {
      throw new Error();
    });
    renderSUT();

    const role = 'error';
    await findElementByRole(role);

    assertElementHasText(role, 'Something went wrong');
  });
});
