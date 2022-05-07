import express from 'express';
import db from '../models/index.js';

var router = express.Router();

router.get('/', async (req, res) => {
    var results = await db.KeyStock.lastUpdatedStocks(true);

    res.json(results);
});

export default router;