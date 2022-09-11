const pool = require('../../libs/okkp_db.js');
const utils = require('./utils.js')
var format = require('pg-format');

const schema = '"register"';
const db_registrations = schema + '.' + '"registrasi"';

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
}
module.exports = new OkkpRegistrationsController();