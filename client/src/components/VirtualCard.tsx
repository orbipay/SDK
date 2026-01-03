import { useState, useRef, useEffect } from "react";
import type { VirtualCard as VirtualCardType } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Snowflake,
  Play,
  Trash2,
  MoreVertical,
  Settings,
  Eye,
  EyeOff,
  CreditCard,
  AlertTriangle,
  Wallet,
  Loader2,
  Clock,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useSolanaWallet } from "@/lib/solana";
import { useToast } from "@/hooks/use-toast";

interface VirtualCardProps {
  card: VirtualCardType;
}

const TREASURY_ADDRESS = "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM";

export function VirtualCard({ card }: VirtualCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [editLimitsOpen, setEditLimitsOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [dailyLimit, setDailyLimit] = useState(card.dailyLimit.toString());
  const [perTxLimit, setPerTxLimit] = useState(card.perTransactionLimit.toString());
  const cardRef = useRef<HTMLDivElement>(null);

  const { toggleCardFreeze, deleteCard, updateCardLimits, depositToCard } = useAppStore();
  const { connected, balance, sendSol, isSending, openModal } = useSolanaWallet();
  const { toast } = useToast();

  const [timeNow, setTimeNow] = useState(Date.now());

  useEffect(() => {
    if (card.processingUntil) {
      const intervalId = setInterval(() => {
        setTimeNow(Date.now());
      }, 60000);
      return () => clearInterval(intervalId);
    }
  }, [card.processingUntil]);

  const isProcessing = !!(card.processingUntil && new Date(card.processingUntil).getTime() > timeNow);
  const processingTimeLeft = card.processingUntil
    ? Math.max(0, new Date(card.processingUntil).getTime() - timeNow)
    : 0;
  const processingHours = Math.floor(processingTimeLeft / (1000 * 60 * 60));
  const processingMinutes = Math.floor((processingTimeLeft % (1000 * 60 * 60)) / (1000 * 60));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const maskedNumber = showDetails
    ? card.cardNumber
    : `•••• •••• •••• ${card.cardNumber.slice(-4)}`;

  const handleSaveLimits = () => {
    updateCardLimits(card.id, parseFloat(dailyLimit) || 0, parseFloat(perTxLimit) || 0);
    setEditLimitsOpen(false);
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }

    if (balance !== null && amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${balance.toFixed(4)} SOL in your wallet`,
        variant: "destructive",
      });
      return;
    }

    const signature = await sendSol(TREASURY_ADDRESS, amount);
    if (signature) {
      depositToCard(card.id, amount, signature);
      toast({
        title: "Deposit Successful",
        description: `${amount.toFixed(4)} SOL deposited to ${card.name}. Card activating in 24 hours.`,
      });
      setDepositAmount("");
      setDepositOpen(false);
    } else {
      toast({
        title: "Deposit Failed",
        description: "Transaction was rejected or failed",
        variant: "destructive",
      });
    }
  };

  const statusColors = {
    active: isProcessing ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    frozen: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    deleted: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const riskColors = {
    low: "text-emerald-400",
    medium: "text-amber-400",
    high: "text-red-400",
  };

  return (
    <>
      <div
        ref={cardRef}
        className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden cursor-pointer group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid={`card-virtual-${card.id}`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${card.gradient} transition-transform duration-300 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
        />

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
          }}
        />

        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `
              linear-gradient(
                ${45 + (mousePosition.x - 50) * 0.5}deg,
                transparent 20%,
                rgba(255, 255, 255, 0.1) 40%,
                rgba(255, 255, 255, 0.3) 50%,
                rgba(255, 255, 255, 0.1) 60%,
                transparent 80%
              )
            `,
            transform: `translateX(${(mousePosition.x - 50) * 0.5}%)`,
          }}
        />

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

        <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-between text-white">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate" data-testid={`text-card-name-${card.id}`}>
                {card.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <Badge
                  variant="outline"
                  className={`text-[10px] sm:text-xs border ${statusColors[card.status]} backdrop-blur-sm`}
                  data-testid={`badge-card-status-${card.id}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1 ${
                      isProcessing
                        ? "bg-amber-400"
                        : card.status === "active"
                        ? "bg-emerald-400"
                        : card.status === "frozen"
                        ? "bg-blue-400"
                        : "bg-red-400"
                    }`}
                  />
                  {isProcessing ? "Processing" : card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                </Badge>
                {isProcessing && (
                  <Badge
                    variant="outline"
                    className="text-[10px] sm:text-xs border border-amber-500/30 bg-amber-500/20 text-amber-400 backdrop-blur-sm"
                  >
                    <Clock className="w-2.5 h-2.5 mr-0.5" />
                    {processingHours}h {processingMinutes}m
                  </Badge>
                )}
                {card.riskLevel !== "low" && (
                  <Badge
                    variant="outline"
                    className={`text-[10px] sm:text-xs border border-white/20 backdrop-blur-sm ${riskColors[card.riskLevel]}`}
                  >
                    <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />
                    {card.riskLevel}
                  </Badge>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/80 hover:text-white hover:bg-white/10 h-7 w-7"
                  data-testid={`button-card-menu-${card.id}`}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setShowDetails(!showDetails)}
                  data-testid={`button-toggle-details-${card.id}`}
                >
                  {showDetails ? (
                    <EyeOff className="mr-2 h-4 w-4" />
                  ) : (
                    <Eye className="mr-2 h-4 w-4" />
                  )}
                  {showDetails ? "Hide Details" : "Show Details"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setEditLimitsOpen(true)}
                  data-testid={`button-edit-limits-${card.id}`}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Limits
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => connected ? setDepositOpen(true) : openModal()}
                  data-testid={`button-deposit-${card.id}`}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {connected ? "Deposit SOL" : "Connect Wallet"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => toggleCardFreeze(card.id)}
                  disabled={isProcessing}
                  data-testid={`button-freeze-${card.id}`}
                >
                  {card.status === "frozen" ? (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Unfreeze Card
                    </>
                  ) : (
                    <>
                      <Snowflake className="mr-2 h-4 w-4" />
                      Freeze Card
                    </>
                  )}
                </DropdownMenuItem>
                {card.type === "disposable" && (
                  <DropdownMenuItem
                    onClick={() => deleteCard(card.id)}
                    disabled={isProcessing}
                    className="text-destructive focus:text-destructive"
                    data-testid={`button-delete-${card.id}`}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Card
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-white/60" />
              <span
                className="font-mono text-xs sm:text-sm tracking-wider"
                data-testid={`text-card-number-${card.id}`}
              >
                {maskedNumber}
              </span>
            </div>

            <div className="flex items-end justify-between gap-2">
              <div className="flex gap-4 flex-wrap">
                <div>
                  <p className="text-[10px] text-white/60 uppercase tracking-wide">Balance</p>
                  <p className="font-mono text-xs sm:text-sm font-semibold" data-testid={`text-card-balance-${card.id}`}>
                    {card.solBalance?.toFixed(4) || "0.0000"} SOL
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/60 uppercase tracking-wide">Expires</p>
                  <p className="font-mono text-xs" data-testid={`text-card-expiry-${card.id}`}>
                    {card.expiryDate}
                  </p>
                </div>
                {showDetails && (
                  <div>
                    <p className="text-[10px] text-white/60 uppercase tracking-wide">CVV</p>
                    <p className="font-mono text-xs" data-testid={`text-card-cvv-${card.id}`}>
                      {card.cvv}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                {card.cardBrand === "visa" ? (
                  <svg className="h-5 sm:h-6 w-auto" viewBox="0 0 48 16" fill="white">
                    <path d="M19.5 0.5L16.5 15.5H13L16 0.5H19.5ZM35.5 10.5L37.5 4.5L38.5 10.5H35.5ZM40 15.5H43.5L40.5 0.5H37.5C36.5 0.5 35.5 1 35.5 2L29 15.5H33L33.5 13.5H38.5L39 15.5H40ZM29.5 10.5C29.5 6 23 5.5 23 3.5C23 2.5 24 2 25.5 2C26.5 2 28 2.5 28.5 3L29.5 0.5C28.5 0 27 0 25.5 0C22 0 19.5 2 19.5 4C19.5 7 25 7.5 25 10C25 11 24 11.5 22.5 11.5C21 11.5 19.5 11 18.5 10.5L17.5 13C18.5 13.5 20.5 14 22.5 14C26.5 14 29.5 12 29.5 10.5ZM13 0.5L8 10.5L6.5 2C6.5 1 5.5 0.5 4.5 0.5H0L0 1C2 1.5 4.5 2.5 6 4C7 5 7.5 6 8 8L11 0.5H13Z" />
                  </svg>
                ) : (
                  <div className="flex -space-x-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500/80" />
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500/80" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {card.status === "frozen" && !isProcessing && (
          <div className="absolute inset-x-0 top-12 bottom-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Snowflake className="w-5 h-5" />
              <span className="font-medium">Card Frozen</span>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-x-0 top-12 bottom-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-2 text-white/90 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm">
              <Clock className="w-6 h-6 text-amber-400" />
              <span className="font-medium text-sm">Processing Deposit</span>
              <span className="text-xs text-white/70">{processingHours}h {processingMinutes}m remaining</span>
            </div>
          </div>
        )}
      </div>

      <Dialog open={editLimitsOpen} onOpenChange={setEditLimitsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Spending Limits</DialogTitle>
            <DialogDescription>
              Update the spending limits for {card.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dailyLimit">Daily Limit ($)</Label>
              <Input
                id="dailyLimit"
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                placeholder="0.00"
                data-testid="input-edit-daily-limit"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perTxLimit">Per Transaction Limit ($)</Label>
              <Input
                id="perTxLimit"
                type="number"
                value={perTxLimit}
                onChange={(e) => setPerTxLimit(e.target.value)}
                placeholder="0.00"
                data-testid="input-edit-per-tx-limit"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditLimitsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLimits} data-testid="button-save-limits">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deposit SOL</DialogTitle>
            <DialogDescription>
              Transfer SOL from your wallet to {card.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Wallet Balance</span>
                <span className="font-mono font-semibold">
                  {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">Card Balance</span>
                <span className="font-mono font-semibold">
                  {card.solBalance?.toFixed(4) || "0.0000"} SOL
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="depositAmount">Amount (SOL)</Label>
              <div className="flex gap-2">
                <Input
                  id="depositAmount"
                  type="number"
                  step="0.0001"
                  min="0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.0000"
                  data-testid="input-deposit-amount"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => balance && setDepositAmount((balance * 0.5).toFixed(4))}
                  disabled={!balance}
                >
                  50%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => balance && setDepositAmount((balance * 0.95).toFixed(4))}
                  disabled={!balance}
                >
                  Max
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDepositOpen(false)} disabled={isSending}>
              Cancel
            </Button>
            <Button onClick={handleDeposit} disabled={isSending} data-testid="button-confirm-deposit">
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Deposit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
