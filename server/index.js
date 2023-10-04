const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs');
const dotenv = require('dotenv');
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
    ctx.replyWithMediaGroup(
        [
            { 
                media: { source: fs.readFileSync("./mocks/nokia_sample_pic.jpeg") },
                caption: "This is a caption",
                type: "photo"
            },
            { 
                media: { source: fs.readFileSync("./mocks/nokia_sample_pic.jpeg") },
                caption: "This is a caption",
                type: "photo"
            },
        ]);
    // ctx.replyWithPhoto({ source: fs.readFileSync("./mocks/nokia_sample_pic.jpeg") });
});

const editKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback("Title", "Title"),
    Markup.button.callback("Description", "Description"),
    Markup.button.callback("Price", "Price")],
    [Markup.button.callback("Discard this ad", "Discard this ad")]
]);

// https://github.com/telegraf/telegraf/issues/705#issuecomment-549056045
const postAdWizard = new Scenes.WizardScene(
    'post_ad_wizard',
    (ctx) => { // This ctx object has the text initiating the wizard, i.e. "Post an ad".
        ctx.wizard.state.adData = {};
        ctx.reply("Please enter your ad title", discardKeyboard);
        return ctx.wizard.next();
    },
    (ctx) => { // This ctx object has the text entered by the user in the previous step.
        ctx.wizard.state.adData.title = ctx.message.text;
        ctx.reply("Please enter your ad description", discardKeyboard);
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.adData.description = ctx.message.text;
        ctx.reply("Please enter your ad price", discardKeyboard);
        return ctx.wizard.next();
    },
    (ctx) => {
        console.log(ctx.wizard.cursor, "here");
        ctx.wizard.state.adData.price = ctx.message.text;
        // This works but need to force next step without user message.
        ctx.reply("That's it, please review your ad", Markup.inlineKeyboard([Markup.button.callback("Review", "Review")]));
        return ctx.wizard.next();
    },
    // TODO: Category selection step.
    (ctx) => {
        //     const photos = ctx.message.photo;
        //     ctx.wizard.state.adData.photos = photos;
        // const photoIds = photos.map((photo) => photo.file_id);
        // const photoUrls = photoIds.map((id) => `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${id}`);
        // const photoHtml = photoUrls.map((url) => `<a href="${url}">&#8205;</a>`).join('');
        // console.log(photos)
        // ctx.replyWithPhoto({ source: fs.readFileSync("./mocks/nokia_sample_pic.jpeg") });
        // Review step No. 4.
        ctx.replyWithHTML(`
        <b>${ctx.wizard.state.adData.title}</b>
        \n${ctx.wizard.state.adData.description}
        \n${process.env.LOCAL_CURRENCY_SYMBOL}${ctx.wizard.state.adData.price}
        \nContact @${ctx.from.username}
        `);
        // https://core.telegram.org/bots/api#sending-files
        // this method accepts either HTTP URL or Telegram's file_id.
        // https://github.com/feathers-studio/telegraf-docs/blob/master/examples/media-bot.ts
        // \n${photoHtml}
        ctx.reply("Is this correct?", Markup.inlineKeyboard([
            Markup.button.callback("Yes", "yes"),
            Markup.button.callback("No", "no")
        ]));
        return ctx.wizard.next();
    },
    (ctx) => {
        console.log(ctx.wizard.cursor);
        if (ctx.callbackQuery.data === "yes") {
            ctx.reply("Your ad was posted and will be added to the community ads list soon",
                Markup.removeKeyboard());
            return ctx.scene.leave();
        } else if (ctx.callbackQuery.data === "no") {
            ctx.reply("What would you like to change?", editKeyboard);
            return ctx.wizard.next();
        }
    }, // Editing user path.
    (ctx) => {
        console.log(ctx.wizard.cursor);
        if (ctx.callbackQuery.data === "Title") {
            ctx.wizard.state.adData.toChange = "title";
            ctx.reply("Enter new title", discardKeyboard);
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
        ctx.wizard.state.adData[ctx.wizard.state.adData.toChange] = ctx.message.text;
        ctx.reply("Changes saved, please review your ad", Markup.inlineKeyboard([Markup.button.callback("Review", "Review")]));
        return ctx.wizard.selectStep(4);
    }
);


// TODO: Add cancellation option to wizard, verification on steps, and 
// a way to go back to previous step to edit.
// What if multiple photos? How to handle that?

const stage = new Scenes.Stage([postAdWizard]);
bot.use(session());
bot.use(stage.middleware());

bot.hears("Post an ad", (ctx) => ctx.scene.enter("post_ad_wizard"));
bot.hears("Discard this ad", (ctx) => {
    ctx.reply("Ad discarded", Markup.removeKeyboard());
    postAdWizard.leave();
});

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

bot.launch();

// https://github.com/feathers-studio/telegraf-docs/blob/master/examples/live-location-bot.ts
// examples repo

// make react app that talks to the db, deploy and test
// https://core.telegram.org/bots/webapps#initializing-mini-apps
// props and methods of window.Telegram.WebApp object
