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

const Greeter: React.FC = () => {
  const [greeting, setGreeting] = useState<string>('');
  const [newGreeting, setNewGreeting] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadGreeting = async () => {
      const web3 = new Web3('http://127.0.0.1:8545');
      const greeterContract = new web3.eth.Contract(GREETER_ABI, GREETER_ADDRESS);

      try {
        const currentGreeting = await greeterContract.methods.greet().call() as string;
        setGreeting(currentGreeting);
      } catch (error) {
        console.error('Error fetching greeting:', error);
        setError('Error fetching greeting');
      }
    };

    loadGreeting();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewGreeting(event.target.value);
  };

  const updateGreeting = async () => {
    setLoading(true);
    const web3 = new Web3('http://127.0.0.1:8545');
    const accounts = await web3.eth.getAccounts();
    const greeterContract = new web3.eth.Contract(GREETER_ABI, GREETER_ADDRESS);

    try {
      await greeterContract.methods.setGreeting(newGreeting).send({ from: accounts[0] });

      const updatedGreeting = await greeterContract.methods.greet().call() as string;
      setGreeting(updatedGreeting);
      setNewGreeting(''); 
    } catch (error) {
      console.error('Error updating greeting:', error);
      setError('Error updating greeting');
    } finally {
      setLoading(false);
    }
  };

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
