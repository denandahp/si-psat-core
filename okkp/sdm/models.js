let moment = require('moment-timezone');
const pool = require('../../libs/okkp_db.js');
const utils = require('./utils.js')
const utils_core = require('../../okkp/utils.js')
var format = require('pg-format');

const schema = 'register';
const db_sdm = schema + '.sdm';


class OkkpSDMController {
    async create_sdm(data, user) {
        try {
            let sdm;
            let {key, value} = await utils.serialize_sdm(data, user, 'created')
            sdm = await pool.query(format('INSERT INTO ' + db_sdm + ` (${key}) VALUES (%L) RETURNING *`, value));
            return { status: '200', data: sdm.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async update_sdm(data, user) {
        try {
            let {key, value} = utils.serialize_sdm(data, user, 'updated')
            let sdm = await pool.query(format('UPDATE ' + db_sdm + ` SET (${key}) = (%L) WHERE id = ${data.id} RETURNING *`, value));
            return { status: '200', data: sdm.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_sdm(sdm_id) {
        try {
            let sdm = await pool.query('DELETE FROM ' + db_sdm + ` WHERE id = ${sdm_id} RETURNING *`);
            return { status: '200', data: sdm.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async index_sdm(query) {
        try {
            let filter = '';
            if(query.start && query.end){
                filter = `created_at BETWEEN '${moment(query.start).format()}' AND '${moment(query.end).format()}' `
            }
            let sdm = await utils_core.pagination(query.page, query.limit, filter, [], '*', db_sdm)
            return { status: '200', data: sdm };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async detail_sdm(sdm_id) {
        try {
            let sdm = await pool.query('SELECT * FROM ' + db_sdm + ` WHERE id=${sdm_id}`);
            return { status: '200', data: sdm.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }
}
module.exports = new OkkpSDMController();