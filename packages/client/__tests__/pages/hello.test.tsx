import { render, screen } from '@testing-library/react';
import Home from 'pages/hello';

const mockFetch = jest.fn();
jest.mock('@/utilities/httpClient', () => {
  return {
    fetch: (path: string) => mockFetch(path),
  };
});

function renderIndex() {
  render(<Home />);
}

async function findElementByRole(role: string) {
  await screen.findByRole(role);
}

function assertElementHasText(role: string, text: string) {
  expect(screen.getByRole(role)).toHaveTextContent(text);
}

describe('Index', () => {
  test('displays greeting', async () => {
    const greeting = 'Greetings World';
    mockFetch.mockReturnValue(Promise.resolve(greeting));
    renderIndex();

    const role = 'heading';
    await findElementByRole(role);

    assertElementHasText(role, greeting);
    expect(mockFetch).toBeCalledWith('/api');
  });

  test('displays error if fetch fails', async () => {
    mockFetch.mockImplementation(() => {
      throw new Error();
    });
    renderIndex();

    const role = 'error';
    await findElementByRole(role);

    assertElementHasText(role, 'Something went wrong');
  });
});
