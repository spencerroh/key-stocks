import express from 'express';
import bodyParser from 'body-parser';
import argsParser from 'args-parser';
import cors from 'cors';
import path from 'path';
import todayRouter from './routers/today.mjs';
import staticsRouter from './routers/statics.mjs';
import queryRouter from './routers/query.mjs';

import crawlKeyStocksToToday from './services/crawl.mjs';
import logger from './services/logger.mjs';

//-------------------------------------------------------------------//

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended : true }));

app.use('/today', todayRouter);
app.use('/statics', staticsRouter);
app.use('/query', queryRouter);
app.use(express.static(
    '../frontend/build'
));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '../frontend/build/index.html');
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


