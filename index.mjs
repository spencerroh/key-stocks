import express from 'express';
import bodyParser from 'body-parser';
import argsParser from 'args-parser';
import cors from 'cors';
import path from 'path';
import todayRouter from './routers/today.mjs';
import staticsRouter from './routers/statics.mjs';
import queryRouter from './routers/query.mjs';
import crawlRouter from './routers/crawl.mjs';
import configuration from './config/index.mjs';

import crawlKeyStocksToToday from './services/crawl.mjs';
import logger from './services/logger.mjs';

//-------------------------------------------------------------------//

const app = express();

console.log(configuration);

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended : true }));

app.use('/api/key-stocks/v1/today', todayRouter);
app.use('/api/key-stocks/v1/statics', staticsRouter);
app.use('/api/key-stocks/v1/query', queryRouter);
app.use('/api/key-stocks/v1/crawl', crawlRouter);

app.use(express.static(
    configuration.frontend
));

app.get('/*', (req, res) => {
    res.sendFile(configuration.index);
});

const args = argsParser(process.argv);
const port = args.port || 2000;

app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);

    logger.info(`Schedulling crawlling service.`);

    /*
    * * * * * *
    ┬ ┬ ┬ ┬ ┬ ┬
    │ │ │ │ │ │
    │ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
    │ │ │ │ └───── month (1 - 12)
    │ │ │ └────────── day of month (1 - 31)
    │ │ └─────────────── hour (0 - 23)
    │ └──────────────────── minute (0 - 59)
    └───────────────────────── second (0 - 59, OPTIONAL)
    */
    schedule.scheduleJob('0 0 18 * * 1-5', function(){
        crawlKeyStocksToToday();
    });
});







import schedule from 'node-schedule';


