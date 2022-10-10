const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "csv-pass-4/db.csv",
  header: [
    { id: "username", name: "username" },
    { id: "username_joined", name: "username_joined" },
    { id: "address", name: "address" },
    { id: "date", name: "date" },
    { id: "account", name: "account" },
    { id: "type", name: "type" },
    { id: "descriptive_purpose", name: "descriptive_purpose" },
    { id: "coin", name: "coin" },
    { id: "coin_quantity", name: "coin_quantity" },
    { id: "coin_usd", name: "coin_usd" },
  ],
});

const records = [];
for (let i = 47; i <= 14384; i++) {
  const pageNum = i - 46;
  const page = require(`./json-pass-3/coin_transactions_${pageNum}.json`);
  for (let i = 0; i < page.length; i++) {
    const row = page[i];
    const {
      address,
      date,
      account,
      type,
      descriptivePurpose,
      coin,
      coinQuantity,
    } = row;
    const username = JSON.stringify(row.username);
    const username_joined = row.username.join(" ");
    const coinUSD = row.coinUSD || "";

    records.push({
      username,
      username_joined,
      address,
      date,
      account,
      type,
      descriptive_purpose: descriptivePurpose,
      coin,
      coin_quantity: coinQuantity,
      coin_usd: coinUSD,
    });
  }
}

csvWriter.writeRecords(records).then(() => {
  console.log("...Done");
});
