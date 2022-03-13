const Web3 = require("web3");
const { rpc_url1, tokenAddress, topic } = require("./utils.js");

const web3 = new Web3(new Web3.providers.WebsocketProvider(rpc_url1));
const holders = [];
const noOfHolders = [];

const main = (address, topic, startBlock) => {
  const subscription = web3.eth.subscribe("logs", {
    fromBlock: startBlock,
    toBlock: "latest",
    address: address,
    topics: topic,
  });
  subscription.on("connected", function (subscriptionId) {
    console.log("No of Holders", noOfHolders[noOfHolders.length - 1]);
  });
  subscription.on("data", (event) => {
    const data = web3.eth.abi.decodeLog(
      [
        {
          indexed: true,
          internalType: "address",
          name: "_from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      event.data,
      event.topics.slice(1)
    );
    holders.push(data._from);
    holders.push(data._to);
    noOfHolders.push([...new Set(holders)].length);
  });
};

main(tokenAddress, [topic], 9068671, "logs");
