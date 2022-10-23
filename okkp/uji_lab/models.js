const core = require('../core.js')
const pool = require('../../libs/okkp_db.js');
const utils = require('./utils.js')
const utils_core = require('../../okkp/utils.js')
var format = require('pg-format');

const schema = 'register';
const db_uji_lab = schema + '.uji_lab';
const db_view_uji_lab = schema + '.view_index_uji_lab';


class OkkpUjiLabController {
    async create_uji_lab(data, user) {
        try {
            let uji_lab;
            let {key, value} = await utils.serialize_uji_lab(data, user, 'created')
            await pool.query('BEGIN');
            uji_lab = await pool.query(format('INSERT INTO ' + db_uji_lab + ` (${key}) VALUES (%L) RETURNING *`, value));
            await pool.query('COMMIT');
            return { status: '200', data: uji_lab.rows[0] };
        } catch (ex) {
            await pool.query('ROLLBACK');
            return { status: '400', Error: "" + ex };
        };
    }

    async update_uji_lab(data, user) {
        try {
            let {key, value} = utils.serialize_uji_lab(data, user, 'updated')
            await pool.query('BEGIN');
            let uji_lab = await pool.query(format('UPDATE ' + db_uji_lab + ` SET (${key}) = (%L) WHERE id = ${data.id} RETURNING *`, value));
            await pool.query('COMMIT');
            return { status: '200', data: uji_lab.rows[0] };
        } catch (ex) {
            await pool.query('ROLLBACK');
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_uji_lab(uji_lab_id) {
        try {
            let uji_lab = await pool.query('DELETE FROM ' + db_uji_lab + ` WHERE id = ${uji_lab_id} RETURNING *`);
            return { status: '200', data: uji_lab.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async index_uji_lab(query) {
        try {
            let filter = core.check_value(query.jenis_uji_lab_id,'jenis_uji_lab_id', true) + core.check_value(query.uji_lab_id,'uji_lab_id')
            if(query.start && query.end){
                filter = filter + `AND created_at BETWEEN '${query.start_date}' AND '${query.end_date}' `
            }
            let uji_lab = await utils_core.pagination(query.page, query.limit, filter, [], '*', db_view_uji_lab)
            return { status: '200', data: uji_lab };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async detail_uji_lab(uji_lab_id) {
        try {
            let uji_lab = await pool.query('SELECT * FROM ' + db_view_uji_lab + ` WHERE id=${uji_lab_id}`);
            return { status: '200', data: uji_lab.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }
}
module.exports = new OkkpUjiLabController();