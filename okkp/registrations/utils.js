const utils = require('../../models/param/utils.js');

var date = utils.date_now();


exports.serialize_registrations = (data, user, process) => {
    let serialize = {
        "jenis_registrasi_id" : data.jenis_registrasi_id,
        "unit_usaha" : data.unit_usaha,
        "kota" : data.kota,
        "alamat_kantor": data.alamat_kantor,
        "alamat_unit" : data.alamat_unit,
        "komoditas_id" : data.komoditas_id,
        "ruang_lingkup" : data.ruang_lingkup,
        "nama_psat" : data.nama_psat,
        "nama_ilmiah" : data.nama_ilmiah, 
        "kemasan" : data.kemasan,
        "berat_bersih" : data.berat_bersih,
        "merk" : data.merk, 
        "no_registration" : data.no_registration,
        "no_sertifikat" : data.no_sertifikat,
        "terbit_sertifikat" : data.terbit_sertifikat,
        "exp_sertifikat" : data.exp_sertifikat,
        "luas_lahan" :data.luas_lahan,
        "label" : data.label,
        "jenis_hc_id" : data.jenis_hc_id,
        "jenis_sertifikat_id" : data.jenis_sertifikat_id ,
        "status_id" : data.status_id,
        "modified_by" : user.email,
        "updated_at": date
    }

    if(process == 'created'){
        serialize.created_at = date
        serialize.created_by = user.email
    }

    let key = Object.keys(serialize).toString()
    let value = Object.values(serialize)
    return {key, value}
}