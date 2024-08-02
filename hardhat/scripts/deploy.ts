import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
  
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, Hardhat!");
  
    console.log("Greeter deployed to:", greeter.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
