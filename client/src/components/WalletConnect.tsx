import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { useSolanaWallet } from "@/lib/solana";
import { Wallet, Unplug } from "lucide-react";
import { SiSolana } from "react-icons/si";

export function WalletConnect() {
  const {
    connected: solanaConnected,
    disconnect: solanaDisconnect,
    openModal: openSolanaModal,
    shortAddress: solanaShortAddress,
    address: solanaAddress,
  } = useSolanaWallet();
  const { connectWallet, disconnectWallet } = useAppStore();

  useEffect(() => {
    if (solanaConnected && solanaAddress) {
      connectWallet(solanaAddress, "solana");
    } else {
      disconnectWallet();
    }
  }, [solanaConnected, solanaAddress, connectWallet, disconnectWallet]);

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {!solanaConnected ? (
        <Button
          onClick={openSolanaModal}
          className="gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-4"
          data-testid="button-connect-solana-wallet"
        >
          <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Connect Wallet</span>
          <span className="sm:hidden">Connect</span>
        </Button>
      ) : (
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 h-8 px-2 hidden sm:flex"
            data-testid="button-solana-network"
          >
            <SiSolana className="w-3.5 h-3.5" />
            <span className="text-xs">Solana</span>
          </Button>

          <Button
            onClick={() => solanaDisconnect()}
            variant="outline"
            size="sm"
            className="gap-1 font-mono text-xs h-8 px-2"
            data-testid="button-solana-account"
          >
            {solanaShortAddress}
            <Unplug className="h-3 w-3 text-muted-foreground" />
          </Button>
        </div>
      )}
    </div>
  );
}
