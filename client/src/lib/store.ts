import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  VirtualCard,
  InsertCard,
  Transaction,
  ActivityLog,
  RiskLevel,
  CardCategory,
} from "@shared/schema";

const CARD_GRADIENTS = [
  "from-slate-800 via-slate-700 to-slate-900",
  "from-violet-600 via-purple-600 to-indigo-700",
  "from-rose-500 via-pink-500 to-fuchsia-600",
  "from-emerald-500 via-teal-500 to-cyan-600",
  "from-amber-500 via-orange-500 to-red-500",
  "from-blue-600 via-indigo-600 to-purple-700",
  "from-zinc-700 via-neutral-600 to-stone-700",
];

const generateCardNumber = (): string => {
  const groups = [];
  for (let i = 0; i < 4; i++) {
    groups.push(
      Math.floor(1000 + Math.random() * 9000)
        .toString()
        .padStart(4, "0")
    );
  }
  return groups.join(" ");
};

const generateCVV = (): string => {
  return Math.floor(100 + Math.random() * 900).toString();
};

const generateRiskLevel = (): RiskLevel => {
  const random = Math.random();
  if (random < 0.7) return "low";
  if (random < 0.9) return "medium";
  return "high";
};

const MERCHANTS: { name: string; category: CardCategory }[] = [
  { name: "Amazon", category: "shopping" },
  { name: "Netflix", category: "subscriptions" },
  { name: "Steam", category: "gaming" },
  { name: "Uber", category: "travel" },
  { name: "Electric Co.", category: "utilities" },
  { name: "Spotify", category: "subscriptions" },
  { name: "Best Buy", category: "shopping" },
  { name: "PlayStation Store", category: "gaming" },
  { name: "Delta Airlines", category: "travel" },
  { name: "Water Utility", category: "utilities" },
  { name: "Target", category: "shopping" },
  { name: "Epic Games", category: "gaming" },
];

interface AppState {
  cards: VirtualCard[];
  transactions: Transaction[];
  activityLog: ActivityLog[];
  dummyBalance: number;
  walletConnected: boolean;
  walletAddress: string | null;
  selectedChain: "solana";
  fraudAlertDismissed: boolean;
  
  addCard: (card: InsertCard) => VirtualCard;
  deleteCard: (id: string) => void;
  toggleCardFreeze: (id: string) => void;
  updateCardLimits: (id: string, dailyLimit: number, perTransactionLimit: number) => void;
  simulateFraudCheck: () => void;
  dismissFraudAlert: () => void;
  connectWallet: (address: string, chain: "solana") => void;
  disconnectWallet: () => void;
  generateDummyTransactions: () => void;
  depositToCard: (cardId: string, amount: number, txSignature: string) => void;
  getCardBalance: (cardId: string) => number;
  isCardProcessing: (cardId: string) => boolean;
  clearExpiredProcessing: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      cards: [],
      transactions: [],
      activityLog: [],
      dummyBalance: 12847.53,
      walletConnected: false,
      walletAddress: null,
      selectedChain: "solana",
      fraudAlertDismissed: false,

      addCard: (insertCard: InsertCard) => {
        const cardId = crypto.randomUUID();
        const newCard: VirtualCard = {
          ...insertCard,
          id: cardId,
          cardNumber: generateCardNumber(),
          cvv: generateCVV(),
          status: "active",
          riskLevel: "low",
          createdAt: new Date().toISOString(),
          lastUsed: null,
          cardBrand: Math.random() > 0.5 ? "visa" : "mastercard",
          gradient: CARD_GRADIENTS[Math.floor(Math.random() * CARD_GRADIENTS.length)],
          solBalance: 0,
          depositAddress: null,
          deposits: [],
          processingUntil: null,
          activeFrom: insertCard.activeFrom || null,
          activeUntil: insertCard.activeUntil || null,
        };

        const logEntry: ActivityLog = {
          id: crypto.randomUUID(),
          cardId: newCard.id,
          cardName: newCard.name,
          action: "created",
          description: `Card "${newCard.name}" was created`,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          cards: [...state.cards, newCard],
          activityLog: [logEntry, ...state.activityLog],
        }));

        return newCard;
      },

      deleteCard: (id: string) => {
        const card = get().cards.find((c) => c.id === id);
        if (!card) return;

        const logEntry: ActivityLog = {
          id: crypto.randomUUID(),
          cardId: id,
          cardName: card.name,
          action: "deleted",
          description: `Card "${card.name}" was deleted`,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
          activityLog: [logEntry, ...state.activityLog],
        }));
      },

      toggleCardFreeze: (id: string) => {
        const card = get().cards.find((c) => c.id === id);
        if (!card) return;

        const newStatus = card.status === "frozen" ? "active" : "frozen";
        const action = newStatus === "frozen" ? "frozen" : "unfrozen";

        const logEntry: ActivityLog = {
          id: crypto.randomUUID(),
          cardId: id,
          cardName: card.name,
          action,
          description: `Card "${card.name}" was ${action}`,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, status: newStatus } : c
          ),
          activityLog: [logEntry, ...state.activityLog],
        }));
      },

      updateCardLimits: (id: string, dailyLimit: number, perTransactionLimit: number) => {
        const card = get().cards.find((c) => c.id === id);
        if (!card) return;

        const logEntry: ActivityLog = {
          id: crypto.randomUUID(),
          cardId: id,
          cardName: card.name,
          action: "limit_updated",
          description: `Card "${card.name}" limits updated: Daily $${dailyLimit}, Per-txn $${perTransactionLimit}`,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, dailyLimit, perTransactionLimit } : c
          ),
          activityLog: [logEntry, ...state.activityLog],
        }));
      },

      simulateFraudCheck: () => {
        const cards = get().cards.filter((c) => c.status === "active");
        if (cards.length === 0) return;

        const updatedCards = cards.map((card) => {
          const newRiskLevel = generateRiskLevel();
          return { ...card, riskLevel: newRiskLevel };
        });

        const highRiskCards = updatedCards.filter((c) => c.riskLevel === "high");

        const logEntries: ActivityLog[] = highRiskCards.map((card) => ({
          id: crypto.randomUUID(),
          cardId: card.id,
          cardName: card.name,
          action: "fraud_detected" as const,
          description: `High risk activity detected on "${card.name}" - Card frozen`,
          timestamp: new Date().toISOString(),
        }));

        set((state) => ({
          cards: state.cards.map((c) => {
            const updated = updatedCards.find((u) => u.id === c.id);
            if (updated) {
              return updated.riskLevel === "high"
                ? { ...updated, status: "frozen" as const }
                : updated;
            }
            return c;
          }),
          activityLog: [...logEntries, ...state.activityLog],
          fraudAlertDismissed: highRiskCards.length > 0 ? false : state.fraudAlertDismissed,
        }));
      },

      dismissFraudAlert: () => {
        set({ fraudAlertDismissed: true });
      },

      connectWallet: (address: string, chain: "solana") => {
        set({
          walletConnected: true,
          walletAddress: address,
          selectedChain: "solana",
        });
      },

      disconnectWallet: () => {
        set({
          walletConnected: false,
          walletAddress: null,
        });
      },

      generateDummyTransactions: () => {
        const cards = get().cards;
        if (cards.length === 0) return;

        const newTransactions: Transaction[] = [];
        const now = Date.now();

        for (let i = 0; i < 10; i++) {
          const card = cards[Math.floor(Math.random() * cards.length)];
          const merchantData = MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];
          const types: ("purchase" | "refund" | "authorization" | "declined")[] = [
            "purchase",
            "purchase",
            "purchase",
            "refund",
            "authorization",
            "declined",
          ];
          const type = types[Math.floor(Math.random() * types.length)];

          newTransactions.push({
            id: crypto.randomUUID(),
            cardId: card.id,
            cardName: card.name,
            type,
            amount: Math.round((Math.random() * 500 + 5) * 100) / 100,
            merchant: merchantData.name,
            category: merchantData.category,
            timestamp: new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: type === "declined" ? "failed" : Math.random() > 0.1 ? "completed" : "pending",
          });
        }

        newTransactions.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        set((state) => ({
          transactions: [...newTransactions, ...state.transactions].slice(0, 50),
        }));
      },

      depositToCard: (cardId: string, amount: number, txSignature: string) => {
        const card = get().cards.find((c) => c.id === cardId);
        if (!card) return;

        const deposit = {
          txSignature,
          amount,
          timestamp: new Date().toISOString(),
        };

        const processingUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        const logEntry: ActivityLog = {
          id: crypto.randomUUID(),
          cardId,
          cardName: card.name,
          action: "deposit" as const,
          description: `Deposited ${amount.toFixed(4)} SOL to "${card.name}" - Activating in 24 hours`,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === cardId
              ? {
                  ...c,
                  solBalance: (c.solBalance || 0) + amount,
                  deposits: [...(c.deposits || []), deposit],
                  processingUntil,
                }
              : c
          ),
          activityLog: [logEntry, ...state.activityLog],
        }));
      },

      getCardBalance: (cardId: string) => {
        const card = get().cards.find((c) => c.id === cardId);
        return card?.solBalance || 0;
      },

      isCardProcessing: (cardId: string) => {
        const card = get().cards.find((c) => c.id === cardId);
        if (!card?.processingUntil) return false;
        return new Date(card.processingUntil).getTime() > Date.now();
      },

      clearExpiredProcessing: () => {
        const now = Date.now();
        set((state) => ({
          cards: state.cards.map((card) => {
            if (card.processingUntil && new Date(card.processingUntil).getTime() <= now) {
              return { ...card, processingUntil: null };
            }
            return card;
          }),
        }));
      },
    }),
    {
      name: "authocard-storage",
      partialize: (state) => ({
        cards: state.cards,
        transactions: state.transactions,
        activityLog: state.activityLog,
      }),
    }
  )
);
