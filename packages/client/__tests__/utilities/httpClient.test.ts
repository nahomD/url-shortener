import path from 'path';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { fetch, shortenUrl } from '@/utilities/httpClient';

const { string } = MatchersV3;

const provider = new PactV3({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'urlShortener-client',
  provider: 'urlShortener-server',
});

test('Get api/ returns HTTP 200 with a greeting', () => {
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
    const greeting = await fetch(path);
    expect(greeting).toBe(greeting);
  });
});

test('POST /api/urls returns 201 with a shortened url', () => {
  const path = '/api/urls';
  const longUrl = 'https://google.com';
  const shortUrl = 'https://sh.t/go';

  provider
    .uponReceiving('a request to shorten a url')
    .withRequest({
      method: 'POST',
      path,
      headers: { Accept: 'application/json' },
      body: { url: string(longUrl) },
    })
    .willRespondWith({
      status: 201,
      contentType: 'application/json',
      body: {
        longUrl: string(longUrl),
        shortUrl: string(shortUrl),
      },
    });

  return provider.executeTest(async (mockServer) => {
    process.env.NEXT_PUBLIC_API_BASE_URL = mockServer.url;

    const result = await shortenUrl(path, longUrl);

    expect(result).toStrictEqual({
      longUrl,
      shortUrl,
    });
  });
});
