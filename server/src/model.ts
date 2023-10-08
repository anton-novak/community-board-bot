import { ads, users } from './db';
import { Ad } from './customTypes';

export async function postAd(ad: Ad) {
    const response = await ads.insert(ad);
    return response;
}

export async function getAllAds() {
    const list = await ads.list();
    const adsData = list.rows.map(async (row: { id: string }) => {
        return await getAd(row.id);
    });
    return Promise.all(adsData);
}

export async function getAd(_id: string) {
    const ad = await ads.get(_id);
    return ad;
}

export async function getUserAds(username: string) {
    // Mango query
    const docs = await ads.find({
        selector: {
            username: username
        }
    });
    return docs.docs;
}

export async function deleteAd(_id: string) {
    const ad = await getAd(_id);
    const response = await ads.destroy(ad._id, ad._rev);
    return response;
}

export async function registerUser(username: string, chatId: number) {
    try {
        console.log("db record check");
        const user = await users.get(username);
        console.log("A returning user");
        return;
    } catch (error) {
        const response = await users.insert({ _id: username, chatId: chatId });
        console.log("New user");
        return;
    }
}

export async function getChatId(username: string) {
    const user = await users.get(username);
    return user.chatId;
}