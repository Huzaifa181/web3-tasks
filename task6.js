const Web3 = require("web3");
const { rpc_url, txHash } = require("./utils.js");

const web3 = new Web3(rpc_url);
const main = async (txHash) => {
  const res = await web3.eth.getTransaction(txHash);

  const data = web3.eth.abi.decodeParameters(
    [
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" },
    ],
    res.input.slice(10, res.input.length)
  );

  console.log("Receiver Address", data._to);
  console.log("Amount of tokens", data._amount);
};

main(txHash);
