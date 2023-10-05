const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const nano = require('nano')(`${process.env.COUCH_DB_PROTOCOL}://${process.env.COUCH_DB_LOGIN}:${process.env.COUCH_DB_PASSWORD}@${process.env.COUCH_DB_IP_PORT}`);

nano.db.create('posts')
    .then(res => console.log("Database with posts created"))
    .catch(err => console.log("Database with posts already exists"));

const posts = nano.use('posts');

const dblist = nano.db.list()
    .then(list => console.log(list));

module.exports = posts;