import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

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

const DESIRED_ACCOUNT = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'; 

const Greeter: React.FC = () => {
  const [greeting, setGreeting] = useState<string>('');
  const [newGreeting, setNewGreeting] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    if (window.ethereum) {
      const provider = window.ethereum;
      try {
        await provider.request({ 
          method: 'eth_requestAccounts',
          params: [{ chainId: `0x${(31337).toString(16)}` }], 
        });
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);
        
        const networkIdBigInt = await web3Instance.eth.net.getId();
        const networkIdNumber = Number(networkIdBigInt); 
        
        if (networkIdNumber !== 31337) { 
          setError('Please switch to the Hardhat Network.');
          return;
        }
        
        const greeterContract = new web3Instance.eth.Contract(GREETER_ABI, GREETER_ADDRESS);
        setContract(greeterContract);

        
        if (greeterContract) {
          loadGreeting(greeterContract);
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
        setError('Error initializing Web3');
      }
    } else {
      setError('MetaMask is not installed or not connected.');
    }
  };

  const loadGreeting = async (contract: any) => {
    try {
      console.log('Attempting to load greeting...');
      const currentGreeting = await contract.methods.greet().call();
      console.log('Greeting loaded:', currentGreeting);
      setGreeting(currentGreeting);
    } catch (error) {
      console.error('Error fetching greeting:', error);
      setError('Error fetching greeting');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewGreeting(event.target.value);
  };

  const updateGreeting = async () => {
    if (!contract || accounts.length === 0) {
      setError('Contract or accounts not loaded');
      return;
    }
    setLoading(true);
    try {   
      console.log(accounts);  
      const selectedAccount = accounts.includes(DESIRED_ACCOUNT) ? DESIRED_ACCOUNT : accounts[0]; // you might need to transfer eth from imported account to initial account created in manual network
      await contract.methods.setGreeting(newGreeting).send({ from: selectedAccount });
      const updatedGreeting = await contract.methods.greet().call();
      setGreeting(updatedGreeting);
      setNewGreeting('');
    } catch (error) {
      console.error('Error updating greeting:', error);
      setError('Error updating greeting');
    } finally {
      setLoading(false);
    }
  };

  if (!web3) {
    return <div>Loading MetaMask...</div>;
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <h1 className="text-center mb-4">Greeter Contract</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="mb-4">
            <h2 className="mb-3">Current Greeting</h2>
            <div className="alert alert-primary" role="alert">
              {greeting}
            </div>
          </div>
          <Form>
            <Form.Group controlId="newGreeting">
              <Form.Label>New Greeting</Form.Label>
              <Form.Control
                type="text"
                value={newGreeting}
                onChange={handleChange}
                placeholder="Enter new greeting"
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={updateGreeting}
              disabled={loading}
              className="mt-3"
            >
              {loading ? 'Updating...' : 'Update Greeting'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Greeter;
