import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import cors from 'cors';
import { bot } from './bot';
import { router } from './router';

const app = express();
const port = process.env.SERVER_PORT;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(router);
// Deployment code.
// app.use('/api', router);

app.listen(parseInt(port || '3456'), '127.0.0.1', function () {
	console.log(`Server running on port ${port || 3456}.`)
});

bot.launch();