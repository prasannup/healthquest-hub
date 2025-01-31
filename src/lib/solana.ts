import { web3 } from "@project-serum/anchor";

export const connectWallet = async () => {
  try {
    // @ts-ignore
    const { solana } = window;
    
    if (!solana) {
      throw new Error("Please install Phantom wallet");
    }

    const response = await solana.connect();
    return response.publicKey.toString();
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
};

export const getProvider = () => {
  // @ts-ignore
  const { solana } = window;
  
  if (!solana) {
    throw new Error("Please install Phantom wallet");
  }

  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const provider = {
    connection,
    publicKey: solana.publicKey,
    signTransaction: solana.signTransaction,
    signAllTransactions: solana.signAllTransactions,
  };

  return provider;
};