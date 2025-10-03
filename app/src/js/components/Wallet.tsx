import * as React from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import config from "../../config";

// Import the CSS
import "@solana/wallet-adapter-react-ui/styles.css";

interface Props {
  children?: React.ReactNode;
}

const Wallet = (props: Props) => {
  // Include only essential wallet adapters with proper initialization
  const wallets = React.useMemo(
    () => {
      const adapters = [];
      
      // Always add Phantom and Solflare - they will handle their own readiness
      adapters.push(new PhantomWalletAdapter());
      adapters.push(new SolflareWalletAdapter());
      
      return adapters;
    },
    []
  );
 

  // Inject CSS if not loaded
  React.useEffect(() => {
    const walletAdapterStyles = document.querySelector('style[data-wallet-adapter]') || 
                               document.querySelector('link[href*="wallet-adapter"]');
    
    if (!walletAdapterStyles) {
      const style = document.createElement('style');
      style.setAttribute('data-wallet-adapter', 'true');
      style.textContent = `
        .wallet-adapter-modal {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          z-index: 1000 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: rgba(0, 0, 0, 0.5) !important;
          pointer-events: auto !important;
        }
        .wallet-adapter-modal-container {
          background: white !important;
          border-radius: 12px !important;
          padding: 24px !important;
          max-width: 400px !important;
          width: 90% !important;
          max-height: 80vh !important;
          overflow-y: auto !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
          pointer-events: auto !important;
          position: relative !important;
          z-index: 1001 !important;
        }
        .wallet-adapter-modal-wrapper {
          position: relative !important;
        }
        .wallet-adapter-modal-title {
          font-size: 18px !important;
          font-weight: 600 !important;
          margin: 0 0 16px 0 !important;
          color: #1a202c !important;
        }
        .wallet-adapter-modal-list {
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .wallet-adapter-modal-list li {
          margin: 0 !important;
          padding: 0 !important;
        }
        .wallet-adapter-button {
          display: flex !important;
          align-items: center !important;
          padding: 12px !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 8px !important;
          background: white !important;
          cursor: pointer !important;
          width: 100% !important;
          margin-bottom: 8px !important;
          font-size: 14px !important;
          color: #1a202c !important;
          transition: all 0.2s !important;
        }
        .wallet-adapter-button:hover {
          background: #f7fafc !important;
          border-color: #cbd5e0 !important;
        }
        /* Connected wallet button styling with higher specificity */
        .wallet-adapter-dropdown .wallet-adapter-button-trigger {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: white !important;
          border-radius: 8px !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          height: 34px !important;
          padding: 6px 12px !important;
          min-width: auto !important;
          transition: all 0.3s ease !important;
          letter-spacing: 0.3px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .wallet-adapter-dropdown .wallet-adapter-button-trigger:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        }
        .wallet-adapter-dropdown .wallet-adapter-button-trigger:active {
          transform: translateY(0) !important;
        }
        /* Additional specificity for connected state */
        .wallet-adapter-button.wallet-adapter-button-trigger {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: white !important;
        }
        .wallet-adapter-dropdown{
          display: none !important;
        }
        .wallet-adapter-button.wallet-adapter-button-trigger:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
        }
        .wallet-adapter-button-start-icon {
          width: 16px !important;
          height: 16px !important;
          margin-right: 6px !important;
          margin-left: 0 !important;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
          flex-shrink: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .wallet-adapter-button-start-icon img {
          width: 16px !important;
          height: 16px !important;
          object-fit: contain !important;
        }
        .wallet-adapter-modal-button-close {
          position: absolute !important;
          top: 16px !important;
          right: 16px !important;
          background: none !important;
          border: none !important;
          cursor: pointer !important;
          padding: 4px !important;
          color: #718096 !important;
        }
        .wallet-adapter-modal-button-close:hover {
          color: #1a202c !important;
        }
        .wallet-adapter-modal-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          background: rgba(0, 0, 0, 0.5) !important;
          z-index: 999 !important;
          pointer-events: auto !important;
        }
        .wallet-adapter-modal-overlay:hover {
          cursor: pointer !important;
        }
        .wallet-adapter-modal-container:hover {
          cursor: default !important;
        }
        /* Prevent modal from closing when clicking inside */
        .wallet-adapter-modal-container * {
          pointer-events: auto !important;
        }
        /* Ensure modal stays open */
        .wallet-adapter-modal[style*="display: none"] {
          display: flex !important;
        }
        .wallet-adapter-modal[style*="visibility: hidden"] {
          visibility: visible !important;
        }
        /* Hide dropdown list when wallet is connected */
        .wallet-adapter-dropdown-list {
          display: none !important;
        }
        .wallet-adapter-dropdown-list.false {
          display: none !important;
        }
        .wallet-adapter-dropdown-list[aria-label="dropdown-list"] {
          display: none !important;
        }
        /* Hide dropdown when wallet is connected */
        .wallet-adapter-dropdown .wallet-adapter-dropdown-list {
          display: none !important;
        }
        /* Additional rules to hide dropdown */
        ul.wallet-adapter-dropdown-list {
          display: none !important;
        }
        .wallet-adapter-dropdown ul {
          display: none !important;
        }
        /* Hide the entire dropdown except the button */
        .wallet-adapter-dropdown > ul {
          display: none !important;
        }
        /* Force styling for connected wallet button - highest specificity */
        button.wallet-adapter-button.wallet-adapter-button-trigger {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: white !important;
          font-weight: 500 !important;
        }
        button.wallet-adapter-button.wallet-adapter-button-trigger:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
        }
        /* Override any existing styles */
        .wallet-adapter-button-trigger[style*="background"] {
          background: rgba(255, 255, 255, 0.1) !important;
        }
        .wallet-adapter-button-trigger[style*="color"] {
          color: white !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
 
  return (
    <ConnectionProvider endpoint={config.endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={false}
        onError={(error) => {
          // Silent error handling - only log critical errors
          if (error.name !== 'WalletNotReadyError') {
            console.error("Wallet Error:", error.message);
          }
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