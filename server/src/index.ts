import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { loggingMiddleware } from './middleware';

import express from 'express';
import cors from 'cors';
import { bot } from './bot';
import { router } from './router';

const app = express();
const port = process.env.SERVER_PORT as unknown as number;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(loggingMiddleware);
app.use(router);
// Deployment code.
// app.use('/api', router);


app.listen(port, '127.0.0.1', function () {
	console.log(`Server running on port ${port}.`)
});

bot.launch();