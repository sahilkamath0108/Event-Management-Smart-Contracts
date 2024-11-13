const express = require("express");
const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

const app = express();

app.use(express.json());

const contractABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
    ],
    name: "buyTicket",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "date",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ticketCount",
        type: "uint256",
      },
    ],
    name: "createEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "eventOver",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "transferTicket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "events",
    outputs: [
      {
        internalType: "address",
        name: "organizer",
        type: "address",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "date",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ticketCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ticketRemain",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "showOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tickets",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const contractAddress = "0x32d39D5b60306B339fa4254D5366e8c01ae99180"; // Contract address from Ganache

const contract = new web3.eth.Contract(contractABI, contractAddress);

app.post("/buyTicket", async (req, res) => {
  const buyerPubKey = req.body.pubKey;
  const buyerPriKey = req.body.priKey;
  const _id = req.body._id;
  const quantity = req.body.quantity;
  const value = req.body.value;

  const nonce = await web3.eth.getTransactionCount(buyerPubKey);
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 6721975;
  const data = contract.methods.buyTicket(_id, quantity).encodeABI();

  const transaction = {
    nonce,
    gasPrice,
    gasLimit,
    to: contractAddress,
    value: value,
    data,
  };

  const signedTransaction = await web3.eth.accounts.signTransaction(
    transaction,
    buyerPriKey
  );
  const result = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  console.log(result);
  res.json(result);
});

app.post("/event", async (req, res) => {
  const _id = req.body._id;

  contract.methods
    .events(_id)
    .call()
    .then(async (result) => {
      console.log(result);
      res.json(result);
    });
});

app.post("/createEvent", async (req, res) => {
  const { name, date, price, ticketCount, organizerPubKey, organizerPriKey } = req.body;

  const nonce = await web3.eth.getTransactionCount(organizerPubKey);
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 6721975; // Adjust as necessary
  const data = contract.methods.createEvent(name, date, price, ticketCount).encodeABI();

  const transaction = {
    nonce,
    gasPrice,
    gasLimit,
    to: contractAddress,
    data,
  };

  const signedTransaction = await web3.eth.accounts.signTransaction(transaction, organizerPriKey);
  const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
  console.log(result);
  res.json(result);
});

app.post("/transferTicket", async (req, res) => {
  const { id, quantity, to, senderPubKey, senderPriKey } = req.body;

  const nonce = await web3.eth.getTransactionCount(senderPubKey);
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 6721975; // Adjust as necessary
  const data = contract.methods.transferTicket(id, quantity, to).encodeABI();

  const transaction = {
    nonce,
    gasPrice,
    gasLimit,
    to: contractAddress,
    data,
  };

  const signedTransaction = await web3.eth.accounts.signTransaction(transaction, senderPriKey);
  const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
  console.log(result);
  res.json(result);
});

app.post("/eventOver", async (req, res) => {
  const { id } = req.body;

  contract.methods.eventOver(id).call()
    .then(async (result) => {
      console.log(result);
      res.json(result);
    });
});

app.get("/showOwner", async (req, res) => {
  contract.methods.showOwner().call()
    .then(async (result) => {
      console.log(result);
      res.json(result);
    });
});

app.listen(3000, () => {
  console.log("The server is up and running at port 3000");
});
