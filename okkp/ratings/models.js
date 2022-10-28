let moment = require('moment-timezone');
const pool = require('../../libs/okkp_db.js');
const utils = require('./utils.js')
const utils_core = require('../../okkp/utils.js')
var format = require('pg-format');

const schema = 'register';
const db_ratings = schema + '.ratings';


class OkkpRatingsController {
    async create_ratings(data) {
        try {
            let ratings;
            let {key, value} = await utils.serialize_ratings(data, 'created')
            ratings = await pool.query(format('INSERT INTO ' + db_ratings + ` (${key}) VALUES (%L) RETURNING *`, value));
            return { status: '200', data: ratings.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async update_ratings(data) {
        try {
            let {key, value} = utils.serialize_ratings(data, 'updated')
            let ratings = await pool.query(format('UPDATE ' + db_ratings + ` SET (${key}) = (%L) WHERE id = ${data.id} RETURNING *`, value));
            return { status: '200', data: ratings.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_ratings(rating_id) {
        try {
            let ratings = await pool.query('DELETE FROM ' + db_ratings + ` WHERE id = ${rating_id} RETURNING *`);
            return { status: '200', data: ratings.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async index_ratings(query) {
        try {
            let filter = '';
            if(query.start && query.end){
                filter = `created_at BETWEEN '${moment(query.start).format()}' AND '${moment(query.end).format()}' `
            }
            let ratings = await utils_core.pagination(query.page, query.limit, filter, [], '*', db_ratings)
            return { status: '200', data: ratings };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async detail_ratings(ratings_id) {
        try {
            let ratings = await pool.query('SELECT * FROM ' + db_ratings + ` WHERE id=${ratings_id}`);
            return { status: '200', data: ratings.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }
}
module.exports = new OkkpRatingsController();