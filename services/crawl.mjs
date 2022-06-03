import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';
import { constants } from 'crypto'

import Database from '../models/index.js';
import Day from '../utils/day.mjs';
import logger from './logger.mjs';

async function crawlKeyStocks(date)
{
    logger.info('Crawlling Key Stocks of ' + date.toString());
    
    const dateAsText = date.toString();
    var queryDay = date.nextBusinessDay();

    const httpsAgent = new https.Agent({
        secureOptions: constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION
      });

    const url = 'https://www.paxnet.co.kr/stock/infoStock/marketView?type=D&market=KSU&sendDate=' + queryDay.toString();
    const response = await axios.get(url, {
        httpsAgent: httpsAgent
    });
    const html = response.data;

    let $ = cheerio.load(html);

    let contents = $('div[class="report-view-cont"] div p');

    let child = contents.children()[0];
    let result = [];
    while (child != null) {

        if (child.type === 'text') {
            let stock = child.data.split(" : ");

            result.push({
                name: stock[0].split('(')[0].trim(),
                code: stock[0].match(/\(([0-9]+)\)/)[1],
                reason: stock[1],
                date: dateAsText
            })
        }
        child = child.next;
    }

    return result;
}

export default async function crawlKeyStocksToToday()
{
    var lastUpdatedDate = await Database.KeyStock.lastUpdatedDate();
    var begin = Day.tomorrow(lastUpdatedDate ?? '2017-01-01');
    var until = Day.today().nextBusinessDay();

    logger.info('Crawlling Key Stocks from' + begin.toString() + ' until ' + until.toString());

    await Day.forEachAsync(begin, until, async (day) => {
        var keyStocks = await crawlKeyStocks(day);

        for (var keyStock of keyStocks)
        {
            await Database.KeyStock.create({
                name: keyStock.name, 
                code: keyStock.code, 
                reason: keyStock.reason, 
                date: keyStock.date });
        }
    });
}