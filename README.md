# Transaction Simulator

A Solana transaction simulator built with Next.js that allows you to preview and analyze the effects of transactions before execution.

## Features

- 🔍 **Transaction Simulation** - Simulate Solana transactions without executing them
- 💰 **Balance Change Preview** - See token balance changes for wallets involved
- 🎨 **Token Visualization** - Visual display of tokens with logos and metadata
- 📊 **Buy/Sell Analysis** - Clear categorization of token acquisitions and disposals
- 🛡️ **Error Handling** - Comprehensive error reporting for failed simulations

## Tech Stack

- **Framework**: Next.js 15.4.6 with TypeScript
- **Blockchain**: Solana Web3.js & SPL Token
- **UI**: Tailwind CSS, Radix UI components
- **Icons**: Lucide React
- **Package Manager**: Bun

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/shivaji43/transaction-simulator.git
   cd transaction-simulator
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Add your RPC_URL
   ```

4. **Run the development server**
   ```bash
   bun dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Paste your serialized Solana transaction into the text area
2. Click "Simulate Transaction" to preview the effects
3. Review the balance changes for all affected wallets
4. Analyze token acquisitions (buying) and disposals (selling)

## API Endpoints

- `POST /api/simulate` - Simulate a serialized transaction

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
