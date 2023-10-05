const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs');
const dotenv = require('dotenv');
const { getMediaGroupPhotos } = require('../utils/utilities');
const { postAd } = require('./model');
dotenv.config({ path: './.env' });

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
// localhost is detected by Telegraf as invalid url, use 127.0.0.1.
const webAppButton = Markup.button.webApp("Open web", process.env.WEB_APP_URL);

const mainKeyboard = Markup.keyboard([
    ["Post an ad"],
    ["Browse community ads"],
    ["View and edit my ads"],
    // If a webapp is initialized from basic keyboard
    // it does not receive user info on init.
    // [webAppButton]
]);

const miniAppKeyboard = Markup.inlineKeyboard([
    [webAppButton]
]);

bot.hears("Browse community ads", (ctx) => {
    ctx.reply("Open community board", miniAppKeyboard);
});

const welcomeMessage = "Hi, this bot can help you post and view local community ads. Please choose an option from the menu below.";

const discardKeyboard = Markup.keyboard([
    ["Discard this ad"]
]);

bot.start((ctx) => {
    console.log(ctx.from);
    ctx.reply(welcomeMessage, mainKeyboard);

    // ctx.replyWithPhoto({ source: fs.readFileSync("./mocks/nokia_sample_pic.jpeg") });
});

const editKeyboard = Markup.inlineKeyboard([
    [
        Markup.button.callback("Title", "Title"),
        Markup.button.callback("Category", "Category"),
        Markup.button.callback("Description", "Description"),
        Markup.button.callback("Price", "Price")
    ],
    [
        Markup.button.callback("Discard this ad", "Discard this ad")
    ]
]);

const categoryKeyboard = Markup.inlineKeyboard([
    [
        Markup.button.callback("Electronics & appliances", "Electronics & appliances"),
        Markup.button.callback("Clothes & accessories", "Clothes & accessories")
    ],
    [
        Markup.button.callback("Help & services", "Help & services"),
        Markup.button.callback("Building materials & DIY", "Building materials & DIY")
    ],
    [
        Markup.button.callback("Cars, bikes & parts", "Cars, bikes & parts"),
        Markup.button.callback("Beauty & health", "Beauty & health")
    ],
    [
        Markup.button.callback("Other", "Other"),
    ]
]);

bot.use(session());


// https://github.com/telegraf/telegraf/issues/705#issuecomment-549056045
const postAdWizard = new Scenes.WizardScene(
    'post_ad_wizard',
    (ctx) => { // Every next step is triggered by some user action which populates the ctx object for the next step.
        ctx.wizard.state.adData = {};
        ctx.reply("Please enter your ad title", discardKeyboard);
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.adData.title = ctx.message.text;
        ctx.reply("Choose a category for your ad", categoryKeyboard);
        return ctx.wizard.next();
    },
    (ctx) => {
        try {
            ctx.wizard.state.adData.category = ctx.callbackQuery.data;
        } catch (error) {
            ctx.reply("Please select a category using the buttons");
            return; // Without ctx.wizard.next() the wizard re-enters the same step.
        }
        ctx.reply("Please enter your ad description", discardKeyboard);
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.adData.description = ctx.message.text;
        ctx.reply("Please enter your ad price", discardKeyboard);
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.adData.price = ctx.message.text;
        ctx.reply("Attach a photo to your ad",
            Markup.inlineKeyboard([Markup.button.callback("No photo for this ad", "noPhoto")]));
        ctx.wizard.state.adData.photos = [];
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.callbackQuery && ctx.callbackQuery.data === "noPhoto") {
            null;
        } else {
            ctx.wizard.state.adData.photos.push(ctx.message.photo);
        }
        // This works but need to force next step without user message.
        ctx.reply("That's it, please review your ad", Markup.inlineKeyboard([Markup.button.callback("Review", "Review")]));
        return ctx.wizard.next();
    },
    (ctx) => {
        // Review step No. 6.
        ctx.replyWithHTML(`
        <b>${ctx.wizard.state.adData.title}</b>
        \n<i>${ctx.wizard.state.adData.category}</i>
        \n${ctx.wizard.state.adData.description}
        \n${process.env.LOCAL_CURRENCY_SYMBOL}${ctx.wizard.state.adData.price}
        \nContact @${ctx.from.username}
        `);
        // Bot API has a design flaw for media groups: you can't get all file references from a media group sent by a user.
        // https://github.com/python-telegram-bot/python-telegram-bot/wiki/Frequently-requested-design-patterns#how-do-i-deal-with-a-media-group
        // Do all users have usernames? A workaround: `tg://user?id=123456789`
        // https://core.telegram.org/bots/api#sending-files
        // this method accepts either HTTP URL or Telegram's file_id.
        // https://github.com/feathers-studio/telegraf-docs/blob/master/examples/media-bot.ts
        // \n${photoHtml}
        ctx.replyWithMediaGroup(getMediaGroupPhotos(ctx.wizard.state.adData.photos));
        // ctx.replyWithMediaGroup()
        ctx.reply("Is this correct?", Markup.inlineKeyboard([
            [
                Markup.button.callback("Yes", "yes"),
                Markup.button.callback("No", "no")
            ],
            [
                Markup.button.callback("Discard this ad", "discard")
            ]
        ]));
        return ctx.wizard.next();
    },
    async (ctx) => {
        try {
            if (ctx.callbackQuery.data === "yes") {
                // Save ad to db.
                ctx.wizard.state.adData.username = ctx.from.username;
                ctx.wizard.state.adData.user_id = ctx.from.id;
                await postAd(ctx.wizard.state.adData);
                ctx.reply("Your ad was posted and will be added to the community ads list soon",
                    Markup.removeKeyboard());
                return ctx.scene.leave();
            } else if (ctx.callbackQuery.data === "no") {
                ctx.reply("What would you like to change?", editKeyboard);
                return ctx.wizard.next();
            } else if (ctx.callbackQuery.data === "discard") {
                ctx.reply("Ad discarded", Markup.removeKeyboard());
                return ctx.scene.leave();
            }
        } catch (error) {
            ctx.reply("Please select an option using the review buttons");
            return;
        }
    }, // Editing user path.
    (ctx) => {
        console.log(ctx.wizard.cursor);
        if (ctx.callbackQuery.data === "Title") {
            ctx.wizard.state.adData.toChange = "title";
            ctx.reply("Enter new title", discardKeyboard);
            return ctx.wizard.next();
        } else if (ctx.callbackQuery.data === "Category") {
            ctx.wizard.state.adData.toChange = "category";
            ctx.reply("Select new category", categoryKeyboard);
            return ctx.wizard.next();
        } else if (ctx.callbackQuery.data === "Description") {
            ctx.reply("Enter new description", discardKeyboard);
            ctx.wizard.state.adData.toChange = "description";
            return ctx.wizard.next();
        } else if (ctx.callbackQuery.data === "Price") {
            ctx.reply("Enter new price", discardKeyboard);
            ctx.wizard.state.adData.toChange = "price";
            return ctx.wizard.next();
        } else if (ctx.callbackQuery.data === "Discard this ad") {
            ctx.reply("Ad discarded", Markup.removeKeyboard());
            return ctx.scene.leave();
        }
    },
    (ctx) => {
        try {
            ctx.wizard.state.adData[ctx.wizard.state.adData.toChange] = ctx.message.text;
        } catch (error) {
            ctx.wizard.state.adData.category = ctx.callbackQuery.data;
        }
        ctx.reply("Changes saved, please review your ad", Markup.inlineKeyboard([Markup.button.callback("Review", "Review")]));
        return ctx.wizard.selectStep(6);
    }
);

// TODO: Add cancellation option to wizard, verification on steps, and 
// a way to go back to previous step to edit.
// What if multiple photos? How to handle that?

const stage = new Scenes.Stage([postAdWizard]);
bot.use(stage.middleware());

bot.hears("Post an ad", (ctx) => ctx.scene.enter("post_ad_wizard"));
bot.hears("Discard this ad", (ctx) => {
    ctx.reply("Ad discarded", Markup.removeKeyboard());
    postAdWizard.leave();
});

bot.launch();

// bot.on("photo", async (ctx) => {
//     console.log(ctx.message.photo);
//     // This URL works in the browser and return json data.
//     const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${ctx.message.photo[3].file_id}`;
//     const response = await fetch(url);
//     const data = await response.json();
//     // This URL returns the actual photo. Can use to to dowload it on the server.
//     const file_url = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${data.result.file_path}`;
//     console.log(file_url);
//     ctx.replyWithPhoto(ctx.message.photo[0].file_id);
// });

// bot.launch();

// https://github.com/feathers-studio/telegraf-docs/blob/master/examples/live-location-bot.ts
// examples repo

// make react app that talks to the db, deploy and test
// https://core.telegram.org/bots/webapps#initializing-mini-apps
// props and methods of window.Telegram.WebApp object

module.exports = bot;