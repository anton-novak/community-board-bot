const crypto = require("crypto");
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

function parseUrlEncoded(string) {
    const queryObject = {};
    const queryPairs = string.split("&");

    for (let i = 0; i < queryPairs.length; i++) {
        const pair = queryPairs[i].split("=");
        const key = decodeURIComponent(pair[0]);
        const value = decodeURIComponent(pair[1]);
        queryObject[key] = value;
    };

    const userObject = JSON.parse(queryObject.user);
    return userObject;
}

function getMediaGroupPhotos(photosArray) {
    return photosArray.map((photo) => {
        console.log(photo);
        return {
            media: photo[0].file_id,
            caption: "Ad photo",
            type: "photo"
        }
    });
}


module.exports = { getMediaGroupPhotos, parseUrlEncoded };