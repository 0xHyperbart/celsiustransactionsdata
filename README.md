# Celsius Transactions Data

This is a repo which lets you build an indexable sqlite3 database of the coin transactions from the [Celsius court fillings](https://gizmodo.com/celsius-execs-cashed-out-bitcoin-price-crypto-ponzi-1849623526).

If all you want is to easily look up the data, you can simply use the [celsiustransactions.com](https://celsiustransactions.com/) website. 

## How to use
1. You will need `pdftk`
2. `yarn`
3. `cd data && pdftk celsius.pdf burst output output_%02d.pdf`
4. `make`

TODO: test that the above works.

## Contributing
Feel free to fill out an issue or open a PR.

## License
MIT License
