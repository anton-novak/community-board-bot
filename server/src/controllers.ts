import { getAllAds, getAd, getUserAds, deleteAd, getChatId } from './model';
import { Request, Response } from 'express';
import { Telegram } from 'telegraf';
import fetch from 'node-fetch';
import { Ad } from './customTypes';

export const telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN!);

export async function getAllAdsController (req: Request, res: Response) {
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

export async function getTelegramImageFile (file_id: string) {
    const linkObj = await telegram.getFileLink(file_id);
    const imageData = await fetch(linkObj.href, { method: 'GET' });
    const buffer = await imageData.arrayBuffer();
    return buffer;
}

export async function getTelegramPic (req: Request, res: Response) {
    try {
        const picData = await getTelegramImageFile(req.params.file_id);
        res.status(200);
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(Buffer.from(picData));
    } catch (error) {
        console.log(error);
        res.status(404);
        res.send("Failed to fetch the pic");
        return error;
    }
}

export async function getUserAdsController (req: Request, res: Response) {
    try {
        const ads = await getUserAds(req.params.username);
        res.status(200);
        res.send(ads);
    } catch (error) {
        console.log(error);
        res.status(404);
        res.send("Failed to fetch ads")
    }
}

export async function deleteAdController (req: Request, res: Response) {
    try {
        const tbdAd = await getAd(req.params._id);
        if (req.app.locals.user !== tbdAd.username) throw new Error("Unauthorized request");
        const response = await deleteAd(req.params._id);
        res.status(200);
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(404);
        res.send("Failed to delete an ad")
    }
}

export async function saveAdController (req: Request, res: Response) {
    try {
        const chatId = await getChatId(req.app.locals.user);
        const ad = await getAd(req.body._id);
        if (ad.photos.length > 0) {
            try {
                const send = await telegram.sendPhoto(chatId, ad.photos[0].file_id, { caption: messageConstructor(ad) });
            } catch (error) {
                console.log(error);
                telegram.sendMessage(chatId, messageConstructor(ad));
            }
        } else {
            telegram.sendMessage(chatId, messageConstructor(ad));
        }
        res.status(200);
        res.send("Ad send to the chat");
    } catch (error) {
        console.log(error);
        res.status(404);
        res.send("Failed to save the ad");
    }
}

function messageConstructor (ad: Ad) {
    return `
    ${ad.title}
    \n${ad.description}
    \n${ad.price}
    \nContact @${ad.username}
    `;
}