import app from './app';

if (!process.env.HOST) throw new Error('HOST environment variable is required');

const host = process.env.HOST;
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
