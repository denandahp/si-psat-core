const core = require('../core.js')
const pool = require('../../libs/okkp_db.js');
const utils = require('./utils.js')
const utils_core = require('../../okkp/utils.js')
var format = require('pg-format');

const schema = 'register';
const db_registrations = schema + '.registrasi';

class OkkpRegistrationsController {
    async create_registrations(data, user) {
        try {
            let {key, value} = utils.serialize_registrations(data, user, 'created')
            let registrasi = await pool.query(format('INSERT INTO ' + db_registrations + ` (${key}) VALUES (%L) RETURNING *`, value));
            console.log(registrasi.rows[0])
            return { status: '200', data: registrasi.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async update_registrations(data, user) {
        try {
            let {key, value} = utils.serialize_registrations(data, user, 'updated')
            let registrasi = await pool.query(format('UPDATE ' + db_registrations + `SET (${key}) = (%L) WHERE id = ${data.id} RETURNING *`, value));
            // debug('get %o', response);
            return { status: '200', data: registrasi.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async index_registrasi(query) {
        try {
            let filter = core.check_value(query.reg,'jenis_registrasi_id') + core.check_value( query.provinsi,'provinsi_id') + 
                         `no_registration LIKE '%${query.no_reg}%' AND unit_usaha LIKE '%${query.usaha}%'`
            let registrasi = await utils_core.pagination(query.page, query.limit, filter, [], '*', db_registrations)
            return { status: '200', data: registrasi.query };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async index_sertifikasi(query) {
        try {
            let filter = core.check_value(query.sertif,'jenis_sertifikat_id') + core.check_value( query.provinsi,'provinsi_id') + 
                         `no_sertifikat LIKE '%${query.no_sertif}%' AND unit_usaha LIKE '%${query.usaha}%'`
            let registrasi = await utils_core.pagination(query.page, query.limit, filter, [], '*', db_registrations)
            return { status: '200', data: registrasi.query };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }
}
module.exports = new OkkpRegistrationsController();