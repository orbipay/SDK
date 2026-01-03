import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ShoppingBag,
  Plane,
  Gamepad2,
  Lightbulb,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  XCircle,
  CheckCircle,
} from "lucide-react";
import type { Transaction, CardCategory } from "@shared/schema";

const CATEGORY_ICONS: Record<CardCategory, typeof ShoppingBag> = {
  shopping: ShoppingBag,
  travel: Plane,
  gaming: Gamepad2,
  utilities: Lightbulb,
  subscriptions: Receipt,
};

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const CategoryIcon = CATEGORY_ICONS[transaction.category];
  
  const statusConfig = {
    completed: { icon: CheckCircle, color: "text-emerald-500" },
    pending: { icon: Clock, color: "text-amber-500" },
    failed: { icon: XCircle, color: "text-red-500" },
  };

  const typeConfig = {
    purchase: { icon: ArrowUpRight, color: "text-red-500", prefix: "-" },
    refund: { icon: ArrowDownLeft, color: "text-emerald-500", prefix: "+" },
    authorization: { icon: Clock, color: "text-amber-500", prefix: "" },
    declined: { icon: XCircle, color: "text-red-500", prefix: "" },
  };

  const StatusIcon = statusConfig[transaction.status].icon;

  return (
    <div
      className="flex items-center justify-between gap-2 py-2.5 border-b border-border last:border-0"
      data-testid={`transaction-item-${transaction.id}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center">
          <CategoryIcon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" data-testid={`text-merchant-${transaction.id}`}>
            {transaction.merchant}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {formatTimeAgo(transaction.timestamp)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-right">
          <p
            className={`text-sm font-mono font-semibold ${typeConfig[transaction.type].color}`}
            data-testid={`text-amount-${transaction.id}`}
          >
            {typeConfig[transaction.type].prefix}${transaction.amount.toFixed(2)}
          </p>
          <div className="flex items-center justify-end gap-1">
            <StatusIcon className={`w-2.5 h-2.5 ${statusConfig[transaction.status].color}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TransactionLog() {
  const { transactions, cards, generateDummyTransactions } = useAppStore();

  if (cards.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-sm sm:text-base">Transactions</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Receipt className="w-8 h-8 text-muted-foreground/50 mb-2" />
            <p className="text-xs text-muted-foreground">No transactions yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2 px-4 pt-4 flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-sm sm:text-base">Transactions</CardTitle>
          <Badge
            className="cursor-pointer text-[10px]"
            onClick={generateDummyTransactions}
            data-testid="button-generate-transactions"
          >
            Generate Demo
          </Badge>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Receipt className="w-8 h-8 text-muted-foreground/50 mb-2" />
            <p className="text-xs text-muted-foreground">Click above to generate demo data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 px-4 pt-4 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm sm:text-base">Transactions</CardTitle>
        <Badge variant="secondary" className="font-mono text-[10px]">
          {transactions.length}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[280px] sm:h-[320px] px-4">
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
