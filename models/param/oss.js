const axios = require('axios');
const crypto = require('crypto')
const dotenv = require('dotenv');
const md5 = require('md5');

dotenv.config();


exports.user_info = async(url, kd_izin, username, x_sm_key, token, access_token) => {

    let new_url = url + `?username=${username}&token=${token}&kd_izin=${kd_izin}`
    var param = {
        'method': 'GET',
        'url': new_url,
        'headers': {
            'Content-Type': 'application/json',
            'x-sm-key': x_sm_key
        },
        'data': {
            "token": access_token
        }
    };
    const result = await axios(param);
    return result.data;
}

exports.send_license = async(url, data, user, x_sm_key) => {
    var param = {
        'method': 'POST',
        'url': url,
        'headers': {
            'x-sm-key': x_sm_key
        },
        params: {
            username: 'psat',
            token: user
        },
        data: {
            nib: data.nib,
            id_produk: "-",
            id_proyek: data.id_proyek,
            oss_id: data.oss_id,
            id_izin: data.id_izin,
            kd_izin: data.kd_izin,
            kd_daerah: data.kd_daerah,
            kewenangan: data.kewenangan,
            nomor_izin: data.nomor_izin,
            tgl_terbit_izin: data.tgl_terbit_izin,
            tgl_berlaku_izin: data.tgl_berlaku_izin,
            nama_ttd: data.nama_ttd,
            nip_ttd: data.nip_ttd,
            jabatan_ttd: data.jabatan_ttd,
            status_izin: data.status_izin,
            file_izin: data.file_izin,
            keterangan: data.keterangan,
            file_lampiran: data.file_lampiran,
            nomenklatur_nomor_izin: data.nomenklatur_nomor_izin
        }
    };
    const result = await axios(param);
    let oss = result.data;



    return oss

}


exports.send_license_status = async(url, data, user, x_sm_key) => {
    var param = {
        'method': 'POST',
        'url': url,
        'headers': {
            'x-sm-key': x_sm_key,
            'Content-Type': 'application/json',
        },
        params: {
            username: 'psat',
            token: user
        },
        data: {
            nib: data.nib,
            id_produk: "-",
            id_proyek: data.id_proyek,
            oss_id: data.oss_id,
            id_izin: data.id_izin,
            kd_izin: data.kd_izin,
            kd_instansi: data.kd_instansi,
            kd_status: data.kd_status,
            tgl_status: data.tgl_status,
            nip_status: data.nip_status,
            nama_status: data.nama_status,
            keterangan: data.keterangan,
            data_pnbp: {
                kd_akun: data.data_pnbp.kd_akun,
                kd_penerimaan: data.data_pnbp.kd_penerimaan,
                kd_billing: data.data_pnbp.kd_billing,
                tgl_billing: data.data_pnbp.tgl_billing,
                tgl_expire: data.data_pnbp.tgl_expire,
                nominal: data.data_pnbp.nominal,
                url_dokumen: data.data_pnbp.url_dokumen
            }
        }
    };
    const result = await axios(param);
    let oss = result.data;
    console.log(oss)
    return oss

}



exports.send_fileDS = async(url, data, user, x_sm_key) => {
    var param = {
        'method': 'POST',
        'url': url,
        'headers': {
            'x-sm-key': x_sm_key
        },
        params: {
            username: 'psat',
            token: user
        },
        data: {
            receiveFileDS: {
                nib: data.receiveFileDS.nib,
                id_izin: data.receiveFileDS.kd_izin,
                file_izin: data.receiveFileDS.file_izin
            }
        }
    };
    const result = await axios(param);
    let oss = result.data;

    return oss

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

exports.validate_token = async(url, access_token, token, x_sm_key, username, kd_izin) => {
    let new_url = url + `?username=${username}&token=${token}&kd_izin=${kd_izin}`
    var param = {
        'method': 'GET',
        'url': new_url,
        'headers': {
            'Content-Type': 'application/json',
            'x-sm-key': x_sm_key
        },
        'data': {
            token: access_token
        }
    };
    const result = await axios(param);
    return result.data;
}

exports.generate_token = async(type) => {
    function sha1(val) {
        return crypto.createHash("sha1").update(val, "binary").digest("hex");
    }

    function converte_date() {
        function pad2(n) {
            return (n < 10 ? '0' : '') + n;
        }
        var date_token = new Date();
        var month = pad2(date_token.getMonth() + 1); //months (0-11)
        var day = pad2(date_token.getDate()); //day (1-31)
        var year = date_token.getFullYear();

        var formattedDate = year + "-" + month + "-" + day;
        return formattedDate
    }

    let data = {
        username: process.env.OSS_USERNAME,
        password: md5(process.env.OSS_PASSWORD),
        type: type,
        formattedDate: converte_date()
    }

    let user_key = sha1(data.username + data.password + data.type + data.formattedDate)
    return user_key
}