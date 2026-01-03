import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { VirtualCard } from "@/components/VirtualCard";
import { CreateCardForm } from "@/components/CreateCardForm";
import { TransactionLog } from "@/components/TransactionLog";
import { ActivityLog } from "@/components/ActivityLog";
import { FraudAlert } from "@/components/FraudAlert";
import { WalletConnect } from "@/components/WalletConnect";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  CreditCard,
  Shield,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function Dashboard() {
  const [createCardOpen, setCreateCardOpen] = useState(false);
  const { cards, walletConnected, simulateFraudCheck } = useAppStore();

  useEffect(() => {
    const interval = setInterval(() => {
      if (cards.length > 0) {
        simulateFraudCheck();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [cards.length, simulateFraudCheck]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-500 border-2 border-background" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold" data-testid="text-app-title">
                OrbiPay
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                Virtual Card Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <WalletConnect />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <FraudAlert />

        <BalanceDisplay />

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="flex-1 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Your Cards
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Manage your virtual cards
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={simulateFraudCheck}
                  disabled={cards.length === 0}
                  className="text-xs sm:text-sm"
                  data-testid="button-run-fraud-check"
                >
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">AI Fraud Check</span>
                  <span className="sm:hidden">Fraud Check</span>
                </Button>
                <Button
                  onClick={() => setCreateCardOpen(true)}
                  disabled={!walletConnected}
                  size="sm"
                  className="text-xs sm:text-sm"
                  data-testid="button-create-card"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Create Card</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </div>
            </div>

            {!walletConnected && (
              <div className="rounded-lg border border-dashed border-border bg-card/50 p-6 sm:p-8 text-center">
                <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 max-w-sm mx-auto">
                  Connect your Web3 wallet to start creating virtual cards
                </p>
                <Badge variant="outline" className="text-[10px] sm:text-xs">
                  Ethereum, Polygon, Arbitrum, Optimism, Base
                </Badge>
              </div>
            )}

            {walletConnected && cards.length === 0 && (
              <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-6 sm:p-8 text-center">
                <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">Create Your First Card</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 max-w-sm mx-auto">
                  Get started with custom spending limits and security options
                </p>
                <Button onClick={() => setCreateCardOpen(true)} size="sm" data-testid="button-create-first-card">
                  <Plus className="w-4 h-4 mr-1" />
                  Create Card
                </Button>
              </div>
            )}

            {cards.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {cards.map((card) => (
                  <VirtualCard key={card.id} card={card} />
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-80 xl:w-96 space-y-4 sm:space-y-6">
            <TransactionLog />
            <ActivityLog />
          </div>
        </div>

        <div className="pt-4 sm:pt-6 border-t">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
            <Badge variant="secondary" className="gap-1 text-[10px] sm:text-xs">
              <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              AI Shield Active
            </Badge>
          </div>
        </div>
      </main>

      <CreateCardForm open={createCardOpen} onOpenChange={setCreateCardOpen} />
    </div>
  );
}
