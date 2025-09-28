import * as React from "react";
import styled from "styled-components";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useNavigate } from "react-router-dom";

import idl from "../../solana_polls.json";
import { GlobalDataAccountContext } from "../../App";

const programID = new PublicKey(idl.address);

import NewPollForm from "../components/form/NewPollForm";

const Container = styled.div`
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem 1rem;
  width: 100%;
  position: relative;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 1rem 0;
`;

const PageTitle = styled.h1`
  color: #2d3748;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageSubtitle = styled.p`
  color: #718096;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.3px;
  line-height: 1.6;
`;

const NewPoll = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const globalDataAccount = React.useContext(GlobalDataAccountContext);
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = React.useState(false);
  const [createMessage, setCreateMessage] = React.useState<string | null>(null);

  const handleOnSubmit = async (title: string, options: Array<string>) => {
    if (!wallet) {
      console.error("Wallet not connected");
      return;
    }

    if (!globalDataAccount) {
      console.error("Global data account not available yet");
      return;
    }

    setIsCreating(true);
    setCreateMessage("Preparing poll creation...");

    try {
      console.log(`form submit ${title}; ${options}`);
      const provider = new AnchorProvider(
        connection,
        wallet as anchor.Wallet,
        {}
      );
      const program = new Program(idl as any, provider);
      
      // Check wallet balance first
      setCreateMessage("Checking wallet balance...");
      const walletBalance = await program.provider.connection.getBalance(wallet.publicKey);
      console.log("Wallet balance:", walletBalance / anchor.web3.LAMPORTS_PER_SOL, "SOL");
      
      if (walletBalance < 0.1 * anchor.web3.LAMPORTS_PER_SOL) {
        setCreateMessage("Requesting airdrop for insufficient balance...");
        console.log("Wallet has insufficient balance, requesting airdrop...");
        const airdropTx = await program.provider.connection.requestAirdrop(
          wallet.publicKey,
          2 * anchor.web3.LAMPORTS_PER_SOL
        );
        await program.provider.connection.confirmTransaction(airdropTx);
        console.log("Wallet airdropped");
      }
      
      // Create the poll using the global data account
      setCreateMessage("Creating poll on blockchain...");
      console.log("Creating poll with title:", title, "options:", options);
      console.log("Using global data account:", globalDataAccount.toString());
      
      try {
        const pollTx = await program.methods
          .createPoll(title, options)
          .accounts({
            data: globalDataAccount,
            author: wallet.publicKey,
          })
          .rpc({ 
            skipPreflight: false, 
            preflightCommitment: 'confirmed',
            commitment: 'confirmed'
          });
        console.log("Create poll transaction:", pollTx);
        console.log("Poll created successfully!");
        
        setCreateMessage("Poll created successfully! Redirecting...");
        
        // Redirect to polls page after successful creation
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (pollError: any) {
        console.error("Error creating poll:", pollError);
        console.error("Poll error details:", JSON.stringify(pollError, null, 2));
        if (pollError.logs) {
          console.error("Poll error logs:", pollError.logs);
        }
        setCreateMessage("Failed to create poll. Please try again.");
        setTimeout(() => setCreateMessage(null), 3000);
        throw pollError;
      }
    } catch (error) {
      console.error("Error in handleOnSubmit:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      setCreateMessage("An error occurred. Please try again.");
      setTimeout(() => setCreateMessage(null), 3000);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <PageHeader>
          <PageTitle>Create New Poll</PageTitle>
          <PageSubtitle>
            Start a new discussion and gather opinions from the community.<br />
            Add your question and provide multiple choice options.
          </PageSubtitle>
        </PageHeader>
        <NewPollForm 
          onSubmit={handleOnSubmit} 
          isCreating={isCreating}
          createMessage={createMessage}
        />
      </ContentWrapper>
    </Container>
  );
};

export default NewPoll;