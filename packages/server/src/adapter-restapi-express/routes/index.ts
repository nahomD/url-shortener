import express from 'express';
import { ShortenUrls } from './urls/shortenUrls';
import { RedirectUrls } from './urls/redirectUrls';

const router = express.Router();

const gLUHandlers = RedirectUrls.getHandlers();
router.get('/', gLUHandlers);
router.get('/:id', gLUHandlers);
router.post('/api/urls', ShortenUrls.getHandlers());

export default router;
