import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Shield } from "lucide-react";

export function FraudAlert() {
  const { cards, fraudAlertDismissed, dismissFraudAlert } = useAppStore();

  const highRiskCards = cards.filter(
    (card) => card.riskLevel === "high" && card.status === "frozen"
  );

  if (highRiskCards.length === 0 || fraudAlertDismissed) {
    return null;
  }

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-red-500/30 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10"
      data-testid="alert-fraud-detected"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      
      <div className="relative flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-red-500 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              AI Fraud Shield Alert
            </h3>
            <p className="text-sm text-muted-foreground">
              High risk activity detected on{" "}
              <span className="font-medium text-foreground">
                {highRiskCards.map((c) => c.name).join(", ")}
              </span>
              . Card{highRiskCards.length > 1 ? "s have" : " has"} been automatically frozen.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-red-500/30 text-red-500 hover:bg-red-500/10"
            onClick={dismissFraudAlert}
            data-testid="button-dismiss-fraud-alert"
          >
            <X className="w-4 h-4 mr-1" />
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
}
