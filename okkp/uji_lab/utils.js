const utils = require('../../models/param/utils.js');
const pool = require('../../libs/okkp_db.js');

var date = utils.date_now();

const schema_regis = 'register';


exports.serialize_uji_lab = (data, user, process) => {
    let serialize = {
        "jenis_uji_lab_id" : data.jenis_uji_lab_id,
        "user_id" : user.id,
        "lembaga" : (data.lembaga) ? data.lembaga : user.duduk_lembaga,
        "tanggal" : data.tanggal,
        "lokasi_sampel" : data.lokasi_sampel,
        "komoditas_id" : data.komoditas_id,
        "komoditas_tambahan" : data.komoditas_tambahan,
        "parameter" : data.parameter,
        "hasil_uji" : data.hasil_uji,
        "standar" : data.standar,
        "status_id" : data.status_id,
        "referensi_bmr" : data.referensi_bmr,
        "metode_uji" : data.metode_uji,
        "note" : data.note,
        "updated_at" : date,
        "modified_by" : user.email,
        "provinsi_id" : data.provinsi_id
    }

    if(process == 'created'){
        serialize.created_at = date
        serialize.created_by = user.email
    }

    let key = Object.keys(serialize).toString()
    let value = Object.values(serialize)
    return {key, value}
}