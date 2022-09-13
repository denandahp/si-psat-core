var format = require('pg-format');
const pool = require('../../libs/mysql.js');
const utils = require('./utils.js')
const mysql = require('mysql')



class ImportModel {
    async model_imports(raw_data, body) {
        try {
            let clean_data = utils.mapping_excel(raw_data, body)
            let data = await pool.query('INSERT INTO registrasi () ')

            return { status: '200', keterangan: "Penambahan Ruang Lingkup SPPB PSAT"};
        } catch (ex) {
            console.log('data', 'error ' + ex)
        };
    }
}
module.exports = new ImportModel();