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
        <div class="footer">
            <p><b><u>OKKPP-Badan Ketahanan Pangan</u></b></p>
            <p>* Email ini bersifat informasi dan tidak dapat di reply. Apabila Bapak/Ibu membutuhkan informasi lebih lanjut, silakan menghubungi di nomor <b>(+6221) 7806708</b> atau mengirimkan email ke <a href="mailto:okkpbkp@pertanian.go.id">okkpbkp@pertanian.go.id</a></p>

        </div>
    </body>
`

exports.content_superadmin = async(pengajuan) => {
    return `<html>
        ${head}
        <body>
            <div class="body">
                <p>Salam Hangat,</p>
                <p>${pengajuan.nama_perusahaan} telah mengajukan ${pengajuan.status_proses.toLowerCase()} ${pengajuan.permohonan}. Silakan <a href="#">login</a> untuk melanjutkan proses selanjutnya.</p>
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

exports.content_auditor = async(pengajuan) => {
    return `<html>
        ${head}
        <body>
            <div class="body">
                    <p>Salam Hangat,</p>
                    <p>Berdasarkan Penugasan Pimpinan Anda ditugaskan untuk menindaklanjuti ${pengajuan.status_proses.toLowerCase()} ${pengajuan.permohonan} ${pengajuan.nama_perusahaan}.</p>
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
    `
}