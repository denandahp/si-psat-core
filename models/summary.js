const debug = require('debug')('app:model:sppb_psat');
const check_query = require('./param/utils.js');
const { or } = require('ip');
const pool = require('../libs/db');
const xl = require('excel4node');
const { string } = require('pg-format');




var date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });


class getSummary {

    async generateExcel(data, filename, worksheetName, headingColumnNames) {
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet(worksheetName);

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
        return "Saved";
    }
    async view_sppb(year, month, type, excel, page, limit, username) {



        try {
            let history;
            let count;
            let saveToExcel;
            if (excel == 1) {
                count = await pool.query('SELECT COUNT (*) FROM' + "  sppb_psat.history_all_pengajuan " + 'WHERE  EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 ', [year, month]);
                page = 1;
                limit = count.rows[0].count
            }
            if (username == null) {

                if (type == 'ongoing') {
                    history = await check_query.pagination(page, limit, ' EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 AND (status_proses <> $3 AND status_proses <> $4) ', [year, month, 'Terbit Sertifikat', 'Dokumen Ditolak'], '*', " sppb_psat.history_all_pengajuan ")
                    check_query.check_queryset(history);
                } else if (type == 'finish') {
                    history = await check_query.pagination(page, limit, '  EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 AND  (status_proses = $3 ) ', [year, month, 'Terbit Sertifikat'], '*', " sppb_psat.history_all_pengajuan ")
                    check_query.check_queryset(history);
                } else if (type == 'reject') {
                    history = await check_query.pagination(page, limit, '  EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 AND  (status_proses = $3) ', [year, month, 'Dokumen Ditolak'], '*', " sppb_psat.history_all_pengajuan ")
                    check_query.check_queryset(history);
                }
            } else {
                console.log(username)
                if (type == 'ongoing') {
                    history = await check_query.pagination(page, limit, ' EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 AND (status_proses <> $3 AND status_proses <> $4) AND ' + `  $5=ANY(${'tim_auditor'}) `, [year, month, 'Terbit Sertifikat', 'Dokumen Ditolak', username], '*', " sppb_psat.history_all_pengajuan ")
                    check_query.check_queryset(history);
                } else if (type == 'finish') {
                    history = await check_query.pagination(page, limit, '  EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 AND  (status_proses = $3 ) AND' + `  $4=ANY(${'tim_auditor'}) `, [year, month, 'Terbit Sertifikat', username], '*', " sppb_psat.history_all_pengajuan ")
                    check_query.check_queryset(history);
                } else if (type == 'reject') {
                    history = await check_query.pagination(page, limit, '  EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 AND  (status_proses = $3 ) AND' + `  $4=ANY(${'tim_auditor'}) `, [year, month, 'Dokumen Ditolak', username], '*', " sppb_psat.history_all_pengajuan ")
                    check_query.check_queryset(history);
                }
            }

            let data = await history.query.map(data => {
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

                    kode_pengajuan: data.kode_pengajuan,
                    nama_perusahaan: data.nama_perusahaan,
                    status_proses: data.status_proses,
                    jenis_permohonan: data.jenis_permohonan,
                    detail_tim_auditor: auditor_name,
                    tim_auditor: data.tim_auditor,
                    nomor_sppb_psat: data.nomor_sppb_psat_sebelumnya,
                    masa_berlaku: data.masa_berlaku,
                    tanggal_pengajuan: data.created,
                    tanggal_terbit: data.update

                }
            });
            if (excel == 1) {
                const headingColumnNames = ["kode pengajuan", "nama usaha", "status proses", "jenis permohonan", "nama auditor", "no sppb psat", "masa berlaku"]
                const filename = 'summary/sppb-psat-' + type + '-' + String(year) + '-' + String(month) + '.xlsx';
                const worksheetName = "SPPB-PSAT";
                saveToExcel = await this.generateExcel(data, filename, worksheetName, headingColumnNames);
            } else {
                saveToExcel = "Not Saved";
            }


            return {
                next: {
                    page: history.next.page,
                    limit: history.next.limit
                },

                previous: {
                    page: history.previous.page,
                    limit: history.previous.limit
                },
                total_query: history.total_query,
                max_page: history.max_page,
                query: data,
                saveToExcel
            };

        } catch (ex) {

            return { status: '400', Error: "" + ex };
        };
    }


    async view_izinedar(year, month, type, excel, page, limit, username) {


        try {
            let history;
            let count;
            let saveToExcel;
            if (excel == 1) {
                count = await pool.query('SELECT COUNT (*) FROM' + "  izin_edar.history_all_pengajuan " + 'WHERE  EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 ', [year, month]);
                page = 1;
                limit = count.rows[0].count
            }

            if (username == null) {
                if (type == 'ongoing') {
                    history = await check_query.pagination(page, limit, ' EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 AND (status_proses <> $3 AND status_proses <> $4) ', [year, month, 'Terbit Sertifikat', 'Dokumen Ditolak'], '*', " izin_edar.history_all_pengajuan ")
                    check_query.check_queryset(history);
                } else if (type == 'finish') {
                    history = await check_query.pagination(page, limit, '  EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 AND  (status_proses = $3) ', [year, month, 'Terbit Sertifikat'], '*', " izin_edar.history_all_pengajuan ")
                    check_query.check_queryset(history);
                } else if (type == 'reject') {
                    history = await check_query.pagination(page, limit, '  EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 AND  (status_proses = $3 ) ', [year, month, 'Dokumen Ditolak'], '*', " izin_edar.history_all_pengajuan ")
                    check_query.check_queryset(history);
                }
            } else {
                if (type == 'ongoing') {
                    history = await check_query.pagination(page, limit, ' EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 AND (status_proses <> $3 AND status_proses <> $4) AND ' + `  $5=ANY(${'tim_auditor'}) `, [year, month, 'Terbit Sertifikat', 'Dokumen Ditolak', username], '*', " izin_edar.history_all_pengajuan ")
                    check_query.check_queryset(history);
                } else if (type == 'finish') {
                    history = await check_query.pagination(page, limit, '  EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 AND  (status_proses = $3 ) AND ' + `  $4=ANY(${'tim_auditor'}) `, [year, month, 'Terbit Sertifikat', username], '*', " izin_edar.history_all_pengajuan ")
                    check_query.check_queryset(history);
                } else if (type == 'reject') {
                    history = await check_query.pagination(page, limit, '  EXTRACT(YEAR FROM created) = $1 AND EXTRACT(MONTH FROM created)= $2 AND  (status_proses = $3 ) AND ' + `  $4=ANY(${'tim_auditor'}) `, [year, month, 'Dokumen Ditolak', username], '*', " izin_edar.history_all_pengajuan ")
                    check_query.check_queryset(history);
                }
            }

            let data = await history.query.map(data => {
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

                    kode_pengajuan: data.kode_pengajuan,
                    status_proses: data.status_proses,
                    nama_perusahaan: data.nama_perusahaan,
                    status_pengajuan: data.status_pengajuan,
                    nama_dagang: data.nama_dagang,
                    nama_latin: data.nama_latin,
                    nama_merek: data.nama_merek,
                    jenis_kemasan: data.jenis_kemasan,
                    detail_tim_auditor: auditor_name,
                    nomor_izin_edar: data.nomor_izin_edar,
                    masa_berlaku: data.expire_sertifikat,
                    tanggal_pengajuan: data.created,
                    tanggal_terbit: data.update,
                    id_izin_oss: data.id_izin_oss,
                    id_izin: data.id_izin

                }

            });

            if (excel == 1) {
                const headingColumnNames = ["kode pengajuan", "status proses", "nama usaha", "jenis permohonan", "nama dagang", "nama latin", "nama merek", "jenis kemasan", "nama auditor", "nomor izin edar", "masa berlaku"]
                const filename = 'summary/izin-edar-' + type + '-' + String(year) + '-' + String(month) + '.xlsx';
                const worksheetName = "IZIN-EDAR";
                saveToExcel = await this.generateExcel(data, filename, worksheetName, headingColumnNames);
            } else {
                saveToExcel = "Not Saved";
            }

            return {
                next: {
                    page: history.next.page,
                    limit: history.next.limit
                },

                previous: {
                    page: history.previous.page,
                    limit: history.previous.limit
                },
                total_query: history.total_query,
                max_page: history.max_page,
                query: data,
                saveToExcel
            };
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }


    async total_by_graph(year, user) {
        const date_val = ['', 'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER']

        try {
            let view
            if (user == null) {
                view = await pool.query('SELECT EXTRACT(MONTH FROM created) as month, status_proses, count(*) from pengguna.history_all_pengajuan WHERE EXTRACT(YEAR FROM created) = $1 GROUP BY  status_proses, EXTRACT(MONTH FROM created) ORDER BY EXTRACT(MONTH FROM created) ', [year])
            } else {
                view = await pool.query('SELECT EXTRACT(MONTH FROM created) as month, status_proses, tim_auditor, count(*) from pengguna.history_all_pengajuan WHERE EXTRACT(YEAR FROM created) = $1 ' + `AND  $2=ANY(${'tim_auditor'}) ` + ' GROUP BY  status_proses,tim_auditor,  EXTRACT(MONTH FROM created) ORDER BY EXTRACT(MONTH FROM created) ', [year, user])

            }
            let data = view.rows
            let result = [];
            for (let i = 1; i < 13; i++) {
                let total = 0;
                let proses = 0;
                let selesai = 0;
                let ditolak = 0
                for (let y = 0; y < data.length; y++) {
                    if (data[y].month == i) {
                        total += Number(data[y].count)
                        if (data[y].status_proses == 'Terbit Sertifikat') {
                            selesai = Number(data[y].count)
                        } else if (data[y].status_proses == 'Dokumen Ditolak') {
                            ditolak = Number(data[y].count)
                        }
                    }
                }
                proses = total - (selesai + ditolak)
                result.push({
                    month: date_val[i],
                    total: total,
                    proses: proses,
                    selesai: selesai,
                    ditolak: ditolak
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