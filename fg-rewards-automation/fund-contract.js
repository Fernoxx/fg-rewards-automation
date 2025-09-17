const { ethers } = require("ethers");
require("dotenv").config();

async function fundContract() {
    // Setup provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Connect to $FG token contract
    const fgTokenABI = [
        "function transfer(address to, uint256 amount) external returns (bool)",
        "function balanceOf(address account) external view returns (uint256)"
    ];
    
    const fgToken = new ethers.Contract(
        process.env.FG_TOKEN_ADDRESS,
        fgTokenABI,
        signer
    );
    
    console.log("💰 Funding contract with 30B $FG tokens...");
    
    // Transfer 30B $FG tokens to contract
    const amount = ethers.parseEther("30000000000"); // 30B tokens
    const tx = await fgToken.transfer(process.env.CONTRACT_ADDRESS, amount);
    await tx.wait();
    
    console.log("✅ Contract funded with 30B $FG tokens");
    console.log("📋 Transaction hash:", tx.hash);
}

fundContract().catch(console.error);