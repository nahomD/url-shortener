import express from 'express';
import UrlsRouter from './urls';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', UrlsRouter);
app.get('/api', (req, res) => {
  res.send({ greeting: 'Hello API' });
});

export default app;
