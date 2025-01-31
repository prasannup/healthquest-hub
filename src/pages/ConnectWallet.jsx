// src/pages/ConnectWallet.jsx
import { useState } from "react";
import { Button } from "../components/ui/button";
import { PublicKey } from "@solana/web3.js";
import { useToast } from "../components/ui/use-toast";

export const ConnectWallet = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const { toast } = useToast();

  const connectPhantomWallet = async () => {
    try {
      if (!window.solana || !window.solana.isPhantom) {
        throw new Error(
          "Phantom Wallet is not installed. Please install it from https://phantom.app/"
        );
      }

      const { publicKey } = await window.solana.connect();
      const address = new PublicKey(publicKey).toString();
      setWalletAddress(address);

      toast({
        title: "Wallet Connected",
        description: `Connected to wallet: ${address.slice(0, 8)}...`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Connect Your Phantom Wallet</h1>
      {walletAddress ? (
        <div className="text-center">
          <p className="text-lg">Wallet Connected!</p>
          <p className="text-gray-600">Address: {walletAddress}</p>
        </div>
      ) : (
        <Button onClick={connectPhantomWallet} variant="default">
          Connect Phantom Wallet
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
