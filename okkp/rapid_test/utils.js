const utils = require('../../models/param/utils.js');

var date = utils.date_now();

const schema_regis = 'register';


exports.serialize_rapid_test = (data, user, process) => {
    let serialize = {
        "jenis_rapid_test_id" : data.jenis_rapid_test_id,
        "user_id" : user.id,
        "lembaga" : user.duduk_lembaga,
        "lokasi_sampel" : data.lokasi_sampel,
        "komoditas_id" : data.komoditas_id,
        "komoditas_tambahan" : data.komoditas_tambahan,
        "logam_berat_id" : data.logam_berat_id,
        "mikroba_id" : data.mikroba_id,
        "aflatoksin_id" : data.aflatoksin_id,
        "pestisida_id" : data.pestisida_id,
        "hasil_uji" : data.hasil_uji,
        "status" : data.status,
        "note" : data.note,
        "updated_at" : date,
        "modified_by" : user.email
    }

    if(process == 'created'){
        serialize.created_at = date
        serialize.created_by = user.email
    }

    let key = Object.keys(serialize).toString()
    let value = Object.values(serialize)
    return {key, value}
}