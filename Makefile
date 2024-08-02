# Start a local Ethereum node using Hardhat
launch-local-eth-node:
	cd hardhat && npx hardhat node

# Compile and deploy the Greeter smart contract
compile-and-deploy-greeter-smart-contract:
	cd hardhat && npx hardhat compile && npx hardhat run ./scripts/deploy.ts --network localhost

# Start the React application
start-react-app:
	cd web3-sample-dapp && npm start
	echo "Visit http://localhost:3000 to see the app"
