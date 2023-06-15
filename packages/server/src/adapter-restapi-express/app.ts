import express from 'express';
import cors from 'cors';
import Routes from './routes';

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: process.env.CLIENT_DOMAIN,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.send({ greeting: 'Hello API' });
});
app.use(Routes);

export default app;
