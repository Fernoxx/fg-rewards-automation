const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function deployContract() {
    // Setup provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log("🚀 Deploying contract...");
    console.log("📝 Deployer address:", signer.address);
    console.log("💰 Balance:", ethers.formatEther(await provider.getBalance(signer.address)));
    
    // Load contract artifacts
    const contractPath = path.join(__dirname, "artifacts", "contracts", "FGRewardsAutomation.sol", "FGRewardsAutomation.json");
    
    if (!fs.existsSync(contractPath)) {
        console.error("❌ Contract artifacts not found. Please run 'npm run compile' first.");
        process.exit(1);
    }
    
    const contractArtifact = JSON.parse(fs.readFileSync(contractPath, "utf8"));
    const contractABI = contractArtifact.abi;
    const contractBytecode = contractArtifact.bytecode;
    
    // Create contract factory
    const contractFactory = new ethers.ContractFactory(
        contractABI,
        contractBytecode,
        signer
    );
    
    // Deploy contract
    const contract = await contractFactory.deploy(
        process.env.FG_TOKEN_ADDRESS, // $FG token address
        process.env.GELATO_OPS_ADDRESS, // Gelato Ops address
        signer.address // Initial owner
    );
    
    await contract.waitForDeployment();
    
    console.log("✅ Contract deployed to:", await contract.getAddress());
    console.log("📋 Save this address to your .env file as CONTRACT_ADDRESS");
    
    return await contract.getAddress();
}

deployContract().catch(console.error);