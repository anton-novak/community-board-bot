import { Telegraf, Markup, Scenes, session } from 'telegraf';
import dotenv from 'dotenv';
import { postAd } from './model';
dotenv.config({ path: './.env' });

// Examples repo: https://github.com/feathers-studio/telegraf-docs/blob/master/examples/live-location-bot.ts.
export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
// localhost is detected by Telegraf as invalid url, use 127.0.0.1 for development.
const webAppButton = Markup.button.webApp("Open web", process.env.WEB_APP_URL!);

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


const welcomeMessage = "☀️ Hi, this bot can help you post and view local community ads. Please choose an option from the menu below.";

const discardKeyboard = Markup.keyboard([
    ["Discard this ad"]
]);

bot.start((ctx) => {
    let chatId = ctx.message.chat.id;
    console.log(ctx.from, "\nchat id", chatId);
    ctx.reply(welcomeMessage, mainKeyboard);
});

// Registering username checking middleware.
bot.use((ctx, next) => {
    if (ctx.from && !ctx.from.username) {
        ctx.reply("⚠️ This bot is designed to connect people using Telegram usernames. Please set a username in Telegram settings and run the /start command again.");
        return;
    }
    next();
});

bot.hears("Browse community ads", (ctx) => {
    ctx.reply("Open community board", miniAppKeyboard);
});

const editKeyboard = Markup.inlineKeyboard([
    [
        Markup.button.callback("Title", "Title"),
        Markup.button.callback("Category", "Category"),
        Markup.button.callback("Description", "Description")
    ],
    [
        Markup.button.callback("Price", "Price"),
        Markup.button.callback("Photo", "Photo")
    ],
    [
        Markup.button.callback("🗑️ Discard this ad", "Discard this ad")
    ]
]);

const categoryKeyboard = Markup.inlineKeyboard([
    [
        Markup.button.callback("📺 Electronics & appliances", "Electronics & appliances"),
        Markup.button.callback("👗 Clothes & accessories", "Clothes & accessories")
    ],
    [
        Markup.button.callback("🦸 Help & services", "Help & services"),
        Markup.button.callback("⚒️ Building materials & DIY", "Building materials & DIY")
    ],
    [
        Markup.button.callback("🚗 Cars, bikes & parts", "Cars, bikes & parts"),
        Markup.button.callback("💅 Beauty & health", "Beauty & health")
    ],
    [
        Markup.button.callback("🤔 Other", "Other"),
    ]
]);

bot.use(session());

// https://github.com/telegraf/telegraf/issues/705#issuecomment-549056045
const postAdWizard = new Scenes.WizardScene(
    'post_ad_wizard',
    // TODO: Fix the type for ctx.
    (ctx: any) => { // Every next step is triggered by some user action which populates the ctx object for the next step.
        ctx.wizard.state.adData = {};
        ctx.reply("💬 Please enter your ad title (60 symbols)", discardKeyboard);
        return ctx.wizard.next();
    },
    (ctx) => {
        try {
            if (ctx.message.text.length > 60) {
                ctx.reply(`Please keep the title under 60 symbols, your input:\n
                ${ctx.message.text}`, discardKeyboard);
                return;
            }
        } catch (error) {
            ctx.reply("Please enter a title", discardKeyboard);
            return;
        }
        ctx.wizard.state.adData.title = ctx.message.text;
        ctx.reply("📂 Choose a category for your ad", categoryKeyboard, discardKeyboard);
        return ctx.wizard.next();
    },
    (ctx) => {
        try {
            ctx.wizard.state.adData.category = ctx.callbackQuery.data;
        } catch (error) {
            ctx.reply("Please select a category using the buttons");
            return; // Without ctx.wizard.next() the wizard re-enters the same step.
        }
        ctx.reply("🖼️ Please enter your ad description (280 symbols)", discardKeyboard);
        return ctx.wizard.next();
    },
    (ctx) => {
        try {
            if (ctx.message.text.length > 280) {
                ctx.reply(`Please keep the description under 280 symbols, your input:\n
                ${ctx.message.text}`);
                return;
            }
        } catch (error) {
            ctx.reply("Please enter a description", discardKeyboard);
            return;
        }
        ctx.wizard.state.adData.description = ctx.message.text;
        ctx.reply("💰 Please enter your ad price or tell if it's for free", discardKeyboard);
        return ctx.wizard.next();
    },
    (ctx) => {
        try {
            if (ctx.message.text.length > 30) {
                ctx.reply(`Please keep your price terms short (under 30 symbols): your input:\n
                ${ctx.message.text}`);
                return;
            }
        } catch (error) {
            ctx.reply("Please enter your price", discardKeyboard);
            return;
        }
        ctx.wizard.state.adData.price = ctx.message.text;
        ctx.reply("Attach a photo to your ad",
            Markup.inlineKeyboard([Markup.button.callback("❌ No photo for this ad", "noPhoto")]), discardKeyboard);
        ctx.wizard.state.adData.photos = [];
        return ctx.wizard.next();
        // Bot API has a design flaw for media groups: you can't get all file references from a media group sent by a user.
        // https://github.com/python-telegram-bot/python-telegram-bot/wiki/Frequently-requested-design-patterns#how-do-i-deal-with-a-media-group
    },
    (ctx) => {
        if (ctx.callbackQuery && ctx.callbackQuery.data === "noPhoto") {
            null;
        } else if (!ctx.message.photo) {
            ctx.reply("Please attach a photo to your ad", Markup.inlineKeyboard([Markup.button.callback("❌ No photo for this ad", "noPhoto")]), discardKeyboard);
            return;
        } else {
            ctx.wizard.state.adData.photos = ctx.message.photo;
        }
        ctx.reply("🔍 That's it, please review your ad", Markup.inlineKeyboard([Markup.button.callback("Review", "Review")]), discardKeyboard);
        return ctx.wizard.next();
    },
    (ctx) => {
        // Review step No. 6.
        if (ctx.wizard.state.adData.photos.length > 0) {
            ctx.replyWithPhoto(ctx.wizard.state.adData.photos[0].file_id);
        }
        ctx.replyWithHTML(`
        <b>${ctx.wizard.state.adData.title}</b>
        \n<i>${ctx.wizard.state.adData.category}</i>
        \n${ctx.wizard.state.adData.description}
        \n${ctx.wizard.state.adData.price}
        \nContact @${ctx.from.username}
        `);
        ctx.reply("Is this correct?", Markup.inlineKeyboard([
            [
                Markup.button.callback("✅ Yes", "yes"),
                Markup.button.callback("❌ No", "no")
            ],
            [
                Markup.button.callback("🗑️ Discard this ad", "discard")
            ]
        ]));
        return ctx.wizard.next();
    },
    async (ctx) => {
        try {
            if (ctx.callbackQuery.data === "yes") {
                // Save ad to the db.
                ctx.wizard.state.adData.username = ctx.from.username;
                ctx.wizard.state.adData.user_id = ctx.from.id;
                ctx.wizard.state.adData.timestamp = Date.now();
                await postAd(ctx.wizard.state.adData);
                ctx.reply("✅ Your ad was posted and will be added to the community ads list soon",
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
    },
    (ctx) => {
        try {
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
            } else if (ctx.callbackQuery.data === "Photo") {
                ctx.reply("Attach a new photo", Markup.inlineKeyboard([Markup.button.callback("❌ No photo for this ad", "noPhoto")]), discardKeyboard);
                ctx.wizard.state.adData.toChange = "photo";
                return ctx.wizard.next();
            } else if (ctx.callbackQuery.data === "Discard this ad") {
                ctx.reply("Ad discarded", Markup.removeKeyboard());
                return ctx.scene.leave();
            }
        } catch (error) {
            ctx.reply("Please select an option using the edit buttons", discardKeyboard);
            return;
        }
    },
    (ctx) => {
        if (ctx.wizard.state.adData.toChange !== "photo" &&
            ctx.wizard.state.adData.toChange !== "category") {
            try {
                if (ctx.wizard.state.adData.toChange === "title" && ctx.message.text.length > 60) {
                    ctx.reply(`Please keep the title under 60 symbols, your input:\n
                        ${ctx.message.text}`, discardKeyboard);
                    return;
                } else if (ctx.wizard.state.adData.toChange === "description" && ctx.message.text.length > 280) {
                    ctx.reply(`Please keep the description under 280 symbols, your input:\n
                        ${ctx.message.text}`, discardKeyboard);
                    return;
                }
                ctx.wizard.state.adData[ctx.wizard.state.adData.toChange] = ctx.message.text;
            } catch (error) {
                ctx.reply(`Please enter a new ${ctx.wizard.state.adData.toChange}`, discardKeyboard);
                return;
            }
        } else if (ctx.wizard.state.adData.toChange === "category") {
            try {
                ctx.wizard.state.adData.category = ctx.callbackQuery.data;
            } catch (error) {
                ctx.reply("Please select a category using the buttons");
                return; // Without ctx.wizard.next() the wizard re-enters the same step.
            }
        } else if (ctx.wizard.state.adData.toChange === "photo") {
            if (ctx.callbackQuery && ctx.callbackQuery.data === "noPhoto") {
                ctx.wizard.state.adData.photos = [];
            } else if (!ctx.message.photo) {
                ctx.reply("Please attach a photo to your ad", Markup.inlineKeyboard([Markup.button.callback("❌ No photo for this ad", "noPhoto")]), discardKeyboard);
                return;
            } else {
                ctx.wizard.state.adData.photos = ctx.message.photo;
            }
        }
        ctx.reply("✅ Changes saved, please review your ad", Markup.inlineKeyboard([Markup.button.callback("Review", "Review")]), discardKeyboard);
        return ctx.wizard.selectStep(6);
    }
);

const stage = new Scenes.Stage([postAdWizard]);
bot.use(stage.middleware());

// TODO: Fix the type for ctx.
bot.hears("Post an ad", (ctx: any) => ctx.scene.enter("post_ad_wizard"));

postAdWizard.hears("Discard this ad", (ctx) => {
    ctx.reply("Ad discarded", Markup.removeKeyboard());
    ctx.scene.leave();
});