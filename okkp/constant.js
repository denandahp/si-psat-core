exports.field_db = async (jenis_registrasi_id) => {
    let jenis_registrasi_field = {
        1: ['jenis_registrasi_id', 'unit_usaha', 'kota', 'alamat_kantor', 'alamat_unit', 'komoditas_id', 'nama_psat', 
            'nama_ilmiah', 'kemasan', 'merk', 'no_registration', 'label', 'terbit_sertifikat', 'provinsi_id', 'modified_by', 
            'exp_sertifikat', 'status_id'],
        2: ['jenis_registrasi_id', 'unit_usaha', 'kota', 'alamat_kantor', 'alamat_unit', 'komoditas_id', 'nama_psat', 
            'nama_ilmiah', 'kemasan', 'merk', 'no_registration', 'terbit_sertifikat', 'lembaga_penerbit',
            'provinsi_id', 'modified_by', 'exp_sertifikat', 'status_id'],
        3: ['jenis_registrasi_id', 'unit_usaha', 'kota', 'alamat_kantor', 'alamat_unit', 'ruang_lingkup', 'luas_lahan', 
            'komoditas_id', 'nama_psat', 'nama_ilmiah', 'no_registration', 'terbit_sertifikat', 'provinsi_id', 'modified_by',
            'exp_sertifikat', 'status_id'],
        4: ['jenis_registrasi_id', 'unit_usaha', 'jenis_hc_id', 'alamat_kantor', 'komoditas_id', 'identitas_lot', 
            'negara_tujuan', 'no_registration', 'terbit_sertifikat', 'provinsi_id', 'modified_by',
            'exp_sertifikat', 'status_id'],
        5: ['jenis_registrasi_id', 'unit_usaha', 'alamat_kantor', 'alamat_unit', 'ruang_lingkup', 'komoditas_id', 'nama_psat', 
            'nama_ilmiah', 'kemasan', 'merk', 'no_registration', 'terbit_sertifikat', 'provinsi_id', 'modified_by',
            'exp_sertifikat', 'status_id'],
        6: ['jenis_registrasi_id', 'unit_usaha', 'kota', 'alamat_kantor', 'alamat_unit', 'komoditas_id', 'nama_psat', 
            'nama_ilmiah', 'kemasan', 'merk', 'no_registration', 'terbit_sertifikat', 'provinsi_id', 'modified_by', 
            'exp_sertifikat', 'status_id'],
        7: ['jenis_registrasi_id', 'unit_usaha', 'kota', 'alamat_kantor', 'alamat_unit', 'komoditas_id', 'nama_psat', 
            'nama_ilmiah', 'merk', 'jenis_sertifikat_id', 'no_registration', 'terbit_sertifikat', 'provinsi_id', 'modified_by',
            'exp_sertifikat', 'status_id']

    }
    return jenis_registrasi_field[jenis_registrasi_id]
}

exports.field_db_uji = async (jenis_uji_lab_id) => {
    let jenis_uji_field = {
        1: ["jenis_uji_lab_id", "user_id", "lembaga", "tanggal", "lokasi_sampel", "komoditas_id", "komoditas_tambahan", "parameter", 
            "hasil_uji", "standar", "status_id", "referensi_bmr", "metode_uji", "created_by", "modified_by", "provinsi_id"],
        2: ["jenis_rapid_test_id", "user_id", "lembaga", "tanggal", "lokasi_sampel", "komoditas_id", "komoditas_tambahan", 
            "logam_berat_id", "mikroba_id", "aflatoksin_id", "pestisida_id", "hasil_uji", "note", "created_by", "modified_by", "provinsi_id"]

    }
    return jenis_uji_field[jenis_uji_lab_id]
}

exports.headers_dict = async (data) => {
    let keys;
    if(data.jenis_registrasi){
        keys = {
            jenis_registrasi : "Jenis Registrasi",
            unit_usaha: "Nama Unit Usaha",
            kota: "Kab/Kota",
            alamat_kantor: "Alamat Kantor",
            alamat_unit: "Alamat Unit Penanganan",
            komoditas: "Komoditas",
            ruang_lingkup: "Ruang Lingkup",
            nama_psat: "Nama PSAT",
            nama_ilmiah: "Nama Ilmiah",
            kemasan: "Kemasan dan Berat Bersih",
            merk: "Nama Dagang/Merk",
            no_registration: "Nomor Registrasi",
            terbit_sertifikat: "Tanggal Penerbitan Sertifikat",
            exp_sertifikat: "Tanggal Expired Sertifikat",
            luas_lahan: "Luas Lahan",
            label: "Label Hijau/Putih",
            jenis_hc: "Jenis Sertifikat",
            status: "Status",
            created_at: "Tanggal Input",
            updated_at: "Tanggal Input Diubah",
            provinsi: "Provinsi",
            negara_tujuan: "Negara Tujuan",
            identitas_lot: "Identitas Lot"
        }
    }else if(data.jenis_uji_lab){
        keys ={
            jenis_uji_lab : "Uji Lab",
            lembaga: "Lembaga",
            tanggal: "Tanggal",
            lokasi_sampel: "Lokasi Sampel",
            komoditas: "Komoditas",
            komoditas_tambahan: "Komoditas Tambahan",
            parameter: "Parameter",
            hasil_uji: "Hasil Uji",
            standar: "Standar",
            status: "Status",
            referensi_bmr: "Referensi BMR",
            metode_uji: "Metode Uji",
            created_at: "Tanggal Input",
        }

    }else if(data.jenis_rapid_test){
        keys ={
            jenis_rapid_test : "Uji Lab",
            lembaga: "Lembaga",
            tanggal: "Tanggal",
            lokasi_sampel: "Lokasi Sampel",
            komoditas: "Komoditas",
            komoditas_tambahan: "Komoditas Tambahan",
            logam_berat: "Logam Berat",
            mikroba: "Mikroba",
            aflatoksin: "Aflatoksin",
            pestisida: "Pestisida",
            hasil_uji: "Hasil Uji",
            note: "Keterangan",
            created_at: "Tanggal Input",
        }
    }else{
        keys={
            'No': 'Nomor',
            'Nama Unit Usaha': 'Nama Unit Usaha',
            'Kab/Kota':'Kab/Kota',
            'Alamat Kantor': 'Alamat Kantor',
            'Alamat Unit Penanganan': 'Alamat Unit Penanganan',
            'Komoditas Utama': 'Komoditas Utama',
            'Nama PSAT': 'Nama PSAT',
            'Nama Ilmiah': 'Nama Ilmiah',
            'Kemasan dan Berat Bersih': 'Kemasan dan Berat Bersih',
            'Nama Dagang/Merk': 'Nama Dagang/Merk',
            'Nomor Registrasi': 'Nomor Registrasi',
            'Tanggal Penerbitan Sertifikat': 'Tanggal Penerbitan Sertifikat'
        }
    }

    return keys
}