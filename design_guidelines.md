# OrbiPay App - Design Guidelines

## Design Approach
**Hybrid System: Premium Fintech + Glassmorphism**
- Primary inspiration: Stripe dashboard clarity + Apple Card aesthetics + modern crypto dApp UI (Uniswap/Rainbow)
- Core principle: Trust through clarity - financial data must be immediately scannable while maintaining premium feel
- Glass UI treatment for elevated components (cards, modals, panels)

## Typography
**Font Stack:**
- Primary: Inter (via Google Fonts CDN) - weights 400, 500, 600, 700
- Monospace: JetBrains Mono - for card numbers, transaction IDs, wallet addresses

**Hierarchy:**
- Dashboard title: text-3xl font-bold
- Section headers: text-xl font-semibold
- Card names: text-lg font-medium
- Body/labels: text-sm font-medium
- Helper text: text-xs font-normal
- Transaction amounts: text-2xl font-bold (monospace)

## Layout System
**Spacing primitives:** Tailwind units 2, 4, 6, 8, 12, 16
- Component padding: p-6 to p-8
- Section gaps: gap-6 to gap-8
- Card spacing: space-y-4
- Form field gaps: gap-4

**Grid Structure:**
- Desktop dashboard: 2-column layout (sidebar 280px + main flex-1)
- Cards grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Form: Single column max-w-2xl

## Component Library

### Dashboard Layout
**Top Navigation Bar:**
- Fixed header with backdrop-blur-xl glass effect
- Left: OrbiPay logo + app name
- Center: Total balance display (large, prominent)
- Right: Wallet connect button (RainbowKit) + chain selector icons

**Sidebar (Desktop):**
- Glass panel with border
- Navigation items: Dashboard, Cards, Transactions, Settings
- Bottom: Wallet info card (address, network, disconnect)

**Main Content:**
- Container max-w-7xl with px-6 py-8
- Hero section: Balance overview + quick actions (h-auto, natural height)
- Card grid section below
- Activity log in right rail (lg:grid-cols-3 layout with 2-column cards + 1-column log)

### Virtual Card Component
**Card Display (Apple Card Style):**
- Aspect ratio 1.586:1 (credit card standard)
- Gradient background with mesh pattern overlay
- Rounded-2xl corners with shadow-2xl
- Holographic shine: pseudo-element with radial gradient following cursor (transform on hover)
- Top-left: Card name (text-lg font-semibold)
- Center: Hidden card number (•••• •••• •••• 1234) in monospace
- Bottom-left: Expiry date
- Bottom-right: VISA/Mastercard logo (small, 40px width)
- Top-right: Status badge (Active/Frozen) with dot indicator
- Card actions: Hover overlay with freeze/edit/delete icons

**Glass Effect Formula:**
```
backdrop-blur-xl bg-white/10 border border-white/20
shadow-xl shadow-black/10
```

### Create Card Form
**Layout:**
- Modal overlay (fixed inset-0 backdrop-blur-sm)
- Form container: max-w-2xl centered, glass panel
- Sections separated by divider lines

**Form Structure:**
1. Card Details (Card Name input + Type selector with radio buttons)
2. Spending Limits (2-column grid: daily + per-transaction with currency prefix)
3. Categories (checkbox grid - 2 columns on desktop, icon + label for each)
4. Security Options (toggle switches with descriptions)
5. Expiry Date (date picker with calendar icon)
6. Action buttons (Cancel + Create Card)

**Input Styling:**
- Glass backgrounds with subtle borders
- Focus state: border glow effect (ring-2)
- Labels above inputs with text-sm font-medium
- Helper text below in muted style

### Transaction Activity Log
**List Layout:**
- Reverse chronological cards
- Each transaction: flex between merchant + amount
- Icon (category badge) + merchant name + timestamp
- Amount in monospace (color based on type)
- Dividers between items
- Max height with scroll (max-h-96 overflow-y-auto)

### Alert Banners (AI Fraud Shield)
**Risk Alert:**
- Top of dashboard, full-width
- Red/amber gradient with icon
- Text: "High risk detected on [Card Name]" + action button
- Dismissable with X button

### Wallet Connect
**Multi-chain Selector:**
- Horizontal button group
- EVM button (enabled, RainbowKit integration)
- Solana button (disabled state with "Coming Soon" tooltip)
- Icons: Chain logos from crypto-icons CDN

## Icons
**Library:** Heroicons (outline for UI, solid for status)
- Use via CDN script tag
- Standard sizes: w-5 h-5 for inline, w-6 h-6 for prominent

## Images
No hero images required. This is a dashboard application focused on functionality. All visual interest comes from:
- Gradient card designs
- Glass UI effects
- Chain/card brand logos (small utility images)

## Interactions
**Minimal animations:**
- Card hover: subtle scale (scale-105) + shadow increase
- Holographic shine: gradient transform on mousemove
- Toggle switches: smooth transition
- Form validation: shake animation on error
- Success states: check icon fade-in

**No scroll-triggered or complex animations** - keep interface snappy and professional.

## Accessibility
- All interactive elements have focus-visible states with ring
- Form inputs have associated labels
- Toggle switches include aria-labels
- Sufficient contrast on glass backgrounds (ensure text readability)
- Keyboard navigation support for all actions