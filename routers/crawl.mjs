import express from 'express';
import crawlKeyStocksToToday from '../services/crawl.mjs';

var router = express.Router();

router.get('/', async (req, res) => {
    await crawlKeyStocksToToday();
});

export default router;