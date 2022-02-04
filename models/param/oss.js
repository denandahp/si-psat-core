const axios = require('axios');


exports.user_info = async(url, auth, user) => {
    var param = {
        'method': 'GET',
        'url': url,
        'headers': {
            'Accept': '*/*',
            'Connection': 'keep-alive',
            'Host': 'api-stg.oss.go.id',
            'Authorization': auth,
            'user_key': user
        }
    };
    const result = await axios(param);
    let oss = result.data.data;
    console.log(oss)
    return oss;
}

exports.send_license = async(url, body, user) => {
    var data = JSON.stringify({
        "IZINFINAL": {
            'nib': body.nib,
            'id_produk': body.id_produk,
            'id_proyek': body.id_proyek,
            'oss_id': body.oss_id,
            'id_izin': body.id_izin,
            'kd_izin': body.kd_izin,
            'kd_daerah': body.kd_daerah,
            'kewenangan': body.kewenangan,
            'nomor_izin': body.nomor_izin,
            'tgl_terbit_izin': body.tgl_terbit_izin,
            'tgl_berlaku_izin': body.tgl_berlaku_izin,
            'nama_ttd': body.nama_ttd,
            'nip_ttd': body.nip_ttd,
            'jabatan_ttd': body.jabatan_ttd,
            'status_izin': body.status_izin,
            'file_izin': body.file_izin,
            'keterangan': body.keterangan,
            'file_lampiran': body.file_lampiran,
            'nomenklatur_nomor_izin': body.nomenklatur_nomor_izin,
            'data_pnbp': [{
                'kd_akun': body.data_pnbp[0].kd_akun,
                'kd_penerimaan': body.data_pnbp[0].kd_penerimaan,
                'nominal': body.data_pnbp[0].nominal
            }]
        }
    })
    var param = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'user_key': user
        },
        'data': data
    };

    const result = await axios(param);
    let oss = result.data.data;
    return oss;
}

exports.send_license_final = async(url, body, user) => {
    var param = {
        'method': 'POST',
        'url': url,
        'headers': {
            'Accept': '*/*',
            'Connection': 'keep-alive',
            'Host': 'api-prd.oss.go.id',
            'user_key': user
        },
        'IZINFINAL': {
            'nib': body.nib,
            'id_produk': body.id_produk,
            'id_proyek': body.id_proyek,
            'oss_id': body.oss_id,
            'id_izin': body.id_izin,
            'kd_izin': body.kd_izin,
            'kd_instansi': body.kd_instansi,
            'kd_status': body.kd_status,
            'tgl_status': body.tgl_statu,
            'nip_status': body.ip_status,
            'nama_status': body.nama_status,
            'keterangan': body.keterangan,
            'data_pnbp': [{
                'kd_akun': body.kd_akun,
                'kd_penerimaan': body.kd_penerimaan,
                'kd_billing': body.kd_billing,
                'tgl_billing': body.tgl_billing,
                'tgl_expire': body.tgl_expire,
                'nominal': body.nominal,
                'url_dokumen': body.url_dokumen
            }]

        }
    };
    const result = await axios(param);
    let oss = result.data.data;
    return oss;
}

exports.validate_token = async(url, auth, user) => {
    var param = {
        'method': 'POST',
        'url': url,
        'headers': {
            'Accept': '*/*',
            'Connection': 'keep-alive',
            'Host': 'api-prd.oss.go.id',
            'Authorization': auth,
            'user_key': user
        }
    };
    const result = await axios(param);
    return result.data;
}