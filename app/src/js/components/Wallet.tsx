import * as React from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import config from "../../config";

// Import the CSS
import "@solana/wallet-adapter-react-ui/styles.css";

interface Props {
  children?: React.ReactNode;
}

const Wallet = (props: Props) => {
  // Only include non-standard wallets in the array
  // Phantom is now auto-detected as a Standard Wallet
  const wallets = React.useMemo(
    () => [
      new SolflareWalletAdapter(),
    ],
    []
  );
 
  console.log("Wallet component - endpoint:", config.endpoint);
  console.log("Wallet component - wallets count:", wallets.length);
  console.log("Wallet component - config:", config);

  // Check if phantom is available
  React.useEffect(() => {
    console.log("Checking browser wallet availability:");
    console.log("- Phantom available:", !!(window as any)?.solana);
    console.log("- Phantom isPhantom:", (window as any)?.solana?.isPhantom);
    console.log("- Solflare available:", !!(window as any)?.solflare);
    
    if ((window as any)?.solana) {
      console.log("Phantom object:", (window as any).solana);
    }
  }, []);
 
  return (
    <ConnectionProvider endpoint={config.endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={false}
        onError={(error) => {
          console.error("Wallet Provider Error:", error);
        }}
      >
        <WalletModalProvider>
          {props.children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Wallet;