const { getAllAds, getAd } = require('./model');
const { Telegram } = require('telegraf');
const bot = require('./bot');

const telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);

async function getAllAdsController (req, res) {
    try {
        const ads = await getAllAds();
        res.status(200);
        res.send(ads);
    } catch (error) {
        console.log(error);
        res.status(404);
        res.send("Failed to fetch ads")
    }
}

async function getTelegramImageFile (file_id) {
    const linkObj = await telegram.getFileLink(file_id);
    const imageData = await fetch(linkObj.href);
    const buffer = await imageData.arrayBuffer();
    return buffer;
}

async function getTelegramPic (req, res) {
    try {
        const picData = await getTelegramImageFile(req.params.file_id);
        res.status(200);
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(Buffer.from(picData));
    } catch (error) {
        console.log(error);
        res.status(404);
        res.send("Failed to fetch the pic")
    }
}

async function saveAd (req, res) {
    try {
        console.log(req.params._id);
        const adData = await getAd(req.params._id);
        // telegram.sendMessage(chatId, "hello");
        // this works!!!!!!!!!!!!!
        res.status(200);
        res.send("Cool")
    } catch (error) {
        console.log(error);
        // res.status(404);
        // res.send("Failed to fetch the pic")
    }
}

module.exports = { getAllAdsController, getTelegramPic, saveAd };
