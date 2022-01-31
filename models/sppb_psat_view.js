const debug = require('debug')('app:model:sppb_psat');
const pool = require('../libs/db');

const schema = '"sppb_psat"';
const history_all_pengajuan = schema + '.' + '"history_all_pengajuan"';


var date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });

class SppbPsatModel {
    async view_sertifikat(param) {
        try {
            let response = {}
            let id_pengguna = param.id_pengguna
            let id_pengajuan = param.id_pengajuan
            let view_sertif = await pool.query('SELECT * FROM sppb_psat.history_all_pengajuan WHERE id_pengguna = $1 AND id_pengajuan = $2;', [id_pengguna, id_pengajuan]);

            return view_sertif.rows[0];
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async view_unitproduksi(param) {
        try {
            let view_sertif = await pool.query('SELECT * FROM sppb_psat.unit_produksi WHERE ' + `  id = ANY ($1) `, [param]);
            return view_sertif.rows;
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}
module.exports = new SppbPsatModel();