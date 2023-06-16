import express from 'express';
import { ShortenUrls } from './urls/shortenUrls';
import { RedirectUrls } from './urls/redirectUrls';
import { ErrorHandler } from './errorHandler';

const router = express.Router();

const rUHandlers = RedirectUrls.getHandlers();
router.get('/', rUHandlers);
router.get('/:id', rUHandlers);
router.post('/api/urls', ShortenUrls.getHandlers());

router.use(ErrorHandler.getHandlers());

export default router;
