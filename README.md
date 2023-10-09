# Community Board bot
<p align="center">
<img src="./for_readme/apartment_pic.png" />
</p>

Community Board bot is a Telegram bot with a mini-app that provides a convenient way to post and view ads for a local community, like residents of an apartment block or employees of an office.

# Motivation
There are many C2C ad sites out there (like eBay), but they can be an overkill. Sometimes it is easier for people to reach out to the local community when they want to give away or sell something. There's usually a certain level of trust in the community. Inspection, delivery and payment are easier to arrange which makes the process faster for the poster. For that reason the poster is also more likely to give away or sell items that would otherwise end up in garbage. Finally, posting ads locally simply allows people to connect with their neighbours or co-workers.

Often people use community chats as ad boards, but there are disadvantages to that: the ads get lost in the stream of messages, there are limited ways to track them, and chat members can disapprove of that. There may be no chat at all, or some people may not be members of it because of the toxicity (that happens a lot!). The Community Board bot solves these problems by providing a dedicated mini-app for the ads while keeping it local.

# Features
* Complete in-bot ad posting process with editing, validation and error handling.
* Easy-to-use and lightweight web interface that allows to browse, filter, sort and manage the ads.
* Saving ads to the chat with the bot for keeping and forwarding to other users.
* One-click transition to Telegram chats with the posters to initiate a conversation about the ads.
* Username check aimed to ensure the users' ability to connect with each other.
* Telegram-based image handling which keeps bot server space at the minimum.
* Telegram-based authentication - the mini-app is not accessible from outside the bot.

# Getting started

To work with this code you must have a grasp of concepts and tools of modern web development, including HTML, CSS, JavaScript, TypeScript, Node.js, React framework, HTTP protocol, NoSQL databases. Some knowledge of Telegram bot API will save a lot of time (although we knew nothing when we started).

### Working demo

Нou can try out the bot here: https://t.me/bh11412_test_bot. **Note to contest reviewers**: please contact me at https://t.me/boyMCMXCII if, for some reason, the server becomes not responsive - I'll start it up straight away. Telegram servers sometimes fail to return images, in that case you'll see fallback placeholders.

### Starting the bot and the mini-app in development mode

#### Setup

Prerequisites:
* Git & GitHub
* Telegram bot token - pay a respectful visit to the [BotFather](https://t.me/BotFather)
* [Node.js](https://nodejs.org/en) (version 18+) with `npm` package manager installed
* [CouchDB](https://couchdb.apache.org/)
    * Please follow the [installation](https://docs.couchdb.org/en/stable/install/index.html) and [setup](https://docs.couchdb.org/en/stable/setup/single-node.html) instructions from the developers
    * The single-node setup is the easiest option and it only requires to create an admin account and bind the database to an IP address and port
    * In a GUI environment with a browser you can complete the setup in Fauxton web interface (default URL: http://127.0.0.1:5984/_utils#setup)
* TypeScript with `ts-node` (run `npm i -g typescript` and `npm i -g ts-node` in your OS terminal)
    * If you get an execution policy error in PowerShell, start it with administrator priviliges and run `Set-ExecutionPolicy RemoteSigned` (by doing so you allow running unsigned scripts locally which should be fine as long as your are aware of what you are running and use trusted sources)

Clone this repo (**`public` branch**) into your local directory, navigate to both `server` and `web-app` directories in your OS terminal and run `npm i` to install back-end and front-end dependencies. 

Create `.env` file (just a blank file named exactly `.env`) in the `/server/src/` directory and populate it with environment variables (**copy the list below into the file, read through it and change accordingly - some of the values are used as examples**):

```
TELEGRAM_BOT_TOKEN="<bot_token>"
WEB_APP_URL="https://127.0.0.1:3000"
SERVER_PORT=3456
COUCH_DB_LOGIN="<couch_db_login>"
COUCH_DB_PASSWORD="<couch_db_password>"
COUCH_DB_IP_PORT="127.0.0.1:5984"
COUCH_DB_PROTOCOL="http"
TELEGRAM_FILE_URL="https://api.telegram.org/file/bot"
COMMUNITY_LABEL="<community_label>"
```
Point your front-end services to the back end by editing the first line of `services` file in `/web-app/src` directory (by default the back end server will run at http://127.0.0.1:<your_port>).

You can also create an `.env` file in the `/web-app` directory if you want to change the default `3000` port used by `create-react-app` scripts. Just put `PORT=<your_port>` in there.

#### Start-up

To start both the back end and the front end you can use the pre-made start-up scripts. Navigate to the top directory of the repo in your OS terminal, run `npm i` to download `concurrently` package and run `npm run start:win32` on Windows or `npm run start:unix` on UNIX OS. 

If the script fails, or you want to run things in separate terminals, you can do the following:
* Navigate to `/server` directory and start the back end with `npm run start_server` command in your OS terminal. 
* To start the front-end server run `($env:HTTPS = "true") -and (npm run start_webapp)` from `/web-app` directory in Windows PowerShell or `HTTPS=true npm run start_webapp` in a UNIX OS terminal (Create React App [docs page](https://create-react-app.dev/docs/using-https-in-development) on that).
    * HTTPS protocol is a must for starting a web app from a Telegram bot, so we have to use it.

Now you are good to go, just `/start` a conversation with the bot in Telegram. In development mode you will see a browser warning when opening the mini-app about not using a proper HTTPS certificate - just click through it.

# Project structure

## Back end

The back end is following the MVC pattern with a database layer in the back that talks to CouchDB (`db` and `model` files) and a RESTful API with controllers that react to specific HTTP requests and manupulate the data model (`router` and `controllers` files). Some of the controllers work with Telegram API as a data layer. 

Bot-related code is mostly standalone (`bot` file). Bot uses some methods exported by the database layer to interact with the database.

There are two databases in total that are created automatically: databases with ads and users (the latter for keeping track of chat IDs). Look in the `customTypes` file to see the "schema" for the ads database.

**Back end architecture**
```
Server
    router → middleware → controllers → model → database
                                      → Telegram API
    bot → model → database

* router: RESTful API endpoints
* middleware: user validation procedures
* controllers: HTTP requests handlers
* model: database querying procedures
* database: database initialization
* Telegram API: fetching photos and sending messages to users (code included with the controllers)
* bot code mainly consists of a wizard that handles the posting and editing process
```

## Front end

There are two main destinations in the mini-app handled by `react-router-DOM`: the ad browsing view `<AdBrowser/>` and the ad managing view `<Office/>`. Both of these pages re-use the same components that use conditional logic to enable or disable features.

**React component tree with key states**
```
App: routes
    AdBrowser || Office: category and sorting values generated by NavBar
        NavBar
        ItemContainer: ads data
            ItemCard: thumbnail image
                Notification
            ItemModal: larger image
                Notification
```
`services` file contains functions that query the back end and helper functions.

There are no `.css` files for pages and components, but for `.css` files with keyframes for animations. Styling is done inline using Bulma stylesheet classes or `style` objects for fine-tuning.

### A note on image handling

A decision was made to rely on Telegram API and servers to handle images. The API exposes an endpoint that takes bot token as a URL parameter. Making an image request to that endpoint from the front-end can expose the token. To avoid that, the API request was pushed back to the back end which them serves the image to the front-end.

# Challenges & roadmap

* We have not found a way to capture `file_id` of multiple photos sent by a user as a media group - only `file_id` of the last photo is available. It seems to be a [requested feature](https://github.com/python-telegram-bot/python-telegram-bot/wiki/Frequently-requested-design-patterns#how-do-i-deal-with-a-media-group) for the Bot API, so either we wait for the implementation or come up with a workaround.
* Getting into bot development proved harder than we imagined because of the style of documenting the libraries and the APIs. Thankfully, some answers were found in community discussions, in particular this [post](https://github.com/telegraf/telegraf/issues/705#issuecomment-549056045) by Ivan Malyugin on using `Scene` and `WizardScene` was most helpful.
* We have not found an easy way to test the bot and the web app on a mobile device. This became possible closer to the submission deadline after deploying the bot, and required purchasing a virtual server, domain name and SLL certificate to set up HTTPS protocol. A feature got commented out as a result as it did not behave as expected on a mobile device (fade out on modal overflow to let user know that there's more content down below, substituted with drawer icon on top).
* Potential additional features:
    * In-web-app editing of ads.
    * Geolocation-based registration process for keeping things truly local.
    * Regular bot reminders on new ads based on user preferences regarding categories.
    * More styles and animations (e.g., dark mode).
    * Infinite scroll (no manual pagination).

# Tech stack

This project is based on open-source software. 

### Back end
TypeScript, Node.js with [Express.js](http://expressjs.com/), [Telegraf](https://telegraf.js.org/) bot library, CouchDB with [nano](https://www.npmjs.com/package/nano#nanodbcreatename-callback) driver.

### Front end
TypeScript, React with [create-react-app](https://create-react-app.dev/) setup and [react-router-DOM](https://reactrouter.com/en/main/start/overview) for client-side routing, [Bulma CSS](https://bulma.io/) styles.

# Authors

Anton & Alexander Novak, for 22 September 2023 Telegram Mini-App Contest submission.