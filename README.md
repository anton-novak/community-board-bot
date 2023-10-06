Community Board bot is a Telegram bot with a mini-app that provides a convenient way to post and view ads for a local community: residents of an apartment block, employees of an office or any other. WIP.

# Motivation
There are many C2C ad sites out there (like eBay), but sometimes they can be an overkill. Sometimes it is easier or desirable for people to react out to their local community when they want to give away or sell something or offer their services. There's a certain level of trust between members of a community as they are within reach. Inspection, delivery and payment are much more convenient to arrange which also makes the process faster for the seller. For that reason the poster is also more likely to give away or sell cheap items that would otherwise end up in a dump. Finally, posting ads locally simply allows people to connect with their neighbours or co-workers.

Often people community chats as ad boards, but there are a lot of disadvantages to that: the ads get lost in the stream of messages, there are limited ways to track them, and chat members can disapprove of flooding. Sometimes, there may be no chat at all, or some people do not wish to be part of them because of the toxicity. The Community Board bot solves these problems by providing a dedicated place for the ads while keeping it local.

# Features
* complete in-bot ad posting process with editing
* easy-to-use amd lightweight web app interface for browsing that allows to filter and sort the ads
* Telegram API-based image handling which keeps the service space requirements for the bot at the minimum
* Telegram API-based authentication & security - the mini-app is not accessible to the web users in general

# Challenges & roadmap

...

# Getting started

### Starting the bot and the mini-app in development mode

Prerequisites:
* Telegram bot token - pay a respectful visit to the [BotFather](https://t.me/BotFather)
* [Node.js](https://nodejs.org/en)
* [CouchDB](https://couchdb.apache.org/)
* TypeScript (`npm i -g typescript` in your OS terminal)

Clone this repo into your local directory, navigate to both `server` and `web-app` directories in your OS terminal and run `npm i` to install back-end and front-end dependencies. 

Create `.env` file in the `/server/src/` directory and populate it with environment variables:

```
TELEGRAM_BOT_TOKEN="<bot_token>"
WEB_APP_URL="https://127.0.0.1:3000"
SERVER_PORT=3456
COUCH_DB_LOGIN="<couch_db_login>"
COUCH_DB_PASSWORD="<couch_db_password>"
COUCH_DB_IP_PORT="127.0.0.1:9876"
COUCH_DB_PROTOCOL="http"
TELEGRAM_FILE_URL="https://api.telegram.org/file/bot"
```
Point your front-end services to the back end by editing the first line of `services` file in `/web-app/src` directory.

Then navigate to `/server/src` directory and start the server with `ts-node index.ts` command in your OS terminal. To start the front-end server run `($env:HTTPS = "true") -and (npm start)` from `/web-app` directory in Windows PowerShell or `HTTPS=true npm start`in a UNIX OS terminal (Create React App [docs page](https://create-react-app.dev/docs/using-https-in-development) on that).

Now you are good to go, just `/start` a conversation with the bot in Telegram. In development mode you will see a browser warning when opening the mini-app about not using a proper HTTPS certificate - just click through it.

# Project structure

## Back end

The back end is following the MVC model where there's a database layer at the back that talks to CouchDB (`db` and `model` files) and a RESTful API with controllers that reacts to specific requests and manupulates the model (`router` and `controllers` files). Some of the controllers work with Telegram API as a data source. Bot-related code is standalone (`bot` file).

## Front end

### Ads browsing view

Component tree with notes on key states:
```
App → category and sorting values
    NavBar
    ItemContainer → ads data
        ItemCard → thumbnail image
            ItemModal → larger image
```
`services` file containes functions that query the back end.

# Tech stack

This project is based on open-source software. 

### Back end
TypeScript, Node.js with [Express.js](http://expressjs.com/), CouchDB with [nano](https://www.npmjs.com/package/nano#nanodbcreatename-callback) driver.

### Front end
TypeScript, React with [create-react-app](https://create-react-app.dev/) setup, [Bulma CSS](https://bulma.io/) styles.

