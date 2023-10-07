import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const nano = require('nano')(`${process.env.COUCH_DB_PROTOCOL}://${process.env.COUCH_DB_LOGIN}:${process.env.COUCH_DB_PASSWORD}@${process.env.COUCH_DB_IP_PORT}`);

nano.db.create('ads')
    .then(() => console.log("Database with ads created"))
    .catch(() => console.log("Database with ads already exists"));

nano.db.create('users')
    .then(() => console.log("Database with users created"))
    .catch(() => console.log("Database with users already exists"));

export const ads = nano.use('ads');
export const users = nano.use('users');

const dblist = nano.db.list()
    .then((list: string[]) => console.log("CouchDB databases:", list));
