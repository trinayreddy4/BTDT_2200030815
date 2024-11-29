const contractAddress = "0xd79Fbe3De5f9fcEe8e34741555D5c35D14772CFc";
const contractABI =[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_ratePerUnit",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "unitsUsed",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "billAmount",
				"type": "uint256"
			}
		],
		"name": "BillGenerated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "previousReading",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "currentReading",
				"type": "uint256"
			}
		],
		"name": "generateBill",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "bills",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "previousReading",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "currentReading",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "unitsUsed",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "billAmount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBill",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "previousReading",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "currentReading",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "unitsUsed",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "billAmount",
						"type": "uint256"
					}
				],
				"internalType": "struct ElectricityBill.Bill",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
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
		"inputs": [],
		"name": "ratePerUnit",
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
];

  let web3;
  let contract;
  
  // Conversion rate: 1 Ether = INR_RATE Rupees
  const INR_RATE = 85000; // Example conversion rate, adjust as needed
  
  // Connect to MetaMask and the contract
  window.addEventListener('load', async () => {
      if (window.ethereum) {
          try {
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              web3 = new Web3(window.ethereum);
              contract = new web3.eth.Contract(contractABI, contractAddress);
          } catch (error) {
              console.error("User denied account access", error);
          }
      } else {
          alert("Please install MetaMask to use this DApp!");
      }
  });
  
  // Generate bill function
  async function generateBill() {
    const accounts = await web3.eth.getAccounts(); // Get user accounts
    const prevReading = document.getElementById("prevReading").value;
    const currReading = document.getElementById("currReading").value;

    // Validation: Ensure both readings are provided
    if (!prevReading || !currReading) {
        alert("Please enter valid readings.");
        return;
    }

    try {
        // Generate the bill on the blockchain
		alert(accounts);
        await contract.methods.generateBill(prevReading, currReading)
            .send({ from: accounts[0] });

        // Retrieve the bill details from the contract
        const bill = await contract.methods.getBill().call({ from: accounts[0] });
        
        console.log("Raw Bill Amount (in Wei):", bill.billAmount); // Debugging log

        // Convert Wei to Ether
        const billInEther = parseFloat(web3.utils.fromWei(bill.billAmount.toString(), 'ether'));
        console.log("Bill in Ether:", billInEther); // Debugging log

        // Convert Ether to Rupees
        const billInRupees = (billInEther * INR_RATE).toFixed(2);
        console.log("Bill in Rupees:", billInRupees); // Debugging log

        // Update the UI with bill details
        document.getElementById("billDetails").innerHTML = `
            Units Used: ${bill.unitsUsed}<br>
            Bill in Ether: ${billInEther.toFixed(10)} Ether<br>
            Bill in Rupees: ₹${billInRupees}
        `;
    } catch (error) {
        console.error("Error generating bill:", error); // Log any errors
    }
}