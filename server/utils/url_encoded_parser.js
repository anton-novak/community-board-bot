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