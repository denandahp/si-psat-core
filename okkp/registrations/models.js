const core = require('../core.js')
const pool = require('../../libs/db.js');
const utils = require('./utils.js')
const utils_core = require('../../okkp/utils.js')
var format = require('pg-format');

const schema = 'okkp';
const db_registrations = schema + '.registrasi';
const db_view_registrasi = schema + '.view_index_registrasi';


class OkkpRegistrationsController {
    async create_registrations(data, user) {
        try {
            let registrasi;
            let {key, value} = await utils.serialize_registrations(data, user, 'created')
            let is_already_exist = await utils.is_no_register_already_exist(data)
            await pool.query('BEGIN');
            if(is_already_exist == false){
                registrasi = await pool.query(format('INSERT INTO ' + db_registrations + ` (${key}) VALUES (%L) RETURNING *`, value));
                await pool.query('COMMIT');
            }else{
                return { status: '400', Error: "Nomor registrasi sudah terdaftar", data: is_already_exist };
            }
            return { status: '200', data: registrasi.rows[0] };
        } catch (ex) {
            await pool.query('ROLLBACK');
            return { status: '400', Error: "" + ex };
        };
    }

    async update_registrations(data, user) {
        try {
            let {key, value} = utils.serialize_registrations(data, user, 'updated')
            await pool.query('BEGIN');
            let registrasi = await pool.query(format('UPDATE ' + db_registrations + ` SET (${key}) = (%L) WHERE id = ${data.id} RETURNING *`, value));
            await pool.query('COMMIT');
            // debug('get %o', response);
            return { status: '200', data: registrasi.rows[0] };
        } catch (ex) {
            await pool.query('ROLLBACK');
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_registrations(registrasi_id) {
        try {
            let registrasi = await pool.query('DELETE FROM ' + db_registrations + ` WHERE id = ${registrasi_id} RETURNING *`);
            return { status: '200', data: registrasi.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async index_registrasi(query) {
        try {
            let filter = core.check_value(query.reg,'jenis_registrasi_id') + core.check_value( query.provinsi,'provinsi_id') + 
                         core.check_value(query.id_sertif,'jenis_sertifikat_id') +
                         `no_registration ILIKE '%${query.no_reg}%' AND unit_usaha ILIKE '%${query.usaha}%' `
            if(query.start_date && query.end_date){
                filter = filter + `AND created_at BETWEEN '${query.start_date}' AND '${query.end_date}' `
            }

            if(query.start_terbit && query.end_terbit){
                filter = filter + `AND terbit_sertifikat BETWEEN '${query.start_terbit}' AND '${query.end_terbit}' `
            }
            let registrasi = await utils_core.pagination(query.page, query.limit, filter, [], '*', db_view_registrasi, 'terbit_sertifikat')
            return { status: '200', data: registrasi };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async index_sertifikasi(query) {
        try {
            let filter = core.check_value(query.sertif,'jenis_sertifikat_id') + core.check_value( query.provinsi,'provinsi_id') + 
                         `no_sertifikat ILIKE '%${query.no_sertif}%' AND unit_usaha ILIKE '%${query.usaha}%'`
            let registrasi = await utils_core.pagination(query.page, query.limit, filter, [], '*', db_view_registrasi, 'terbit_sertifikat')
            return { status: '200', data: registrasi.query };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async detail_registrations(registrasi_id) {
        try {
            let registrasi = await pool.query('SELECT * FROM ' + db_view_registrasi + ` WHERE id=${registrasi_id}`);
            return { status: '200', data: registrasi.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }
}
module.exports = new OkkpRegistrationsController();