const serverUrl = "http://localhost:3456";

declare global {
    interface Window {
        Telegram: {
            WebApp: {
                initData: string
            }
        }
    }
}

export default async function fetchAllAds() {
    try {
        const response = await fetch(`${serverUrl}/ads/${window.Telegram.WebApp.initData}`);
        const ads = await response.json();
        return ads;
    } catch (error) {
        console.error(error);
    }
}

export async function fetchTelegramPic(file_id: string) {
    try {
        const response = await fetch(`${serverUrl}/pics/${window.Telegram.WebApp.initData}/${file_id}`);
        const blob = await response.blob();
        return blob;
    } catch (error) {
        console.error(error);
    }
}

export async function sendAdToUser(_id: string) {
    try {
        const response = await fetch(`${serverUrl}/save/${window.Telegram.WebApp.initData}/${_id}`);
        return response;
    } catch (error) {
        console.error(error);
    }
}