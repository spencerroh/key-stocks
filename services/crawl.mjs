import axios from 'axios';
import iconv from 'iconv-lite';
import cheerio from 'cheerio';

import Database from '../models/index.js';
import Day from '../utils/day.mjs';
import logger from './logger.mjs';

async function crawlKeyStocks(date)
{
    logger.info('Crawlling Key Stocks of ' + date.toString());

    const dateAsText = date.toString();
    const url ='https://m.infostock.co.kr/dataBank/spot06.asp?mode=w&SearchField=%B3%AF%C2%A5&searchword=' + dateAsText;
    const response = await axios.get(url, {
        responseType: 'arraybuffer'
    });
    const data = await response.data;
    const html = iconv.decode(data, 'EUC-KR');
       
    let $ = await cheerio.load(html);
    
    var rows = $('div.table table tbody tr');
    
    var result = [];
    for (var i = 0; i < rows.length; i++)
    {
        result.push({
            name: $('a', rows[i]).text().split('(')[0].trim(),
            code: $('a', rows[i]).text().match(/\(([0-9]+)\)/)[1],
            reason: $('td.alL', rows[i]).text().trim(),
            date: dateAsText
        });
    }

    return result;
}

export default async function crawlKeyStocksToToday()
{
    var lastUpdatedDate = await Database.KeyStock.lastUpdatedDate();
    var begin = Day.tomorrow(lastUpdatedDate ?? '2017-01-01');
    var until = Day.today().tomorrow();

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