const utils = require('../../models/param/utils.js');
const pool = require('../../libs/okkp_db.js');

var date = utils.date_now();

const schema_regis = 'register';


exports.serialize_uji_lab = (data, user, process) => {
    let field_db = [
        "jenis_uji_lab_id", "user_id", "lembaga", "tanggal", "lokasi_sampel", "komoditas_id", "komoditas_tambahan",
        "parameter", "hasil_uji", "standar", "status_id", "referensi_bmr", "metode_uji", "note", "updated_at", 
        "modified_by", "provinsi_id"
    ]

    if(process == 'created'){
        field_db.push("created_at", "created_by")
    }
    let value = data.multiple_parameter.map((val) => {
        let lembaga = (data.lembaga) ? data.lembaga : user.duduk_lembaga
        value_list =  [
            data.jenis_uji_lab_id, user.id, lembaga, data.tanggal, data.lokasi_sampel, data.komoditas_id, data.komoditas_tambahan,
            val.parameter, val.hasil_uji, val.standar, data.status_id, data.referensi_bmr, data.metode_uji, data.note, date,
            user.email, data.provinsi_id
        ]
        if(process == 'created'){
            value_list.push(date, user.email)
        }
        return value_list
    });

    let key = field_db.toString()
    return {key, value}
}