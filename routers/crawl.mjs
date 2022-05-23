import express from 'express';
import crawlKeyStocksToToday from '../services/crawl.mjs';

var router = express.Router();

router.get('/', async (req, res) => {
    crawlKeyStocksToToday();
});

export default router;