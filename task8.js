const Web3 = require("web3");
const Provider = require("@truffle/hdwallet-provider");
const {
  walletAddress,
  currentBlockNum,
  senderPrivateKey,
  rpc_url,
} = require("./utils");

const provider = new Provider(senderPrivateKey, rpc_url);
const web3Provider = new Web3(provider);

async function getTransactionofAddress() {
  console.log("currentBlockNum", currentBlockNum);
  let txFound = false;
  while (currentBlockNum >= 0 && !txFound) {
    const block = await web3Provider.eth.getBlock(currentBlockNum, true);
    const transact = block.transactions;
    for (let j = 0; j < transact.length; j++) {
      if (transact[j] != null) {
        const receipt = await web3Provider.eth.getTransaction(transact[j].hash);
        if (receipt.from.toLowerCase() == walletAddress.toLowerCase()) {
          txFound = true;
          console.log(`Transaction: ${transact[j].from}`);
          break;
        }
      }
    }

    console.log("currentBlockNum--", currentBlockNum);
  }
}

getTransactionofAddress();
