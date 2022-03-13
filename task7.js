const Web3 = require("web3");
const {
  rpc_url,
  senderPrivateKey,
  receiverAddress,
  senderAddress,
  tokenAddress,
  apiKey,
} = require("./utils.js");
const axios = require("axios");
const Provider = require("@truffle/hdwallet-provider");
const { exit } = require("process");

const fetchAbi = async (api) => {
  try {
    const response = await axios.get(api);
    console.log("response", response);
    return response;
  } catch (err) {
    console.log("err", err);
  }
};
const provider = new Provider(senderPrivateKey, rpc_url);
const web3 = new Web3(provider);
const api = `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${tokenAddress}&apikey=${apiKey}`;

const main = async () => {
  const response = await fetchAbi(api);
  let contractABI = response.data.result;
  var abi = JSON.parse(contractABI);
  const contract = new web3.eth.Contract(abi, tokenAddress);
  await transfer(contract);
};

async function transfer(contract) {
  contract.methods
    .transfer(receiverAddress, web3.utils.toWei(web3.utils.toBN(1), "ether"))
    .send({ from: senderAddress, gasPrice: 100 })
    .on("transactionHash", (hash) => {
      console.log("transaction hash: " + hash);
      speedUpTransfer();
    })
    .on("confirmation", async function (confirmationNumber) {
      if (confirmationNumber === 3) {
        console.log("Successfully transfered");
        exit(0);
      }
    })
    .on("error", (err) => {
      console.log(err);
    });
}

async function speedUpTransfer() {
  contract.methods
    .transfer(receiverAddress, web3.utils.toWei(web3.utils.toBN(1), "ether"))
    .send({
      from: senderAddress,
      nonce: await web3.eth.getTransactionCount(senderAddress),
    })
    .on("transactionHash", (hash) => {
      console.log("transaction hash: " + hash);
    })
    .on("confirmation", async function (confirmationNumber) {
      if (confirmationNumber === 3) {
        console.log("Successfully transfered");
        exit(0);
      }
    })
    .on("error", (err) => {
      console.log(err);
    });
}

main();
