const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const bot = require('./bot');
const port = process.env.SERVER_PORT;
const app = express(); // an instance of express
const router = require('./router');

const path = require('path'); // node modules to work with path - especially useful on windows
// const clientFolder = path.join(_dirname, '../client'); // for better path manipulation

// app.use(express.static(clientFolder)); // to use middleware you MUST initialize it with app.use()
// this method is a shorthand for serving static files from a folder - you can do it in the usual way via router, etc.

app.use(cors({ origin: true, credentials: true }));
app.use(express.json()); // for message parsing
app.use(router);

app.listen(port, function () {
	console.log(`Server running on port ${port}.`)
});