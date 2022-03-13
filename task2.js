const {
  senderPrivateKey,
  senderAddress,
  rpc_url,
  receiverAddress,
  tokenAddress,
  apiKey,
} = require("./utils.js");
const Web3 = require("web3");
const Provider = require("@truffle/hdwallet-provider");
const { exit } = require("process");
const axios = require("axios");

const fetchAbi = async (api) => {
  try {
    const response = await axios.get(api);
    console.log("response", response.data.result);
    return response;
  } catch (err) {
    console.log("err", err);
  }
};

const provider = new Provider(senderPrivateKey, rpc_url);
var web3 = new Web3(provider);
var api = `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${tokenAddress}&apikey=${apiKey}`;

const main = async () => {
  const response = await fetchAbi(api);
  let contractABI = response.data.result;
  var abi = JSON.parse(contractABI);
  const contract = new web3.eth.Contract(abi, tokenAddress);
  // balanceOf(contract);
  // approve(contract);
  // transfer(contract);
  // transferFrom(contract);
};

async function balanceOf(contract) {
  console.log(
    web3.utils.fromWei(await contract.methods.balanceOf(senderAddress).call()) +
      " Eth"
  );
}

async function approve(contract) {
  contract.methods
    .approve(receiverAddress, web3.utils.toWei(web3.utils.toBN(1), "ether"))
    .send({ from: senderAddress })
    .on("transactionHash", (hash) => {
      console.log("transaction hash: " + hash);
    })
    .on("confirmation", async function (confirmationNumber) {
      if (confirmationNumber === 3) {
        console.log("Successfully approve");
        exit(0);
      }
    })
    .on("error", (err) => {
      console.log(err);
    });
}

async function transfer(contract) {
  contract.methods
    .transfer(receiverAddress, web3.utils.toWei(web3.utils.toBN(1), "ether"))
    .send({ from: senderAddress })
    .on("transactionHash", (hash) => {
      console.log("transaction hash: " + hash);
    })
    .on("confirmation", async function (confirmationNumber) {
      if (confirmationNumber == 3) {
        console.log("Transfered Successfully");
        exit(0);
      }
    })
    .on("error", (err) => {
      console.log(err);
    });
}

async function allowance() {
  console.log(
    await contract.methods.allowance(senderAddress, receiverAddress).call()
  );
}

async function transferFrom(contract) {
  contract.methods
    .transferFrom(
      senderAddress,
      receiverAddress,
      web3.utils.toWei(web3.utils.toBN(1), "ether")
    )
    .send({ from: receiverAddress })
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
