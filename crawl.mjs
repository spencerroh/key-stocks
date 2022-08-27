import axios from 'axios';
import iconv from 'iconv-lite';
import * as cheerio from 'cheerio';
import https from 'https';
import { constants } from 'crypto'

// import Database from '../models/index.js';
import Day from './utils/day.mjs';
import logger from './services/logger.mjs';

async function crawlKeyStocks(date)
{
    logger.info('Crawlling Key Stocks of ' + date.toString());
    
    const dateAsText = date.toString();
    var queryDay = date.nextBusinessDay();

    const httpsAgent = new https.Agent({
        secureOptions: constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION
      });

    const url = 'https://www.paxnet.co.kr/stock/infoStock/marketView?type=D&market=KSU&sendDate=' + queryDay.toStringWithoutDash();
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

            if (stock.length == 2)
            {
                let stockName = stock[0].split('(')[0].trim();
                let matches = stock[0].match(/\(([0-9]+)\)/);

                if (matches != null && matches.length >= 2)
                {
                    let stockCode = matches[1];
                    result.push({
                        name: stockName,
                        code: stockCode,
                        reason: stock[1],
                        date: dateAsText
                    });
                }
            }
        }
        child = child.next;
    }

    return result;
}

crawlKeyStocks(Day.create('20220603')).then(console.log).catch(e => {console.log(e) });
