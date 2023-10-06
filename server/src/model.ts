import { ads } from './db';
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