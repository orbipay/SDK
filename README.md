<p align="center">
  <img src="https://img.shields.io/badge/OrbiPay-Virtual%20Cards-blueviolet?style=for-the-badge&logo=creditcard" alt="OrbiPay" />
</p>

<h1 align="center">OrbiPay</h1>

<p align="center">
  <strong>Premium Virtual Card Management dApp for Solana</strong>
</p>

<p align="center">
  <a href="https://orbipay.org">Website</a> •
  <a href="https://x.com/orbipay_">Twitter</a> •
  <a href="https://github.com/orbipay_">GitHub</a> •
  <a href="https://t.me/orbipay_">Telegram</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Solana-Mainnet-9945FF?style=flat-square&logo=solana" alt="Solana" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwindcss" alt="Tailwind" />
</p>

---

## About

OrbiPay is a premium fintech dApp dashboard for creating and managing virtual cards with Web3 wallet integration. Built on Solana blockchain, it provides a seamless experience for managing virtual cards with custom spending limits, category restrictions, and AI-powered fraud detection.

## Features

- **Solana Wallet Integration** - Connect with Phantom, Solflare, and other Solana wallets
- **Virtual Card Creation** - Create unlimited virtual cards with custom limits
- **Real SOL Deposits** - Fund cards with real SOL (24-hour processing period)
- **Spending Controls** - Set daily and per-transaction limits
- **Category Restrictions** - Limit spending to specific categories
- **AI Fraud Shield** - Automatic fraud detection and card freezing
- **Active Period Scheduling** - Set custom activation dates for cards
- **Email Notifications** - Receive confirmation emails on card creation
- **Dark/Light Theme** - Beautiful UI with theme toggle
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| UI Components | shadcn/ui, Radix UI |
| State Management | Zustand, TanStack Query |
| Web3 | Solana Wallet Adapter, @solana/web3.js |
| Backend | Express.js, Node.js |
| Email | Resend |
| RPC | Helius |

## Installation

```bash
# Clone the repository
git clone https://github.com/orbipay_/orbipay.git

# Navigate to project directory
cd orbipay

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file with the following variables:

```env
HELIUS_API_KEY=your_helius_api_key
SESSION_SECRET=your_session_secret
```

## Project Structure

```
orbipay/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── lib/            # Utilities and stores
│   │   ├── pages/          # Page components
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express server
│   ├── routes.ts           # API routes
│   ├── resend.ts           # Email service
│   └── storage.ts          # Data storage
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Data models
└── package.json
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run db:push  # Push database schema
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Community

Join our community and stay updated:

<p align="center">
  <a href="https://orbipay.org">
    <img src="https://img.shields.io/badge/Website-orbipay.org-blueviolet?style=for-the-badge" alt="Website" />
  </a>
  <a href="https://x.com/orbipay_">
    <img src="https://img.shields.io/badge/Twitter-@orbipay__-1DA1F2?style=for-the-badge&logo=twitter" alt="Twitter" />
  </a>
  <a href="https://github.com/orbipay_">
    <img src="https://img.shields.io/badge/GitHub-orbipay__-181717?style=for-the-badge&logo=github" alt="GitHub" />
  </a>
  <a href="https://t.me/orbipay_">
    <img src="https://img.shields.io/badge/Telegram-orbipay__-26A5E4?style=for-the-badge&logo=telegram" alt="Telegram" />
  </a>
</p>

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with love by the <strong>OrbiPay Team</strong>
</p>
