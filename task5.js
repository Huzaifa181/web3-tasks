const Web3 = require("web3");
const { rpc_url, txHash } = require("./utils.js");
const web3 = new Web3(rpc_url);

const main = async (txHash) => {
  const res = await web3.eth.getTransactionReceipt(txHash);
  if (res.status) {
    console.log("transaction is confirmed");
    let trasactionFee =
      web3.utils.fromWei(web3.utils.toBN(res.effectiveGasPrice), "ether") *
      res.gasUsed;
    console.log("Transaction Fee In Eth : ", trasactionFee);
  } else {
    console.log("transaction is failed");
  }
};

main(txHash);
