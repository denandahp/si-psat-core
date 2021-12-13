const puppeteer = require('puppeteer');
const date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });


exports.pdf = async(html = "", filename) => {
//    const browser = await puppeteer.launch();
//    const page = await browser.newPage();
const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true,
            timeout: 0
        });
        const page = await browser.newPage();
    await page.setContent(html);

    // await page.emulateMedia('screen');
    const pdfConfig = {
        path: filename, // Saves pdf to disk. 
        format: 'A4',
        printBackground: true,
        margin: { // Word's default A4 margins
            top: '2.54cm',
            bottom: '2.54cm',
            left: '2.54cm',
            right: '2.54cm'
        }
    };
    const pdfBuffer = await page.pdf(pdfConfig);

    await page.close();
    await browser.close();

    return pdfBuffer;
}
