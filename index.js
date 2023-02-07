const express = require("express");
const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:7545');

const app = express();


app.use(express.json());

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			}
		],
		"name": "buyTicket",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ticketCount",
				"type": "uint256"
			}
		],
		"name": "createEvent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "transferTicket",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "events",
		"outputs": [
			{
				"internalType": "address",
				"name": "organizer",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ticketCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ticketRemain",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "showOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tickets",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; // Contract ABI from Remix

const contractAddress = '0x9ceeF1E5FeC9E6b3C13aA1Cbf80A08750Fcd28C8'; // Contract address from Ganache

const contract = new web3.eth.Contract(contractABI, contractAddress);



app.post("/buyTicket", async (req, res) => {
    const buyerPubKey = req.body.pubKey
    const buyerPriKey = req.body.priKey
    const _id = req.body._id
    const quantity = req.body.quantity
    const value = req.body.value

//     const method = contract.methods.buyTicket(_id, quantity);
// const encodedABI = method.encodeABI();

// const transaction = {
//   from: buyerPubKey,
//   to: contractAddress,
//   gas: 1000000,
//   gasPrice: '30000000000',
//   data: encodedABI,
//   value: value
// };

// const signedTransaction = await web3.eth.accounts.signTransaction(transaction, buyerPriKey);

// const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
// console.log(receipt);

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
    data
  };

  const signedTransaction = await web3.eth.accounts.signTransaction(transaction, buyerPriKey);
  const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
  console.log(result);
  res.json(result)


    // contract.methods.buyTicket(_id,quantity).call().then(async(result)  => {
    //     console.log(result);
    //     res.json(result)
    //   });



})

app.post("/event", async (req,res) => {
    const _id = req.body._id

    contract.methods.events(_id).call().then(async(result)  => {
        console.log(result);
        res.json(result)
      });
})




app.listen(3000 , ()=>{
    console.log('The server is up and running at port 3000');
  });