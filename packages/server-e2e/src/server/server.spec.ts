import axios from 'axios';

describe('GET /', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ greeting: 'Hello API' });
  });
});

function assertHttps(url: string) {
  const u = new URL(url);
  expect(u.protocol).toBe('https:');
}

describe('POST /api/urls', () => {
  it('should return 201 created for a newly shortened url', async () => {
    const longUrl = 'https://google.com';

    const res = await axios.post('/api/urls', { url: longUrl });

    expect(res.status).toBe(201);
    expect(res.data.longUrl).toBe(longUrl);
    expect(res.data.longUrl).not.toEqual(res.data.shortUrl);
    assertHttps(res.data.shortUrl);
  });
});
