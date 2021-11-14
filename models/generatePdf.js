const puppeteer = require('puppeteer');
const date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });


exports.pdf = async(html = "") => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html);

    // await page.emulateMedia('screen')
    const pdfBuffer = await page.pdf();

    //await page.close();
    //await browser.close();

    return pdfBuffer;
}