
const puppeteer = require('puppeteer');
const date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });


async function asyncCall() {
  let pdf;

    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true,
            timeout: 0
        });
        const page = await browser.newPage();

        await page.emulateMediaType('screen');
	html =  "template_pdf/OSS_PL.html"
	outputPath = "test.pdf"
        await page.setContent(html, {
            waitUntil: 'networkidle0'
        });

        pdf = await page.pdf({
            path: outputPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: "50px",
                bottom: "50px"
            }
        });
//const pdfBuffer = await page.pdf(pdfConfig);
        await browser.close();
        console.log("Download finished"); //Added this to debug that it finishes correctly

    } catch (e) {
        console.error(e);
    }
}

asyncCall();

