const fs = require('fs')

const lines = [];
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

    lines.push(JSON.stringify({
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
    }));
  }
}

var stream = fs.createWriteStream("json-pass-4/db.json", {flags:'w'});
stream.write("[")
for(let i = 0; i < lines.length; i++) {
    const lineEnding = i === lines.length - 1 ? "" : ",\n"
    stream.write(lines[i] + lineEnding)
}
stream.write("]")
stream.end();

