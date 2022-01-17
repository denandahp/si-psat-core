const check_query = require('./param/utils.js');
const debug = require('debug')('app:model:sppb_psat');
const pool = require('../libs/db');
var format = require('pg-format');

const schema = '"notifikasi"';
const db_notfikasi = schema + '.' + '"notifikasi"';
const db_list_notfikasi = schema + '.' + '"list_notifikasi"';


var date = check_query.date_now();

class SppbPsatModel {
    async read_notifikasi(data) {
        try {
            let data_notifikasi, notifikasi;
            if (data.id_notifikasi == 'all') {
                data_notifikasi = ['READ', date];
                notifikasi = await pool.query(format(
                    'UPDATE' + db_notfikasi + ' SET (status, update) = (%L) ' +
                    `WHERE id_pengguna=${data.id_pengguna} RETURNING *`, data_notifikasi));
            } else {
                data_notifikasi = ['READ', date];
                notifikasi = await pool.query(format(
                    'UPDATE' + db_notfikasi + ' SET (status, update) = (%L) ' +
                    `WHERE id=${data.id_notifikasi} AND id_pengguna=${data.id_pengguna} RETURNING *`, data_notifikasi));
            }
            check_query.check_queryset(notifikasi);
            debug('get %o', notifikasi);
            return { status: '200', keterangan: `Update Notifikasi ${data.id_notifikasi} Berhasil`, data: notifikasi.rows };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async history_notifikasi(user, page, limit) {
        try {
            let unread_count = await pool.query(
                'SELECT COUNT (*) FROM' + db_list_notfikasi + 'WHERE id_pengguna_tujuan=$1 AND status=$2', [user, 'UNREAD']);
            let history = await check_query.pagination(page, limit, 'id_pengguna_tujuan=$1', [user], '*', db_list_notfikasi)
            check_query.check_queryset(history);
            debug('get %o', history);
            return {
                status: '200',
                keterangan: `History notifikasi id pengguna ${user}`,
                unread: unread_count.rows[0].count,
                data: history
            };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}
module.exports = new SppbPsatModel();