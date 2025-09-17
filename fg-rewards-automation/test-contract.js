const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function testContract() {
    // Setup provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Load contract artifacts
    const contractPath = path.join(__dirname, "artifacts", "contracts", "FGRewardsAutomation.sol", "FGRewardsAutomation.json");
    
    if (!fs.existsSync(contractPath)) {
        console.error("❌ Contract artifacts not found. Please run 'npm run compile' first.");
        process.exit(1);
    }
    
    const contractArtifact = JSON.parse(fs.readFileSync(contractPath, "utf8"));
    const contractABI = contractArtifact.abi;
    
    const contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        contractABI,
        signer
    );
    
    console.log("🧪 Testing contract...");
    
    // Test 1: Check holder count
    const holderCount = await contract.getHolderCount();
    console.log("📊 Current holder count:", holderCount.toString());
    
    // Test 2: Add test holders (addresses with 1M+ $FG tokens)
    const testHolders = [
        "0x1234567890123456789012345678901234567890", // Replace with real addresses
        "0x2345678901234567890123456789012345678901"
    ];
    
    console.log("➕ Adding test holders...");
    const tx = await contract.batchAddHolders(testHolders);
    await tx.wait();
    console.log("✅ Test holders added");
    
    // Test 3: Check holder info
    const holderInfo = await contract.getHolderInfo(testHolders[0]);
    console.log("👤 Holder info:", holderInfo);
    
    console.log("🎉 Contract test complete!");
}

testContract().catch(console.error);