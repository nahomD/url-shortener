import { rest } from 'msw';

export const handlers = [
  rest.get('/api', (_req, res, ctx) => {
    return res(
      ctx.json({
        greeting: 'Hello World',
      })
    );
  }),
  rest.post('/api/urls', (_req, res, ctx) => {
    return res(
      ctx.json({
        longUrl: 'https://google.com',
        shortUrl: 'https://sh.rt/go',
      })
    );
  }),
];
