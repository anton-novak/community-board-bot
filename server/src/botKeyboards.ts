import { Markup } from "telegraf";

export const mainKeyboard = Markup.keyboard([
    ["Post an ad"],
    ["Browse community ads"],
    ["Manage my ads"],
]).resize();

const webAppButton = Markup.button.webApp("Open web", process.env.WEB_APP_URL!);

export const miniAppKeyboard = Markup.inlineKeyboard([
    [webAppButton]
]);

const webAppOfficeButton = Markup.button.webApp("Open web", `${process.env.WEB_APP_URL!}/office`);

export const miniAppOfficeKeyboard = Markup.inlineKeyboard([
    [webAppOfficeButton]
]);

export const discardKeyboard = Markup.keyboard([
    ["Discard this ad"]
]).resize();

export const categoryKeyboard = Markup.inlineKeyboard([
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

export const photoKeyboard = Markup.inlineKeyboard([Markup.button.callback("❌ No photo for this ad", "noPhoto")])

export const jumpReviewKeyboard = Markup.inlineKeyboard([Markup.button.callback("Review", "Review")]);

export const reviewKeyboard = Markup.inlineKeyboard([
    [
        Markup.button.callback("✅ Yes", "yes"),
        Markup.button.callback("❌ No", "no")
    ],
    [
        Markup.button.callback("🗑️ Discard this ad", "discard")
    ]
]);


export const editKeyboard = Markup.inlineKeyboard([
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