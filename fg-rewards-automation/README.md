# FG Rewards Automation

A complete Gelato automation setup for FG Token rewards distribution on Base network.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- A wallet with ETH for gas fees
- FG tokens for funding the contract

### Installation

1. **Clone and setup the project:**
   ```bash
   git clone <your-repo>
   cd fg-rewards-automation
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Deploy your contract:**
   ```bash
   npm run deploy
   ```

4. **Fund the contract with FG tokens:**
   ```bash
   npm run fund
   ```

5. **Setup Gelato automation:**
   ```bash
   npm run gelato
   ```

6. **Test the contract:**
   ```bash
   npm run test
   ```

## 📁 Project Structure

```
fg-rewards-automation/
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies and scripts
├── deploy.js               # Contract deployment script
├── fund-contract.js        # Contract funding script
├── create-gelato-automation.js # Gelato automation setup
├── test-contract.js        # Contract testing script
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Your wallet private key (keep this secure!)
PRIVATE_KEY=your_private_key_here

# Base mainnet RPC URL
RPC_URL=https://mainnet.base.org

# FG Token contract address on Base
FG_TOKEN_ADDRESS=0x946A173Ad73Cbb942b9877E9029fa4c4dC7f2B07

# Gelato Ops contract address on Base
GELATO_OPS_ADDRESS=0x527a819db1eb0e34426297b03bae11F2f8B3A19E

# Your deployed contract address (will be filled after deployment)
CONTRACT_ADDRESS=your_deployed_contract_address
```

## 📋 Available Scripts

- `npm run deploy` - Deploy the contract to Base network
- `npm run fund` - Fund the contract with 30B FG tokens
- `npm run gelato` - Setup Gelato automation
- `npm run test` - Test contract functionality

## ⚠️ Important Notes

1. **Contract Compilation**: Before deploying, you need to compile your Solidity contract to get the ABI and bytecode. Update the `contractABI` and `contractBytecode` variables in `deploy.js`.

2. **Security**: Never commit your private key to version control. Keep your `.env` file secure.

3. **Gas Fees**: Ensure your wallet has sufficient ETH for gas fees during deployment and automation setup.

4. **Token Balance**: Make sure you have enough FG tokens to fund the contract (30B tokens as specified in the funding script).

## 🔗 Useful Links

- [Gelato Network](https://app.gelato.network/)
- [Base Network](https://base.org/)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [Gelato Automate SDK](https://docs.gelato.network/automate-sdk)

## 🆘 Troubleshooting

### Common Issues

1. **"Contract not deployed"**: Make sure you've run `npm run deploy` and updated the `CONTRACT_ADDRESS` in your `.env` file.

2. **"Insufficient funds"**: Check that your wallet has enough ETH for gas fees and FG tokens for funding.

3. **"Invalid private key"**: Ensure your private key in `.env` is correct and doesn't include the `0x` prefix.

4. **"Gelato SDK errors"**: Make sure you're using the correct Gelato Ops address for Base network.

## 📞 Support

For issues and questions:
- Check the [Gelato Documentation](https://docs.gelato.network/)
- Join the [Gelato Discord](https://discord.gg/gelato)
- Review the [Base Network Documentation](https://docs.base.org/)