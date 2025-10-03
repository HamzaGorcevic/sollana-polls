import * as React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { PublicKey, Keypair } from "@solana/web3.js";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import styled from "styled-components";

// Import existing components
import Wallet from "./js/components/Wallet";
import Menu from "./js/components/Menu";
import Home from "./js/pages/Home";
import Polls from "./js/pages/Polls";
import NewPoll from "./js/pages/NewPoll";
import Loading from "./js/pages/Loading";

// Import IDL
import idl from "./solana_polls.json";

// Context for global data account - EXPORTED so other files can use it
export const GlobalDataAccountContext = React.createContext<PublicKey | null>(null);

// Styled components for the status bar
const StatusBar = styled.div`
  text-align: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
`;

const StatusContent = styled.div<{ $color: string }>`
  color: ${props => {
    switch (props.$color) {
      case 'green': return '#48bb78';
      case 'red': return '#f56565';
      case 'blue': return '#4299e1';
      case 'orange': return '#ed8936';
      default: return '#718096';
    }
  }};
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  letter-spacing: 0.3px;
`;

const StatusDot = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.$color) {
      case 'green': return '#48bb78';
      case 'red': return '#f56565';
      case 'blue': return '#4299e1';
      case 'orange': return '#ed8936';
      default: return '#718096';
    }
  }};
  box-shadow: 0 0 0 3px ${props => {
    switch (props.$color) {
      case 'green': return 'rgba(72, 187, 120, 0.2)';
      case 'red': return 'rgba(245, 101, 101, 0.2)';
      case 'blue': return 'rgba(66, 153, 225, 0.2)';
      case 'orange': return 'rgba(237, 137, 54, 0.2)';
      default: return 'rgba(113, 128, 150, 0.2)';
    }
  }};
  animation: ${props => props.$color === 'blue' ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
  margin-top: 12px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const MainContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
`;

const ContentWrapper = styled.main`
  padding: 0;
  min-height: calc(100vh - 120px);
`;

// Main app content with wallet functionality
const AppContent = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [globalDataAccount, setGlobalDataAccount] = React.useState<PublicKey | null>(null);
  const [isInitializing, setIsInitializing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Debug logging for wallet state changes
  React.useEffect(() => {
    console.log("=== Wallet State Change ===");
    console.log("Wallet connected:", !!wallet);
    console.log("Wallet publicKey:", wallet?.publicKey?.toString());
    console.log("Wallet object:", wallet);
    console.log("Connection:", !!connection);
    console.log("Connection endpoint:", connection?.rpcEndpoint);
    console.log("Global data account:", globalDataAccount?.toString());
    console.log("Is initializing:", isInitializing);
    console.log("Error:", error);
    console.log("==========================");
  }, [wallet, connection, globalDataAccount, isInitializing, error]);

  // Function to create/get global data account
  const getOrCreateGlobalDataAccount = async () => {
    if (!wallet || !connection) {
      throw new Error("Wallet or connection not available");
    }

    try {
      console.log("Creating/fetching global data account...");
      
      // Generate or retrieve stored keypair
      let globalDataAccountKeypair: Keypair;
      const storedKeypair = localStorage.getItem('globalDataAccountKeypair');
      
      if (storedKeypair) {
        const keypairArray = JSON.parse(storedKeypair);
        globalDataAccountKeypair = Keypair.fromSecretKey(new Uint8Array(keypairArray));
        console.log("Using stored global data account:", globalDataAccountKeypair.publicKey.toString());
      } else {
        globalDataAccountKeypair = Keypair.generate();
        localStorage.setItem('globalDataAccountKeypair', JSON.stringify(Array.from(globalDataAccountKeypair.secretKey)));
        console.log("Generated new global data account:", globalDataAccountKeypair.publicKey.toString());
      }
      
      const globalDataAccount = globalDataAccountKeypair.publicKey;
      
      // Check if account already exists on-chain
      const accountInfo = await connection.getAccountInfo(globalDataAccount);
      
      if (!accountInfo) {
        console.log("Account doesn't exist on-chain, initializing...");
        
        // Create provider and program
        const provider = new AnchorProvider(connection, wallet as anchor.Wallet, {});
        const program = new Program(idl as any, provider);
        
        // Initialize the data account on-chain
        const tx = await program.methods
          .initialize()
          .accounts({
            data: globalDataAccount,
            owner: wallet.publicKey,
          })
          .signers([globalDataAccountKeypair])
          .rpc();
        
        console.log("✅ Data account initialized on-chain:", tx);
      } else {
        console.log("✅ Data account already exists on-chain");
      }
      
      console.log("✅ Global data account ready:", globalDataAccount.toString());
      return globalDataAccount;
      
    } catch (error) {
      console.error("❌ Error in getOrCreateGlobalDataAccount:", error);
      throw error;
    }
  };

  // Initialize global data account when wallet connects
  React.useEffect(() => {
    const initializeGlobalDataAccount = async () => {
      if (wallet && connection && !globalDataAccount && !isInitializing) {
        console.log("✅ Starting global data account initialization...");
        setIsInitializing(true);
        setError(null);
        
        try {
          const account = await getOrCreateGlobalDataAccount();
          setGlobalDataAccount(account);
        } catch (error: any) {
          console.error("❌ Error initializing global data account:", error);
          setError(error?.message || "Unknown error occurred");
        } finally {
          setIsInitializing(false);
        }
      }
    };

    initializeGlobalDataAccount();
  }, [wallet, connection, globalDataAccount, isInitializing]);

  // Reset global data account if wallet disconnects
  React.useEffect(() => {
    if (!wallet && globalDataAccount) {
      console.log("Wallet disconnected, resetting global data account");
      setGlobalDataAccount(null);
      setError(null);
    }
  }, [wallet, globalDataAccount]);

  const handleRetry = async () => {
    console.log("Manual retry triggered");
    setError(null);
    setIsInitializing(true);
    
    try {
      const account = await getOrCreateGlobalDataAccount();
      setGlobalDataAccount(account);
    } catch (error: any) {
      console.error("Manual retry error:", error);
      setError(error?.message || "Unknown error occurred");
    } finally {
      setIsInitializing(false);
    }
  };

  const getStatusMessage = () => {
    if (!wallet) {
      return { message: "Please connect your wallet to continue", color: "orange" };
    }
    if (isInitializing) {
      return { message: "Initializing your data account...", color: "blue" };
    }
    if (error) {
      return { message: `Error: ${error}`, color: "red" };
    }
    if (globalDataAccount) {
      return { 
        message: `Connected! Account: ${globalDataAccount.toString().slice(0, 8)}...${globalDataAccount.toString().slice(-4)}`, 
        color: "green" 
      };
    }
    return { message: "Loading...", color: "gray" };
  };

  const status = getStatusMessage();

  return (
    <GlobalDataAccountContext.Provider value={globalDataAccount}>
      <Router>
        <MainContainer>
          <Menu />
          
          {/* Status Display */}
          <StatusBar>
            <StatusContent $color={status.color}>
              <StatusDot $color={status.color} />
              {status.message}
            </StatusContent>
            
            {/* Retry Button */}
            {error && wallet && (
              <RetryButton 
                onClick={handleRetry}
                disabled={isInitializing}
              >
                {isInitializing ? 'Retrying...' : 'Retry Connection'}
              </RetryButton>
            )}
          </StatusBar>

          {/* Main Content */}
          <ContentWrapper>
            <React.Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/polls" element={<Polls />} />
                <Route path="/new" element={<NewPoll />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </React.Suspense>
          </ContentWrapper>
        </MainContainer>
      </Router>
    </GlobalDataAccountContext.Provider>
  );
};

// Main App with Wallet provider
const App = () => {
  return (
    <Wallet>
      <AppContent />
    </Wallet>
  );
};

export default App;