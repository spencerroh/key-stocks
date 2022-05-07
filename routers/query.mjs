import dayjs from 'dayjs';
import express from 'express';
import db from '../models/index.js';
import Date from '../utils/day.mjs'
import { QueryTypes } from 'sequelize';

var router = express.Router();

router.post('/keywords', async (req, res) => {
    const keywords = req.body.keywords || [];
    const offset = req.body.offset || 0;
    const limit = req.body.limit || 20;

    if (keywords.length == 0) {
        res.sendStatus(404);
        return;
    }

    console.log(keywords);

    var results = await db.KeyStock.findRelatedStocks(keywords, offset, limit, true);

    res.json(results);
});

router.post('/rank', async (req, res) => {
    var endDate = req.body.endDate || Date.today().toString();
    var beginDate = req.body.beginDate || Date.today().delta(-1, 'week').toString();
    var limits = req.body.limits || 10;
    
    var results = await db.sequelize.query(
        `SELECT *, COUNT(*) AS count \
         FROM KeyStocks \
         WHERE ('${beginDate}' <= date) AND (date <= '${endDate}')
         GROUP BY name \
         ORDER BY count DESC, date ASC\
         LIMIT ${limits}`, {
            type: QueryTypes.SELECT
         });

    res.json(results);
});

export default router;