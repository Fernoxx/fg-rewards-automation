const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying FGRewardsAutomation contract...");
  
  // Get the contract factory
  const FGRewardsAutomation = await hre.ethers.getContractFactory("FGRewardsAutomation");
  
  // Get the deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)));
  
  // Deploy the contract
  const fgRewardsAutomation = await FGRewardsAutomation.deploy(
    process.env.FG_TOKEN_ADDRESS, // FG token address
    process.env.GELATO_OPS_ADDRESS, // Gelato Ops address
    deployer.address // Initial owner
  );
  
  await fgRewardsAutomation.waitForDeployment();
  
  const contractAddress = await fgRewardsAutomation.getAddress();
  console.log("✅ FGRewardsAutomation deployed to:", contractAddress);
  console.log("📋 Save this address to your .env file as CONTRACT_ADDRESS");
  
  // Verify contract on BaseScan (optional)
  if (hre.network.name === "base") {
    console.log("⏳ Waiting for block confirmations...");
    await fgRewardsAutomation.deploymentTransaction().wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [
          process.env.FG_TOKEN_ADDRESS,
          process.env.GELATO_OPS_ADDRESS,
          deployer.address
        ],
      });
      console.log("✅ Contract verified on BaseScan");
    } catch (error) {
      console.log("⚠️ Contract verification failed:", error.message);
    }
  }
  
  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });