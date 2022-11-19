let database;
const dotenv = require('dotenv');
dotenv.config();
if (process.env.POSTGRES_USER == undefined) {
    database = require('../configs.json').database;
}else if(process.env.NODE_ENV == 'PRODUCTION'){
        database = {
            user: process.env.POSTGRES_USER,
            host: process.env.PROD_POSTGRES_HOST,
            database: process.env.POSTGRES_DATABASE_PSAT,
            password: process.env.POSTGRES_PASSWORD,
            sslmode: process.env.POSTGRES_SSLMODE,
            post: process.env.POSTGRES_PORT
        };
} else {
    database = {
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DATABASE_PSAT,
        password: process.env.POSTGRES_PASSWORD,
        sslmode: process.env.POSTGRES_SSLMODE,
        post: process.env.POSTGRES_PORT
    };
}

const { Pool } = require('pg');
module.exports = new Pool(database);