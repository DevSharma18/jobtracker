//  const PDFParser = require('pdf2json');

//   function extractText(filePath) {
//     return new Promise((resolve, reject) => {
//       const pdfParser = new PDFParser();

//       pdfParser.on('pdfParser_dataReady', (pdfData) => {
//         const text = pdfData.Pages.map(page =>
//           page.Texts.map(t => {
//             try {
//               return decodeURIComponent(t.R[0].T);
//             } catch {
//               return t.R[0].T;
//             }
//           }).join(' ')
//         ).join('\n');
//         resolve(text);
//       });

//       pdfParser.on('pdfParser_dataError', (err) => {
//         reject(err);
//       });

//       pdfParser.loadPDF(filePath);
//     });
//   }
//   module.exports = {extractText}

const {PDFParse} = require('pdf-parse')
const fs = require('fs')

async function extractText(filePath) {
  try {
    const parser = new PDFParse({url:filePath});
    const data = await parser.getText()

    return data.text;
  }catch(err){
    console.log(err);
  }

}
module.exports={extractText}
