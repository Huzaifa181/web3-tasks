const { tokenAddress, apiKey } = require("./utils.js");
const axios = require("axios");

const api = `https://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${tokenAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

async function main() {
  const res = await axios.get(api);

  console.log("Deployer : " + res.data.result[0].from);
}

main(tokenAddress);
