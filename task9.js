const Web3 = require("web3");
const { rpc_url1, tokenAddress, topic } = require("./utils.js");

const web3 = new Web3(new Web3.providers.WebsocketProvider(rpc_url1));

const main = (address, topic, startBlock, eventName) => {
  const subscription = web3.eth.subscribe(eventName, {
    fromBlock: startBlock,
    toBlock: "latest",
    address: address,
    topics: topic,
  });
  subscription.on("connected", function (subscriptionId) {
    console.log("subscriptionId: ", subscriptionId);
  });
  subscription
    .on("data", (event) => {
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
      console.log("Amount Tranfered", Number(Web3.utils.fromWei(data._amount)));
      console.log("Sender Address", data._from);
      console.log("Receiver Address", data._to);
    })
    .on("error", (err) => {
      console.log("error", err);
    });
};

main(tokenAddress, [topic], 9068671, "logs");
