const Web3 = require("web3");
const Provider = require("@truffle/hdwallet-provider");
const { exit } = require("process");
const {
  senderPrivateKey,
  senderAddress,
  rpc_url,
  receiverAddress,
} = require("./utils.js");

const provider = new Provider(senderPrivateKey, rpc_url);
const web3 = new Web3(provider);
const main = async () => {
  let senderBalanceBeforeTransaction = await web3.eth.getBalance(senderAddress);
  console.log("senderBalanceBeforeTransaction", senderBalanceBeforeTransaction);
  let receiverBalanceBeforeTransaction = await web3.eth.getBalance(
    receiverAddress
  );
  console.log(
    "receiverBalanceBeforeTransaction",
    receiverBalanceBeforeTransaction
  );
  web3.eth
    .sendTransaction({
      to: receiverAddress,
      from: senderAddress,
      value: web3.utils.toWei("1", "ether"),
    })
    .on("transactionHash", (hash) => {
      console.log("transferring....");
      console.log("transaction hash: " + hash);
    })
    .on("confirmation", async (confirmationNo) => {
      if (confirmationNo == 1) {
        console.log("transfer successfully", confirmationNo);
        let senderBalanceAfterTransaction = await web3.eth.getBalance(
          senderAddress
        );
        console.log(
          "senderBalanceAfterTransaction",
          senderBalanceAfterTransaction
        );
        let receiverBalanceAfterTransaction = await web3.eth.getBalance(
          receiverAddress
        );
        console.log(
          "receiverBalanceAfterTransaction",
          receiverBalanceAfterTransaction
        );
        exit(0);
      }
    })
    .on("error", (error) => {
      console.log(error);
    });
};

main();
