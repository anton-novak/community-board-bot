import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import cors from 'cors';
import { bot } from './bot';
import { router } from './router';

const app = express();
const port = process.env.SERVER_PORT;

// app.use(express.static(clientFolder)); // to use middleware you MUST initialize it with app.use()
// this method is a shorthand for serving static files from a folder - you can do it in the usual way via router, etc.

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(router);

app.listen(port, function () {
	console.log(`Server running on port ${port}.`)
});

bot.launch();