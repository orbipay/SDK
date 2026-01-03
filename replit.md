# OrbiPay App

## Overview

OrbiPay is a premium fintech dApp dashboard for creating and managing authorization-based virtual cards. The app provides a Web3-connected interface for creating virtual cards with custom spending limits, category restrictions, AI-powered fraud detection, and real-time activity tracking. The design follows a hybrid system combining Stripe dashboard clarity, Apple Card aesthetics, and modern crypto dApp UI patterns with glassmorphism effects.

**Key Features:**
- Solana-only wallet connection (Phantom, Solflare, etc.)
- Real SOL deposits with 48-hour processing period before card activation
- Create virtual cards with custom limits and security options
- Apple Card style gradient cards with holographic shine hover effect
- Freeze/unfreeze card functionality
- Delete disposable cards
- AI Fraud Shield simulation (auto-freezes high-risk cards)
- Transaction activity log (dummy data)
- Activity log tracking all card actions
- Dark/light theme toggle
- Data persistence via localStorage

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing:**
- React 18 with TypeScript as the core frontend framework
- Wouter for lightweight client-side routing
- Single-page application (SPA) structure with the main Dashboard as the primary route

**State Management:**
- Zustand for global application state with persistence middleware
- React Query (@tanstack/react-query) for server state and data fetching
- Local storage persistence for cards, transactions, and user preferences

**UI Component System:**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Class Variance Authority (CVA) for component variants
- Dark/light theme support with CSS custom properties

**Web3 Integration:**
- Solana Wallet Adapter for wallet connection (Phantom, Solflare, etc.)
- Solana Mainnet with Helius RPC for transactions
- Public Solana RPC for balance checking

**Design System:**
- Glassmorphism effects with backdrop-blur
- Premium fintech aesthetic (Stripe/Apple Card inspired)
- Responsive grid layouts with mobile-first approach
- Inter font family with JetBrains Mono for financial data

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- HTTP server with potential WebSocket support
- RESTful API structure (routes prefixed with /api)

**Development Server:**
- Vite for development with HMR (Hot Module Replacement)
- Custom middleware integration for dev/prod environments
- Static file serving for production builds

**Build System:**
- esbuild for server bundling
- Vite for client bundling
- Single build script that handles both client and server

### Data Storage

**Current Implementation:**
- In-memory storage using Zustand with localStorage persistence
- MemStorage class pattern for user operations

**Database Ready:**
- Drizzle ORM configured for PostgreSQL
- Database schema defined in shared/schema.ts
- Zod schemas for runtime validation
- drizzle-kit for database migrations (db:push script)

### Schema Design

The data model includes:
- Virtual Cards: type, limits, categories, status, risk level, card details
- Transactions: merchant, amount, category, status, timestamps
- Activity Logs: card actions (create, freeze, delete, fraud detection)
- Users: basic username/password authentication structure

## External Dependencies

### Web3 Services
- Solana Wallet Adapter: Wallet connection UI with Standard Wallet support
- Helius RPC: Secure Solana Mainnet transactions via backend proxy
- Solana Mainnet: Real SOL balance checking and transactions

### Database
- PostgreSQL via DATABASE_URL environment variable
- Drizzle ORM for type-safe database operations
- connect-pg-simple for session storage (available but not currently used)

### UI Libraries
- Radix UI: Full primitive component suite
- Recharts: Chart components for data visualization
- Embla Carousel: Carousel functionality
- Vaul: Drawer component
- React Day Picker: Calendar/date selection

### Development Tools
- Replit-specific plugins for dev banner and error overlay
- Cartographer plugin for Replit code navigation

### Fonts (CDN)
- Google Fonts: DM Sans, Geist Mono, Fira Code, Architects Daughter