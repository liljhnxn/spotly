import hre from "hardhat";
const { ethers, network } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("----------------------------------------------------");
  console.log("Deploying Spotly Smart Contract...");
  console.log(`Network: ${network.name} (Chain ID: ${(await ethers.provider.getNetwork()).chainId})`);

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} native currency`);

  const SpotlyFactory = await ethers.getContractFactory("Spotly");
  const spotly = await SpotlyFactory.deploy();
  await spotly.waitForDeployment();

  const contractAddress = await spotly.getAddress();
  console.log(`\n🎉 Spotly successfully deployed to: ${contractAddress}`);
  console.log(`View on Explorer: https://scan.bohr.life/address/${contractAddress}`);
  console.log("----------------------------------------------------");

  // Save the address to src/contracts/deployedAddress.json for seamless frontend pickup
  const contractsDir = path.join(process.cwd(), "src", "contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  const deploymentData = {
    address: contractAddress,
    network: network.name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
  };

  fs.writeFileSync(
    path.join(contractsDir, "deployedAddress.json"),
    JSON.stringify(deploymentData, null, 2)
  );
  console.log("Saved deployment metadata to src/contracts/deployedAddress.json");

  // Update .env.local
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf-8");
    if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    fs.writeFileSync(envPath, envContent);
    console.log("Updated NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local");
  }
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});

