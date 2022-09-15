exports.field_db = async (jenis_registrasi_id) => {
    let jenis_registrasi_field = {
        1: ['jenis_registrasi_id', 'unit_usaha', 'kota', 'alamat_kantor', 'alamat_unit', 'komoditas_id', 'nama_psat', 'nama_ilmiah', 'kemasan', 'merk', 'no_registration', 'label', 'terbit_sertifikat', 'provinsi_id', 'modified_by'],
        2: ['jenis_registrasi_id', 'unit_usaha', 'kota', 'alamat_kantor', 'alamat_unit', 'komoditas_id', 'nama_psat', 'nama_ilmiah', 'kemasan', 'merk', 'no_registration', 'terbit_sertifikat', 'provinsi_id', 'modified_by'],
        3: ['jenis_registrasi_id', 'unit_usaha', 'kota', 'alamat_kantor', 'alamat_unit', 'ruang_lingkup', 'luas_lahan', 'komoditas_id', 'nama_psat', 'nama_ilmiah', 'no_registration', 'terbit_sertifikat', 'provinsi_id', 'modified_by'],
        4: ['jenis_registrasi_id', 'unit_usaha', 'jenis_hc_id', 'alamat_kantor', 'komoditas_id', 'identitas_lot', 'negara_tujuan', 'no_registration', 'terbit_sertifikat', 'provinsi_id', 'modified_by'],
        5: ['jenis_registrasi_id', 'unit_usaha','alamat_kantor', 'alamat_unit', 'ruang_lingkup', 'komoditas_id', 'nama_psat', 'nama_ilmiah', 'kemasan', 'merk', 'no_registration', 'terbit_sertifikat', 'provinsi_id', 'modified_by'],
    }
    return jenis_registrasi_field[jenis_registrasi_id]
}