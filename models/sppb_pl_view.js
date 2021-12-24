const debug = require('debug')('app:model:sppb_psat');
const pool = require('../libs/db');

const schema = '"izin_edar"';
const history_all_pengajuan = schema + '.' + '"history_all_pengajuan"';


var date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });

class SppbPlModel {
    async view_sertifikat(param) {
        try {
            let response = {}
            let id_pengguna = param.id_pengguna
            let id_pengajuan = param.id_pengajuan
            let view_sertif = await pool.query('SELECT * FROM izin_edar.history_all_pengajuan WHERE id_pengguna = $1 AND id_pengajuan = $2;', [id_pengguna, id_pengajuan]);
            // console.log(view_sertif)
            return view_sertif.rows[0];
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async view_unitproduksi(param) {
        try {
            let response = {}
            let id_pengguna = param.id_pengguna
            let id_pengajuan = param.id_pengajuan
            let view_unit = await pool.query('SELECT * FROM izin_edar.unit_produksi WHERE id_pengguna = $1 ORDER BY created desc;', [id_pengguna]);

            return view_unit.rows[0];
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}
module.exports = new SppbPlModel();