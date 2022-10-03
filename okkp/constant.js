exports.field_db = async (jenis_registrasi_id) => {
    let jenis_registrasi_field = {
        1: ['jenis_registrasi_id', 'unit_usaha', 'kota', 'alamat_kantor', 'alamat_unit', 'komoditas_id', 'nama_psat', 'nama_ilmiah', 'kemasan', 'merk', 'no_registration', 'label', 'terbit_sertifikat', 'provinsi_id', 'modified_by'],
        2: ['jenis_registrasi_id', 'unit_usaha', 'kota', 'alamat_kantor', 'alamat_unit', 'komoditas_id', 'nama_psat', 'nama_ilmiah', 'kemasan', 'merk', 'no_registration', 'terbit_sertifikat', 'provinsi_id', 'modified_by'],
        3: ['jenis_registrasi_id', 'unit_usaha', 'kota', 'alamat_kantor', 'alamat_unit', 'ruang_lingkup', 'luas_lahan', 'komoditas_id', 'nama_psat', 'nama_ilmiah', 'no_registration', 'terbit_sertifikat', 'provinsi_id', 'modified_by'],
        4: ['jenis_registrasi_id', 'unit_usaha', 'jenis_hc_id', 'alamat_kantor', 'komoditas_id', 'identitas_lot', 'negara_tujuan', 'no_registration', 'terbit_sertifikat', 'provinsi_id', 'modified_by'],
        5: ['jenis_registrasi_id', 'unit_usaha', 'alamat_kantor', 'alamat_unit', 'ruang_lingkup', 'komoditas_id', 'nama_psat', 'nama_ilmiah', 'kemasan', 'merk', 'no_registration', 'terbit_sertifikat', 'provinsi_id', 'modified_by'],
        6: ['jenis_registrasi_id', 'unit_usaha', 'kota', 'alamat_kantor', 'alamat_unit', 'komoditas_id', 'nama_psat', 'nama_ilmiah', 'merk', 'jenis_sertifikat_id', 'no_registration', 'terbit_sertifikat', 'provinsi_id', 'modified_by']

    }
    return jenis_registrasi_field[jenis_registrasi_id]
}

exports.headers_dict = async (jenis_registrasi_id) => {
    let keys ={
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

    return keys
}