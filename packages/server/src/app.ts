import express from 'express';

const app = express();

app.get('/api', (req, res) => {
  res.send({ greeting: 'Hello API' });
});

export default app;
