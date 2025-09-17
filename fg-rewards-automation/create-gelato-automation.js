const { GelatoAutomateSDK } = require("@gelatonetwork/automate-sdk");
const { ethers } = require("ethers");
require("dotenv").config();

async function createGelatoAutomation() {
    // Setup provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log("🔗 Creating Gelato automation...");
    console.log("📝 Signer address:", signer.address);
    
    // Initialize Gelato SDK
    const gelatoOps = new GelatoAutomateSDK({
        chainId: 8453, // Base mainnet
        signer: signer
    });
    
    console.log("✅ Gelato SDK initialized");
    
    // Create automation task
    const taskId = await gelatoOps.createTask({
        execAddress: process.env.CONTRACT_ADDRESS,
        execSelector: "0x00000000", // performUpkeep selector
        resolverAddress: process.env.CONTRACT_ADDRESS,
        resolverData: "0x00000000", // checkUpkeep selector
        feeToken: "0x0000000000000000000000000000000000000000", // ETH
        useTreasury: false
    });
    
    console.log("✅ Automation task created:", taskId);
    
    // Fund the task with 0.1 ETH
    console.log("💰 Funding task with 0.1 ETH...");
    await gelatoOps.depositFunds(taskId, ethers.parseEther("0.1"));
    console.log("✅ Task funded with 0.1 ETH");
    
    console.log("🎉 Automation setup complete!");
    console.log("📋 Task ID:", taskId);
    console.log("🔗 Monitor at: https://app.gelato.network/");
}

createGelatoAutomation().catch(console.error);