import path from 'path';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { fetchGreeting } from '@/utilities/httpClient';

const { string } = MatchersV3;

const provider = new PactV3({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'urlShortener-client',
  provider: 'urlShortener-server',
});

describe('Get api/', () => {
  test('returns HTTP 200 with a greeting', () => {
    const greeting = 'hello world';
    const path = '/api';
    provider
      .uponReceiving('a request for a greeting')
      .withRequest({
        method: 'GET',
        path,
        headers: { Accept: '*/*' },
      })
      .willRespondWith({
        status: 200,
        contentType: 'application/json',
        body: { greeting: string(greeting) },
      });

    return provider.executeTest(async (mockServer) => {
      process.env.NEXT_PUBLIC_API_BASE_URL = mockServer.url;
      const greeting = await fetchGreeting(path);
      expect(greeting).toBe(greeting);
    });
  });
});
