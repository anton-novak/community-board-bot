const db = require('./db');

const postAd = async (ad) => {
    const response = await db.insert(ad);
    console.log(response);
    return response;
}

module.exports = { postAd };