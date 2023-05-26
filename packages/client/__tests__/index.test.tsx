import { render, screen } from '@testing-library/react';
import Index from 'pages';

const mockFetchGreeting = jest.fn();
jest.mock('@/utilities/httpClient', () => {
  return {
    fetchGreeting: (path: string) => mockFetchGreeting(path),
  };
});

function renderIndex() {
  render(<Index />);
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
    mockFetchGreeting.mockReturnValue(Promise.resolve(greeting));
    renderIndex();

    const role = 'heading';
    await findElementByRole(role);

    assertElementHasText(role, greeting);
    expect(mockFetchGreeting).toBeCalledWith('/api');
  });

  test('displays error if fetch fails', async () => {
    mockFetchGreeting.mockImplementation(() => {
      throw new Error();
    });
    renderIndex();

    const role = 'error';
    await findElementByRole(role);

    assertElementHasText(role, 'Something went wrong');
  });
});
