const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function setup() {
    console.log("🎯 FG Rewards Automation Setup");
    console.log("================================");
    
    // Check if .env file exists
    if (!fs.existsSync(".env")) {
        console.log("❌ .env file not found!");
        console.log("📋 Please copy .env.example to .env and fill in your values:");
        console.log("   cp .env.example .env");
        console.log("   # Then edit .env with your private key and other values");
        process.exit(1);
    }
    
    // Check if required environment variables are set
    const requiredVars = ["PRIVATE_KEY", "RPC_URL", "FG_TOKEN_ADDRESS", "GELATO_OPS_ADDRESS"];
    const missingVars = requiredVars.filter(varName => !process.env[varName] || process.env[varName] === `your_${varName.toLowerCase()}_here`);
    
    if (missingVars.length > 0) {
        console.log("❌ Missing required environment variables:");
        missingVars.forEach(varName => console.log(`   - ${varName}`));
        console.log("📋 Please update your .env file with the correct values");
        process.exit(1);
    }
    
    console.log("✅ Environment variables configured");
    
    // Test connection to Base network
    try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        
        console.log("🔗 Testing connection to Base network...");
        const balance = await provider.getBalance(signer.address);
        console.log(`✅ Connected! Wallet balance: ${ethers.formatEther(balance)} ETH`);
        
        if (balance === 0n) {
            console.log("⚠️  Warning: Your wallet has 0 ETH. You'll need ETH for gas fees.");
        }
        
    } catch (error) {
        console.log("❌ Failed to connect to Base network:", error.message);
        process.exit(1);
    }
    
    // Check if contract is compiled
    const contractPath = path.join(__dirname, "artifacts", "contracts", "FGRewardsAutomation.sol", "FGRewardsAutomation.json");
    if (!fs.existsSync(contractPath)) {
        console.log("📦 Compiling contract...");
        console.log("   Run: npm run compile");
        console.log("   Then run this setup again");
        process.exit(1);
    }
    
    console.log("✅ Contract compiled");
    
    // Check if contract is deployed
    if (!process.env.CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS === "your_deployed_contract_address") {
        console.log("📋 Next steps:");
        console.log("   1. Deploy contract: npm run deploy");
        console.log("   2. Update CONTRACT_ADDRESS in .env file");
        console.log("   3. Fund contract: npm run fund");
        console.log("   4. Setup Gelato: npm run gelato");
        console.log("   5. Test contract: npm run test");
    } else {
        console.log("✅ Contract address configured");
        
        // Test contract connection
        try {
            const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
            const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
            const contractArtifact = JSON.parse(fs.readFileSync(contractPath, "utf8"));
            const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractArtifact.abi, signer);
            
            const holderCount = await contract.getHolderCount();
            console.log(`✅ Contract connected! Current holders: ${holderCount}`);
            
        } catch (error) {
            console.log("❌ Failed to connect to contract:", error.message);
            console.log("📋 Please check your CONTRACT_ADDRESS in .env file");
        }
    }
    
    console.log("\n🎉 Setup complete! You're ready to use the FG Rewards Automation system.");
    console.log("\n📚 Available commands:");
    console.log("   npm run compile    - Compile the contract");
    console.log("   npm run deploy     - Deploy the contract");
    console.log("   npm run fund       - Fund the contract with FG tokens");
    console.log("   npm run gelato     - Setup Gelato automation");
    console.log("   npm run test       - Test the contract");
    console.log("   npm run setup      - Run this setup check");
}

setup().catch(console.error);