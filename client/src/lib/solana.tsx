import { useMemo, useCallback, useState, useEffect } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider, useWalletModal } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  clusterApiUrl,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

interface SolanaProviderProps {
  children: React.ReactNode;
}

export function SolanaProvider({ children }: SolanaProviderProps) {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => {
    return clusterApiUrl(network);
  }, [network]);
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

interface SolanaWalletState {
  publicKey: ReturnType<typeof useWallet>["publicKey"];
  connected: boolean;
  connecting: boolean;
  disconnect: () => Promise<void> | void;
  wallet: ReturnType<typeof useWallet>["wallet"];
  connection: ReturnType<typeof useConnection>["connection"] | null;
  openModal: () => void;
  shortAddress: string | null;
  address: string | null;
  balance: number | null;
  refreshBalance: () => Promise<void>;
  sendSol: (toAddress: string, amount: number) => Promise<string | null>;
  isSending: boolean;
}

export function useSolanaWallet(): SolanaWalletState {
  const { publicKey, connected, connecting, disconnect, wallet, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const [balance, setBalance] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);

  const openModal = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const shortAddress = useMemo(() => {
    if (!publicKey) return null;
    const address = publicKey.toBase58();
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }, [publicKey]);

  const refreshBalance = useCallback(async () => {
    if (!publicKey || !connected || !wallet) {
      setBalance(null);
      return;
    }
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch("/api/solana/rpc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [publicKey.toBase58()],
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (data.result?.value !== undefined) {
        setBalance(data.result.value / LAMPORTS_PER_SOL);
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.error("Balance fetch error:", error);
      setBalance(0);
    }
  }, [publicKey, connected, wallet]);

  useEffect(() => {
    if (connected && publicKey && wallet) {
      refreshBalance();
      const intervalId = setInterval(refreshBalance, 15000);
      return () => clearInterval(intervalId);
    } else {
      setBalance(null);
    }
  }, [connected, publicKey, wallet, refreshBalance]);

  const sendSol = useCallback(
    async (toAddress: string, amount: number): Promise<string | null> => {
      if (!publicKey || !connected || !wallet) {
        console.error("Wallet not connected or not ready");
        return null;
      }

      if (amount <= 0) {
        console.error("Invalid amount");
        return null;
      }

      setIsSending(true);
      try {
        const toPublicKey = new PublicKey(toAddress);
        const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

        const blockhashResponse = await fetch("/api/solana/rpc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getLatestBlockhash",
            params: [{ commitment: "finalized" }],
          }),
        });
        const blockhashData = await blockhashResponse.json();
        
        if (!blockhashData.result?.value?.blockhash) {
          throw new Error("Failed to get blockhash");
        }

        const { blockhash, lastValidBlockHeight } = blockhashData.result.value;

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: toPublicKey,
            lamports,
          })
        );

        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;

        const signedTx = await wallet.adapter.sendTransaction(transaction, connection);

        let confirmed = false;
        for (let i = 0; i < 30; i++) {
          const statusResponse = await fetch("/api/solana/rpc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "getSignatureStatuses",
              params: [[signedTx]],
            }),
          });
          const statusData = await statusResponse.json();
          const status = statusData.result?.value?.[0];
          
          if (status?.confirmationStatus === "confirmed" || status?.confirmationStatus === "finalized") {
            confirmed = true;
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (!confirmed) {
          console.warn("Transaction not confirmed within timeout, but may still succeed");
        }

        await refreshBalance();
        return signedTx;
      } catch (error) {
        console.error("Failed to send SOL:", error);
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [publicKey, connection, refreshBalance, connected, wallet]
  );

  return {
    publicKey,
    connected,
    connecting,
    disconnect,
    wallet,
    connection,
    openModal,
    shortAddress,
    address: publicKey?.toBase58() || null,
    balance,
    refreshBalance,
    sendSol,
    isSending,
  };
}
