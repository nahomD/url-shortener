import express from 'express';
import { ShortenUrls } from './urls/shortenUrls';

const router = express.Router();

router.post('/api/urls', ShortenUrls.getHandlers());

export default router;
