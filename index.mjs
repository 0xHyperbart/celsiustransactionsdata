import fs from "fs";
import PDFParser from "pdf2json";

async function processPage(pageNumber, outputName) {
    return new Promise((resolve, reject) => {

        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataError", (errData) => {
            return console.error(errData.parserError);
        });

        pdfParser.on("pdfParser_dataReady", (pdfData) => {
            const texts = pdfData["Pages"][0]["Texts"];
            let currentY = 0;
            let line = "";
            let lineCount = 0;
            const lines = [];
            for (let i = 0; i < texts.length; i++) {
                const text = texts[i];

                if (currentY !== text.y) {
                    currentY = text.y;
                    lineCount++;
                    if (lineCount >= 4) {
                        const outputted = decodeURIComponent(line)
                        const lineArray = outputted.split("🟥");
                        lines.push(lineArray);
                        console.log(outputted);
                    }
                    line = "";
                }

                line += text.R[0].T + "🟥";
            }
            fs.writeFile(`./json/${outputName}.json`, JSON.stringify(lines, null, 2), (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });

        pdfParser.loadPDF(`./data/output_${pageNumber}.pdf`);
    })
}
async function processCoinTransactionsPage(pageNumber) {
    for (let i = 47; i <= 14384; i++) {
        await processPage(i, "coin_transactions_page_" + (i - 46));
        console.log('processed page ' + i);
    }
}
processCoinTransactionsPage()

// first page of Coin Transactions - 47
// last page of Coin Transactions - 14384