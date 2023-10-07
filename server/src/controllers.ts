import { getAllAds, getAd } from './model';
import { Request, Response } from 'express';
import { bot, telegram } from './bot';
import fetch from 'node-fetch';

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
        res.send("Failed to fetch the pic")
    }
}

// async function saveAd (req: Request, res: Response) {
//     try {
//         console.log(req.params._id);
//         const adData = await getAd(req.params._id);
//         telegram.sendMessage(chatId, "hello");
//         res.status(200);
//         res.send("Cool")
//     } catch (error) {
//         console.log(error);
//         res.status(404);
//         res.send("Failed to fetch the pic")
//     }
// }