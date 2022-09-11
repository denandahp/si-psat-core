const mysql = require('../../libs/mysql.js');
const pool = require('../../libs/okkp_db.js');
var format = require('pg-format');

let schema = 'static';
let db_komoditas = schema + '.komoditas';

class StaticController {
    async index_komoditas() {
        try {
            let komoditas = await pool.query(format('SELECT id, nama FROM ' + db_komoditas));
            return { status: '200', data: komoditas.rows};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }

    async sync_komoditas() {
        try {
            let nama = []
            let komoditas = await mysql.query('SELECT * FROM komoditas ORDER BY komoditas ASC')
            for (let index in komoditas){
                nama.push([komoditas[index].komoditas])
            }
            let komoditas_query = await pool.query(format('INSERT INTO ' + db_komoditas + ` (nama) VALUES %L RETURNING *`, nama));
            console.log(komoditas_query.rows)

            return { status: '200', keterangan: "Penambahan Ruang Lingkup SPPB PSAT"};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }
}
module.exports = new StaticController();