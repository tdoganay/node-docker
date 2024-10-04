import express from 'express';
const app = express();

import { createClient } from 'redis';
const redisClient = createClient({
    legacyMode: true,
    socket: {
        host: 'redis',
        port: 6379
    }
});
await redisClient.connect();

app.get('/', async function(req, res) {
    await redisClient.get('numVisits', function(err, numVisits) {
        let numVisitsToDisplay = parseInt(numVisits) + 1;
        if (isNaN(numVisitsToDisplay)) {
            numVisitsToDisplay = 1;
        }
        res.send('Number of visits is: ' + numVisitsToDisplay);
        numVisits++;
        redisClient.set('numVisits', numVisits);
    });
});

app.listen(5000, function() {
    console.log('Web application is listening on port 5000');
});