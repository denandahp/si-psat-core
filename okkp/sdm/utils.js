const core = require('../core')
const utils = require('../../models/param/utils.js');

var date = utils.date_now();


exports.serialize_sdm = (data, user, process) => {
    let serialize = {
        "nama_lengkap": data.nama_lengkap,
        "nip": data.nip,
        "jenis_kelamin": data.jenis_kelamin,
        "provinsi_id": data.provinsi_id,
        "kota_id": data.kota_id,
        "unit_kerja": data.unit_kerja,
        "jabatan": data.jabatan,
        "golongan_id": data.golongan_id,
        "kompetensi": core.array_query_format(data.kompetensi),
        "bukti_kompetensi": data.bukti_kompetensi,
        "foto": data.foto,
        "updated_at": date,
        "modified_by": user.email,
        "provinsi_id": user.provinsi_id,
    }

    if(process == 'created'){
        serialize.created_at = date
        serialize.created_by = user.email
    }

    let key = Object.keys(serialize).toString()
    let value = Object.values(serialize)
    return {key, value}
}