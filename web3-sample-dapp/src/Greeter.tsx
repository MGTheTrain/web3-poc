import React, { useState, useEffect } from 'react';
import Web3 from 'web3';


const GREETER_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "greet",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_greeting",
        "type": "string"
      }
    ],
    "name": "setGreeting",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const GREETER_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const Greeter: React.FC = () => {
  const [greeting, setGreeting] = useState<string>('');
  const [newGreeting, setNewGreeting] = useState<string>('');

  useEffect(() => {
    const loadGreeting = async () => {
      const web3 = new Web3('http://127.0.0.1:8545'); 
      const greeterContract = new web3.eth.Contract(GREETER_ABI, GREETER_ADDRESS);

      try {
        const currentGreeting = await greeterContract.methods.greet().call() as string;
        setGreeting(currentGreeting);
      } catch (error) {
        console.error('Error fetching greeting:', error);
      }
    };

    loadGreeting();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewGreeting(event.target.value);
  };

  const updateGreeting = async () => {
    const web3 = new Web3('http://127.0.0.1:8545');
    const accounts = await web3.eth.getAccounts();
    const greeterContract = new web3.eth.Contract(GREETER_ABI, GREETER_ADDRESS);

    try {
      await greeterContract.methods.setGreeting(newGreeting).send({ from: accounts[0] });

      const updatedGreeting = await greeterContract.methods.greet().call() as string;
      setGreeting(updatedGreeting);
    } catch (error) {
      console.error('Error updating greeting:', error);
    }
  };

  return (
    <div>
      <h1>Current Greeting: {greeting}</h1>
      <input type="text" value={newGreeting} onChange={handleChange} />
      <button onClick={updateGreeting}>Update Greeting</button>
    </div>
  );
};

export default Greeter;
