const core = require('../core.js')
const pool = require('../../libs/db.js');
const utils = require('./utils.js')
const utils_core = require('../../okkp/utils.js')
var format = require('pg-format');

const schema = 'okkp';
const db_rapid_test = schema + '.rapid_test';
const db_view_rapid_test = schema + '.view_index_rapid_test';


class OkkpRapidTestController {
    async create_rapid_test(data, user) {
        try {
            let rapid_test;
            let {key, value} = await utils.serialize_rapid_test(data, user, 'created')
            await pool.query('BEGIN');
            rapid_test = await pool.query(format('INSERT INTO ' + db_rapid_test + ` (${key}) VALUES (%L) RETURNING *`, value));
            await pool.query('COMMIT');
            return { status: '200', data: rapid_test.rows[0] };
        } catch (ex) {
            await pool.query('ROLLBACK');
            return { status: '400', Error: "" + ex };
        };
    }

    async update_rapid_test(data, user) {
        try {
            let {key, value} = utils.serialize_rapid_test(data, user, 'updated')
            await pool.query('BEGIN');
            let provinsi = utils_core.filter_provinsi(user)
            let rapid_test = await pool.query(format('UPDATE ' + db_rapid_test + ` SET (${key}) = (%L) WHERE id = ${data.id} ${provinsi} RETURNING *`, value));
            await pool.query('COMMIT');
            return { status: '200', data: rapid_test.rows[0] };
        } catch (ex) {
            await pool.query('ROLLBACK');
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_rapid_test(rapid_test_id) {
        try {
            let provinsi = utils_core.filter_provinsi(user)
            let rapid_test = await pool.query('DELETE FROM ' + db_rapid_test + ` WHERE id = ${rapid_test_id} ${provinsi} RETURNING *`);
            return { status: '200', data: rapid_test.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async index_rapid_test(query) {
        try {
            let filter = core.check_value(query.jenis_rapid_test_id,'jenis_rapid_test_id', true) + core.check_value(query.rapid_test_id,'rapid_test_id')
            if(query.start && query.end){
                filter = filter + `AND created_at BETWEEN '${query.start_date}' AND '${query.end_date}' `
            }
            let rapid_test = await utils_core.pagination(query.page, query.limit, filter, [], '*', db_view_rapid_test)
            return { status: '200', data: rapid_test };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async detail_rapid_test(rapid_test_id) {
        try {
            let rapid_test = await pool.query('SELECT * FROM ' + db_view_rapid_test + ` WHERE id=${rapid_test_id}`);
            return { status: '200', data: rapid_test.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }
}
module.exports = new OkkpRapidTestController();