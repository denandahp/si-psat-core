const pool = require('../../libs/okkp_db.js')

const schema_static = 'static'
const db_jenis_sertifikat = schema_static + '.jenis_sertifikat';
const db_status = schema_static + '.status';


exports.mapping_status_dict = async () => {
    let status_dict = {}
    let status = await pool.query(`select * from ${db_status}`)
    for(index in status.rows){
        status_dict[status.rows[index].nama] = status.rows[index].id
    }

    return status_dict
}

exports.mapping_jenis_sertif_dict = async () => {
    let jenis_sertifikat_dict = {}
    let jenis_sertifikat = await pool.query(`select * from ${db_jenis_sertifikat}`)
    for(index in jenis_sertifikat.rows){
        jenis_sertifikat_dict[jenis_sertifikat.rows[index].nama] = jenis_sertifikat.rows[index].id
    }
    return jenis_sertifikat_dict
}