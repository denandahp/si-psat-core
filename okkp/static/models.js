const core = require('../core.js')
const param_utils = require('../../models/param/utils.js');
const mysql = require('../../libs/mysql.js');
const pool = require('../../libs/okkp_db.js');
const utils = require('./utils.js')
var format = require('pg-format');

const schema = 'static';
const db_komoditas = schema + '.komoditas';
const db_jenis_registrasi = schema + '.jenis_registrasi';
const db_jenis_sertifikat = schema + '.jenis_sertifikat';
const db_jenis_hc = schema + '.jenis_hc';
const db_provinsi = schema + '.provinsi';
const db_wilayah_2022 = schema + '.wilayah_2022';
const db_status = schema + '.status';
const db_golongan = schema + '.golongan';
const db_status_uji_lab = schema + '.status_uji_lab';

let date_now = param_utils.date_now()


class StaticController {
    // ----------------------- CRUD KOMODITAS ----------------------------
    async create_komoditas(data) {
        try {
            let value = [data.nama, date_now, date_now]
            let komoditas = await pool.query(format('INSERT INTO ' + db_komoditas + ` (nama, created_at, updated_at) VALUES (%L) RETURNING *`, value));
            return { status: '200', data: komoditas.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async update_komoditas(data) {
        try {
            let value = [data.id, data.nama, date_now]
            let komoditas = await pool.query('UPDATE ' + db_komoditas + ` SET (nama, updated_at) = ($2, $3) WHERE id=$1 RETURNING *`, value);
            return { status: '200', data: komoditas.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_komoditas(id) {
        try {
            let komoditas = await pool.query('DELETE FROM ' + db_komoditas + ` WHERE id=${id} RETURNING *`);
            return { status: '200', data: komoditas.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async index_komoditas() {
        try {
            let komoditas, redis_key = 'index_komoditas';
            let redis_client = await core.redis_conn();
            const komoditas_cache = await redis_client.get(redis_key);
            if(komoditas_cache){
                komoditas = JSON.parse(komoditas_cache);
            }else{
                komoditas = await pool.query(format('SELECT id, nama FROM ' + db_komoditas));
                komoditas = komoditas.rows
                await redis_client.set(redis_key, JSON.stringify(komoditas));
            }
            return { status: '200', data: komoditas};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }

    // ----------------------- CRUD JENIS REGISTRASI ----------------------------
    async create_jenis_registrasi(data) {
        try {
            let value = [data.nama, date_now, date_now]
            let jenis_registrasi = await pool.query(format('INSERT INTO ' + db_jenis_registrasi + ` (nama, created_at, updated_at) VALUES (%L) RETURNING *`, value));
            return { status: '200', data: jenis_registrasi.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async update_jenis_registrasi(data) {
        try {
            let value = [data.id, data.nama, date_now]
            let jenis_registrasi = await pool.query('UPDATE ' + db_jenis_registrasi + ` SET (nama, updated_at) = ($2, $3) WHERE id=$1 RETURNING *`, value);
            return { status: '200', data: jenis_registrasi.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_jenis_registrasi(id) {
        try {
            let jenis_registrasi = await pool.query('DELETE FROM ' + db_jenis_registrasi + ` WHERE id=${id} RETURNING *`);
            return { status: '200', data: jenis_registrasi.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async index_jenis_registrasi() {
        try {
            let jenis_registrasi = await pool.query(format('SELECT id, nama FROM ' + db_jenis_registrasi));
            return { status: '200', data: jenis_registrasi.rows};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }

    // ----------------------- CRUD JENIS SERTIFIKAT ----------------------------
    async create_jenis_sertifikat(data) {
        try {
            let value = [data.nama, date_now, date_now]
            let jenis_sertifikat = await pool.query(format('INSERT INTO ' + db_jenis_sertifikat + ` (nama, created_at, updated_at) VALUES (%L) RETURNING *`, value));
            return { status: '200', data: jenis_sertifikat.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async update_jenis_sertifikat(data) {
        try {
            let value = [data.id, data.nama, date_now]
            let jenis_sertifikat = await pool.query('UPDATE ' + db_jenis_sertifikat + ` SET (nama, updated_at) = ($2, $3) WHERE id=$1 RETURNING *`, value);
            return { status: '200', data: jenis_sertifikat.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_jenis_sertifikat(id) {
        try {
            let jenis_sertifikat = await pool.query('DELETE FROM ' + db_jenis_sertifikat + ` WHERE id=${id} RETURNING *`);
            return { status: '200', data: jenis_sertifikat.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async index_jenis_sertifikat() {
        try {
            let jenis_sertifikat = await pool.query(format('SELECT id, nama FROM ' + db_jenis_sertifikat));
            return { status: '200', data: jenis_sertifikat.rows};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }

    // ----------------------- CRUD STATUS ----------------------------
    async index_status() {
        try {
            let status = await pool.query(format('SELECT id, nama FROM ' + db_status));
            return { status: '200', data: status.rows};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }

    // ----------------------- CRUD STATUS ----------------------------
    async index_status_uji_lab() {
        try {
            let status = await pool.query(format('SELECT id, nama FROM ' + db_status_uji_lab));
            return { status: '200', data: status.rows};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }

    // ----------------------- CRUD Jenis HC ----------------------------
    async create_jenis_hc(data) {
        try {
            let value = [data.nama, date_now, date_now]
            let jenis_hc = await pool.query(format('INSERT INTO ' + db_jenis_hc + ` (nama, created_at, updated_at) VALUES (%L) RETURNING *`, value));
            return { status: '200', data: jenis_hc.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async update_jenis_hc(data) {
        try {
            let value = [data.id, data.nama, date_now]
            let jenis_hc = await pool.query('UPDATE ' + db_jenis_hc + ` SET (nama, updated_at) = ($2, $3) WHERE id=$1 RETURNING *`, value);
            return { status: '200', data: jenis_hc.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_jenis_hc(id) {
        try {
            let jenis_hc = await pool.query('DELETE FROM ' + db_jenis_hc + ` WHERE id=${id} RETURNING *`);
            return { status: '200', data: jenis_hc.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async index_jenis_hc() {
        try {
            let jenis_hc = await pool.query(format('SELECT id, nama FROM ' + db_jenis_hc));
            return { status: '200', data: jenis_hc.rows};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }

    // ----------------------- CRUD Parameter Rapid Test ----------------------------
    async create_param_rapid_test(parameter, data) {
        try {
            let value = [data.nama, date_now, date_now]
            const database_name = await utils.database_parameter(parameter)
            let param_rapid_test = await pool.query(format('INSERT INTO ' + database_name + ` (nama, created_at, updated_at) VALUES (%L) RETURNING *`, value));
            return { status: '200', data: param_rapid_test.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async update_param_rapid_test(parameter, data) {
        try {
            let value = [data.id, data.nama, date_now]
            const database_name = await utils.database_parameter(parameter)
            let param_rapid_test = await pool.query('UPDATE ' + database_name + ` SET (nama, updated_at) = ($2, $3) WHERE id=$1 RETURNING *`, value);
            return { status: '200', data: param_rapid_test.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_param_rapid_test(parameter, id) {
        try {
            const database_name = await utils.database_parameter(parameter)
            let param_rapid_test = await pool.query('DELETE FROM ' + database_name + ` WHERE id=${id} RETURNING *`);
            return { status: '200', data: param_rapid_test.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async index_param_rapid_test(parameter) {
        try {
            const database_name = await utils.database_parameter(parameter)
            let param_rapid_test = await pool.query(format('SELECT id, nama FROM ' + database_name));
            return { status: '200', data: param_rapid_test.rows};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }

    // ----------------------- CRUD Jenis Uji ----------------------------
    async create_jenis_uji(parameter, data) {
        try {
            let value = [data.nama, date_now, date_now]
            const database_name = await utils.database_parameter(parameter)
            let jenis_uji = await pool.query(format('INSERT INTO ' + database_name + ` (nama, created_at, updated_at) VALUES (%L) RETURNING *`, value));
            return { status: '200', data: jenis_uji.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async update_jenis_uji(parameter, data) {
        try {
            let value = [data.id, data.nama, date_now]
            const database_name = await utils.database_parameter(parameter)
            let jenis_uji = await pool.query('UPDATE ' + database_name + ` SET (nama, updated_at) = ($2, $3) WHERE id=$1 RETURNING *`, value);
            return { status: '200', data: jenis_uji.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async delete_jenis_uji(parameter, id) {
        try {
            const database_name = await utils.database_parameter(parameter)
            let jenis_uji = await pool.query('DELETE FROM ' + database_name + ` WHERE id=${id} RETURNING *`);
            return { status: '200', data: jenis_uji.rows[0] };
        } catch (ex) {
            return { status: '400', Error: "" + ex };
        };
    }

    async index_jenis_uji(parameter) {
        try {
            const database_name = await utils.database_parameter(parameter)
            let jenis_uji = await pool.query(format('SELECT id, nama FROM ' + database_name));
            return { status: '200', data: jenis_uji.rows};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }

    // ----------------------- CRUD Provinsi ----------------------------
    async index_provinsi(kode_provinsi) {
        try {
            let wilayah;
            if(kode_provinsi){
                wilayah = {
                    "kota":{},
                    "kecamatan":{},
                    "kelurahan":{}
                }
                let query = await pool.query(`SELECT * FROM ${db_wilayah_2022} WHERE kode LIKE '${kode_provinsi}%'`);
                Object.entries(query.rows).map(([key, value]) => {
                    let kode_wilayah = value.kode
                     if(value.kode.length == 5){
                        // Kota
                        wilayah.kota[kode_wilayah] = value
                    }else if(value.kode.length == 8){
                        // Kecamatan
                        wilayah.kecamatan[kode_wilayah] = value
                    }else if(value.kode.length > 8){
                        // Kelurahan
                        wilayah.kelurahan[kode_wilayah] = value
                    }
                    return wilayah
                })
            }else{
                let query = await pool.query(format(`SELECT * FROM ${db_wilayah_2022} WHERE kode = substring(kode, 1, 2)`));
                wilayah = query.rows
            }
            return { status: '200', data: wilayah};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }

    // ----------------------- CRUD Golongan ----------------------------
    async index_golongan() {
        try {
            let status = await pool.query(format('SELECT id, nama FROM ' + db_golongan));
            return { status: '200', data: status.rows};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }

    async sync_data() {
        try {
            let nama = []
            let data_mysql = await mysql.query('SELECT * FROM komoditas ORDER BY komoditas ASC')
            for (let index in data_mysql){
                nama.push([data_mysql[index].komoditas])
            }
            // let data_pg = await pool.query(format(`INSERT INTO `+ db_komoditas +` (nama) VALUES %L RETURNING *`, nama));

            return { status: '200', data: data_pg.rows};
        } catch (ex) {
            console.log('error ' + ex)
        };
    }
}
module.exports = new StaticController();