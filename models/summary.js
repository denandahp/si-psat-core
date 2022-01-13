const debug = require('debug')('app:model:sppb_psat');
const { or } = require('ip');
const pool = require('../libs/db');
const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('Worksheet Name');



var date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });


class getSummary {
    async view_sppb(year, month, type) {
        const headingColumnNames = [
            "pengajuan",
            "kode pengajuan",
            "pengguna",
            "status proses",
            "jenis perizinan",
            "jenis permohonan",
            "nama auditor",
            "dibuat",
            "diperbaharui"
        ]
        try {
            let filename;
            let view;
            if (type == 'ongoing') {
                filename = 'summary/sppb-psat-ongoing.xlsx'
                view = await pool.query("SELECT id_pengajuan,kode_pengajuan,id_pengguna,status_proses,  'SPPB-PSAT' as jenis_perizinan, jenis_permohonan,detail_tim_auditor, nomor_sppb_psat_sebelumnya, masa_berlaku, created, update  FROM sppb_psat.history_all_pengajuan WHERE EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 AND (status_proses <> $3 AND status_proses <> $4) ORDER BY update;", [year, month, 'Terbit Sertifikat', 'Dokumen Ditolak']);
            } else {
                filename = 'summary/sppb-psat-finish.xlsx'
                view = await pool.query("SELECT id_pengajuan,kode_pengajuan,id_pengguna,status_proses, 'SPPB-PSAT' as jenis_perizinan, jenis_permohonan, detail_tim_auditor, nomor_sppb_psat_sebelumnya, masa_berlaku, created, update FROM sppb_psat.history_all_pengajuan WHERE EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 AND  (status_proses = $3 AND status_proses = $4) ORDER BY update;", [year, month, 'Terbit Sertifikat', 'Dokumen Ditolak']);

            }

            let data = await view.rows.map(data => {
                let auditor_name = [""];

                if (data.detail_tim_auditor != null) {
                    auditor_name = data.detail_tim_auditor.map(detail => {

                        if (detail != null && detail.username != null) {
                            return detail.username
                        } else {
                            return ""
                        }

                    })
                }
                return {
                    id_pengajuan: data.id_pengajuan,
                    kode_pengajuan: data.kode_pengajuan,
                    id_pengguna: data.id_pengguna,
                    status_proses: data.status_proses,
                    jenis_perizinan: data.jenis_perizinan,
                    jenis_permohonan: data.jenis_permohonan,
                    detail_tim_auditor: auditor_name,
                    nomor_sppb_psat: data.nomor_sppb_psat_sebelumnya,
                    masa_berlaku: data.masa_berlaku,
                    created: data.created,
                    update: data.update
                }
            });
            //Write Column Title in Excel file
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });
            //Write Data in Excel file
            let rowIndex = 2;
            data.forEach(record => {
                let columnIndex = 1;
                Object.keys(record).forEach(columnName => {
                    ws.cell(rowIndex, columnIndex++)
                        .string(String(record[columnName]))
                });
                rowIndex++;
            });
            wb.write(filename);
            return data;

        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }


    async view_izinedar(year, month, type) {
        const headingColumnNames = [
            "pengajuan",
            "kode pengajuan",
            "pengguna",
            "status proses",
            "jenis perizinan",
            "jenis permohonan",
            "nama dagang",
            "nama latin",
            "nama merek",
            "jenis kemasan",
            "nama auditor",
            "dibuat",
            "diperbaharui"
        ]

        try {
            let filename;
            let view;
            if (type == 'ongoing') {
                filename = 'summary/izin-edar-ongoing.xlsx'
                view = await pool.query("SELECT id_pengajuan,kode_pengajuan,id_pengguna,status_proses,  'IZIN-EDAR' as jenis_perizinan,  status_pengajuan, nama_dagang, nama_latin, nama_merek, jenis_kemasan, detail_tim_auditor,nomor_izin_edar,expire_sertifikat, created, update  FROM izin_edar.history_all_pengajuan WHERE EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 AND (status_proses <> $3 AND status_proses <> $4) ORDER BY update;", [year, month, 'Terbit Sertifikat', 'Dokumen Ditolak']);
            } else {
                filename = 'summary/izin-edar-finish.xlsx'
                view = await pool.query("SELECT id_pengajuan,kode_pengajuan,id_pengguna,status_proses,  'IZIN-EDAR' as jenis_perizinan,  status_pengajuan, nama_dagang, nama_latin, nama_merek, jenis_kemasan, detail_tim_auditor, nomor_izin_edar,expire_sertifikat, created, update  FROM izin_edar.history_all_pengajuan WHERE EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 AND (status_proses = $3 AND status_proses = $4) ORDER BY update;", [year, month, 'Terbit Sertifikat', 'Dokumen Ditolak']);

            }
            let data = await view.rows.map(data => {
                let auditor_name = [""];
                if (data.detail_tim_auditor != null) {
                    auditor_name = data.detail_tim_auditor.map(detail => {
                        if (detail != null && detail.username != null) {
                            return detail.username
                        } else {
                            return ""
                        }
                    })
                }
                return {
                    id_pengajuan: data.id_pengajuan,
                    kode_pengajuan: data.kode_pengajuan,
                    id_pengguna: data.id_pengguna,
                    status_proses: data.status_proses,
                    jenis_perizinan: data.jenis_perizinan,
                    status_pengajuan: data.status_pengajuan,
                    nama_dagang: data.nama_dagang,
                    nama_latin: data.nama_latin,
                    nama_merek: data.nama_merek,
                    jenis_kemasan: data.jenis_kemasan,
                    detail_tim_auditor: auditor_name,
                    nomor_izin_edar: data.nomor_izin_edar,
                    masa_berlaku: data.expire_sertifikat,
                    created: data.created,
                    update: data.update
                }

            });
            //Write Column Title in Excel file
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });
            //Write Data in Excel file
            let rowIndex = 2;
            data.forEach(record => {
                let columnIndex = 1;
                Object.keys(record).forEach(columnName => {
                    ws.cell(rowIndex, columnIndex++)
                        .string(String(record[columnName]))
                });
                rowIndex++;
            });
            wb.write('filename');
            return data
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }


    async total_by_graph(year) {
        const date_val = ['', 'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER']

        try {

            let view = await pool.query('SELECT EXTRACT(MONTH FROM created) as month, status_proses, count(*) from pengguna.history_all_pengajuan WHERE EXTRACT(YEAR FROM created) = $1 GROUP BY  status_proses, EXTRACT(MONTH FROM created) ORDER BY EXTRACT(MONTH FROM created) ', [year])
            let data = view.rows
            let result = [];
            for (let i = 1; i < 13; i++) {
                let total = 0;
                let proses = 0;
                let selesai = 0;
                for (let y = 0; y < data.length; y++) {
                    if (data[y].month == i) {
                        total += Number(data[y].count)
                        if (data[y].status_proses == 'Terbit Sertifikat' || data[y].status_proses == 'Dokumen Ditolak') {
                            selesai = Number(data[y].count)
                        }
                    }
                }
                proses = total - selesai
                result.push({
                    month: date_val[i],
                    total: total,
                    proses: proses,
                    selesai: selesai
                })
            }


            return result;
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }



}
module.exports = new getSummary();