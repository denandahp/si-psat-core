const { PDFNet } = require('@pdftron/pdfnet-node');

const main = async() => {
    
    let filename = 'permohonan-15-15-12345.pdf'

    const pdfa = await PDFNet.PDFACompliance.createFromFile(true, filename, '', PDFNet.PDFACompliance.Conformance.e_Level1A);
    filename = 'pdfa.pdf';
    await pdfa.saveAsFromFileName(filename);
  };
  
  // add your own license key as the second parameter, e.g. in place of 'YOUR_LICENSE_KEY'.
  PDFNet.runWithCleanup(main, 'demo:1645969152158:7b10d4bd0300000000c7eac0487211ca90454ad31fe4efffab5fbe56bc').catch(function(error) {
    console.log('Error: ' + JSON.stringify(error));
  }).then(function(){ PDFNet.shutdown(); 
});
  
  