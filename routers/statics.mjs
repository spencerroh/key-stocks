import express from 'express';
import db from '../models/index.js';

var router = express.Router();

router.get('/last', async (req, res) => {
    var date = await db.KeyStock.lastUpdatedDate();

    res.json({
        lastUpdatedDate: date
    });
});

export default router;