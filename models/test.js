const puppeteer = require('puppeteer');
const date = new Date(Date.now());
date.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });


(async () => {
//     const browser =  await puppeteer.launch();
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium-browser',
args: ['--no-sandbox'],
            headless: true,
            timeout: 0
})  
  const page =  await browser.newPage();

     page.setContent("template_pdf/OSS_PL.html");
    console.log("hai.pdf")

    // await page.emulateMedia('screen');
    const pdfConfig = {
        path: "hai.pdf", // Saves pdf to disk. 
        format: 'A4',
        printBackground: true,
        margin: { // Word's default A4 margins
            top: '2.54cm',
            bottom: '2.54cm',
            left: '2.54cm',
            right: '2.54cm'
        }
    };
    const pdfBuffer =  await page.pdf(pdfConfig);

     await page.close();
    await browser.close();
})();
   

