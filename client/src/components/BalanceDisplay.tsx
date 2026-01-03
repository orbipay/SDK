import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { CreditCard, Snowflake, AlertTriangle } from "lucide-react";

export function BalanceDisplay() {
  const { cards } = useAppStore();

  const totalSolBalance = cards.reduce((sum, c) => sum + (c.solBalance || 0), 0);
  const activeCards = cards.filter((c) => c.status === "active").length;
  const frozenCards = cards.filter((c) => c.status === "frozen").length;
  const highRiskCards = cards.filter((c) => c.riskLevel === "high").length;

  const stats = [
    {
      label: "Active Cards",
      value: activeCards.toString(),
      icon: CreditCard,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Frozen Cards",
      value: frozenCards.toString(),
      icon: Snowflake,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Risk Alerts",
      value: highRiskCards.toString(),
      icon: AlertTriangle,
      color: highRiskCards > 0 ? "text-red-500" : "text-muted-foreground",
      bgColor: highRiskCards > 0 ? "bg-red-500/10" : "bg-muted",
    },
  ];

  return (
    <Card className="relative border bg-card">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground mb-0.5">Total Balance</p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span
                className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono tracking-tight text-foreground"
                data-testid="text-total-balance"
              >
                {totalSolBalance.toFixed(4)} SOL
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {cards.length} card{cards.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg bg-muted/50 border border-border"
              >
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-lg sm:text-xl font-bold font-mono text-foreground leading-none" data-testid={`text-stat-${stat.label.toLowerCase().replace(" ", "-")}`}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
