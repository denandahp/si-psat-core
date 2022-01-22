const pool = require('../../libs/db');

let head =`
    <head>
    <meta http-equiv=Content-Type content="text/html">
    <style>
        p,
        br {
            line-height: 115%;
            font-family: "Open Sans", serif;
            font-size: 12pt;
            margin: 0;
        }
        .header,
        .body {
            margin-bottom: 15pt;
        }
    </style>
    </head>
`
let footer = `
    <body>
        <br>
        <div class="footer">
            <p><b><u>OKKPP-Badan Ketahanan Pangan</u></b></p>
            <p>* Email ini bersifat informasi dan tidak dapat di reply.
            Apabila Bapak/Ibu membutuhkan informasi lebih lanjut,
            silakan menghubungi di nomor <b>(+6221) 7806708</b> atau 
            mengirimkan email ke <a href="mailto:okkpbkp@pertanian.go.id">okkpbkp@pertanian.go.id</a></p>

        </div>
    </body>
`

exports.content_superadmin = (pengajuan) => {
    let jenis_permohonan;
    if(pengajuan.permohonan == 'IZIN EDAR PL'){
        jenis_permohonan = pengajuan.status_pengajuan.toLowerCase()
    } else if (pengajuan.permohonan == 'SPPB PSAT'){
        jenis_permohonan = pengajuan.jenis_permohonan.toLowerCase()
    }
    let template = 
    `<html>
        ${head}
        <body>
            <div class="body">
                <p>Salam Hangat,</p>
                <p>${pengajuan.nama_perusahaan} telah mengajukan 
                ${pengajuan.status_proses.toLowerCase()} ${jenis_permohonan} 
                ${pengajuan.permohonan}
                dengan kode pengajuan ${pengajuan.kode_pengajuan}. Silakan <a href="#">login</a> untuk melanjutkan proses selanjutnya.</p>
            </div>
            <div class="footer">
                <p>Hormat kami,</p>
                <p><b>Otoritas Kompeten Keamanan Pangan Pusat</b></p>
                <p><b>Badan Ketahanan Pangan Kementerian Pertanian</b></p>
            </div>
        </body
        ${footer}
    </html>`
    return template;
}

exports.content_auditor = (pengajuan) => {
    let jenis_permohonan;
    if(pengajuan.permohonan == 'IZIN EDAR PL'){
        jenis_permohonan = pengajuan.status_pengajuan.toLowerCase()
    } else if (pengajuan.permohonan == 'SPPB PSAT'){
        jenis_permohonan = pengajuan.jenis_permohonan.toLowerCase()
    }
    return `<html>
        ${head}
        <body>
            <div class="body">
                <p>Salam Hangat,</p>
                <p>Berdasarkan Penugasan Pimpinan Anda ditugaskan untuk menindaklanjuti ${pengajuan.status_proses.toLowerCase()} ${jenis_permohonan} ${pengajuan.permohonan} ${pengajuan.nama_perusahaan}.</p>
                <p>
                    Silakan <a href="#">login</a> untuk melanjutkan proses audit, semoga layanan
                    ini dapat memberikan kenyamanan bagi Bapak/Ibu.
                </p>
            </div>
            <div class="footer">
                <p>Hormat kami,</p>
                <p><b>Otoritas Kompeten Keamanan Pangan Pusat</b></p>
                <p><b>Badan Ketahanan Pangan Kementerian Pertanian</b></p>
            </div>
        </body
        ${footer}
    </html>`
}

exports.content_pelaku_usaha = (pengajuan) => {
    
    let template, body, jenis_permohonan;
    if(pengajuan.permohonan == 'IZIN EDAR PL'){
        jenis_permohonan = pengajuan.status_pengajuan.toLowerCase()
    } else if (pengajuan.permohonan == 'SPPB PSAT'){
        jenis_permohonan = pengajuan.jenis_permohonan.toLowerCase()
    }
    if(pengajuan.code_status_proses == 11){
        body = 
        `<div class="body">
            <p>Salam Hangat,</p>
            <p>Mohon perbaiki ${jenis_permohonan} ${pengajuan.permohonan} yang anda ajukan dengan kode ${pengajuan.kode_pengajuan}.</p>
            <p>
                Silakan <a href="#">login</a> untuk melanjutkan proses selanjutnya, semoga layanan
                ini dapat memberikan kenyamanan bagi Bapak/Ibu.
            </p>
        </div>`
    } else if(pengajuan.code_status_proses == 21 || 
              pengajuan.code_status_proses == 31){
        body = 
        `<div class="body">
            <p>Salam Hangat,</p>
            <p>Proses ${jenis_permohonan} pada kode pengajuan ${pengajuan.kode_pengajuan} belum dapat dilanjutkan. 
               Silakan melakukan perbaikan dokumen yang tidak sesuai, semoga layanan
               ini dapat memberikan kenyamanan bagi Bapak/Ibu.
            </p>
        </div>`
    } else if(pengajuan.code_status_proses == 40){
        body = 
        `<div class="body">
            <p>Salam Hangat,</p>
            <p>Terima kasih ${jenis_permohonan} ${pengajuan.permohonan} Anda akan disidangkan pada Sidang Komisi Teknis (Komtek) oleh Tim Komtek. Semoga layanan
                ini dapat memberikan kenyamanan bagi Bapak/Ibu.
            </p>
        </div>`
    } else if(pengajuan.code_status_proses == 60){
        body = 
        `<div class="body">
            <p>Tahap Sidang Komisi Teknis pada kode pengajuan ${pengajuan.kode_pengajuan} telah selesai dilaksanakan. Semoga layanan
                ini dapat memberikan kenyamanan bagi Bapak/Ibu.
            </p>
        </div>`
    } else if(pengajuan.code_status_proses == 70){
        body = 
        `<div class="body">
            <p>Sertifikat ${jenis_permohonan} ${pengajuan.permohonan} dengan kode pengajuan ${pengajuan.kode_pengajuan} telah diterbitkan.
               Semoga layanan ini dapat memberikan kenyamanan bagi Bapak/Ibu.
            </p>
        </div>`
    }

    template = `<html>
        ${head}
        <body>
            <div class="header">
                <p>Yth. ${pengajuan.nama_perusahaan}</p>
            </div>
            ${body}
            <div class="footer">
                <p>Hormat kami,</p>
                <p><b>Otoritas Kompeten Keamanan Pangan Pusat</b></p>
                <p><b>Badan Ketahanan Pangan Kementerian Pertanian</b></p>
            </div>
        </body
        ${footer}
    </html>`
    return template;
}