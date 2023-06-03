import { rest } from 'msw';

export const handlers = [
  rest.get('/api', (_req, res, ctx) => {
    return res(
      ctx.json({
        greeting: 'Hello World',
      })
    );
  }),
  rest.post('/api/urls', async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.json({
        longUrl: body.url,
        shortUrl: 'https://sh.rt/go',
      })
    );
  }),
];
