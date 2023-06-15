import { Verifier } from '@pact-foundation/pact';
import app from '../src/adapter-restapi-express/app';
import path from 'path';

const port = 8081;
const baseUrl = `http://localhost:${port}`;

const server = app.listen(port, () => {
  console.log(`Service listening on ${baseUrl}`);
});

describe('Pact verification', () => {
  test('validate the expectations of the matching consumer', () => {
    return new Verifier({
      providerBaseUrl: baseUrl,
      pactUrls: [
        path.resolve(
          process.cwd(),
          './pacts/urlShortener-client-urlShortener-server.json'
        ),
      ],
    })
      .verifyProvider()
      .then(() => {
        console.log('Pact Verification Complete!');
      });
  }, 10000);

  afterAll(() => {
    server.close();
  });
});
