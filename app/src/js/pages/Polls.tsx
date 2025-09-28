import * as React from "react";
import styled from "styled-components";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

import { IDL } from "../../solana_polls";
import idl from "../../solana_polls.json";
import { GlobalDataAccountContext } from "../../App";
import Poll from "../components/polls/Poll";
import Vote from "../components/polls/Vote"; 
import PollEntity from "../lib/poll";
import VoteEntity from "../lib/vote";
import Results from "../components/polls/Results";

const Container = styled.div`
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem 1rem;
  width: 100%;
  position: relative;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
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
`;

const RefreshButton = styled.button<{ $loading?: boolean }>`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: ${props => props.$loading ? 'not-allowed' : 'pointer'};
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.25);
  margin-bottom: 2rem;
  position: relative;
  opacity: ${props => props.$loading ? 0.7 : 1};
  transform: ${props => props.$loading ? 'scale(0.98)' : 'scale(1)'};
  
  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.35);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  ${props => props.$loading && `
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      margin: auto;
      border: 2px solid transparent;
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    
    @keyframes spin {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
  `}
`;

const EmptyState = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
`;

const EmptyStateIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  
  &::before {
    content: '📊';
    font-size: 2rem;
  }
`;

const EmptyStateTitle = styled.h3`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: #718096;
  font-size: 1rem;
  margin: 0;
  line-height: 1.6;
`;

const LoadingState = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #718096;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
`;

const PollsGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

enum PageState {
  Polls,
  Results,
  Vote,
}

const programID = new PublicKey(idl.address);

interface OpenType {
  [key: string]: any;
}

const Polls = () => {
  const [polls, setPolls] = React.useState<Array<PollEntity>>([]);
  const [votes, setVotes] = React.useState<Map<number, Array<VoteEntity>>>(
    new Map()
  );
  const [selectedPoll, setSelectedPoll] = React.useState<number | null>(null);
  const [pageState, setPageState] = React.useState<PageState>(PageState.Polls);
  const [isVoting, setIsVoting] = React.useState(false);
  const [voteMessage, setVoteMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const globalDataAccount = React.useContext(GlobalDataAccountContext);

  const loadPolls = async () => {
    if (!globalDataAccount) {
      console.log("Global data account not available yet");
      return;
    }
    
    setIsLoading(true);
    try {
      const provider = new AnchorProvider(
        connection,
        wallet as anchor.Wallet,
        {}
      );
      const program = new Program(idl as any, provider);
      const data = await (program.account as any).data.fetch(globalDataAccount);
      setPolls(
        (data.polls as Array<OpenType>).map((poll) => ({
          id: poll.id,
          title: poll.title,
          options: poll.options.map((option: OpenType) => ({
            id: option.id,
            text: option.text,
          })),
          closed: poll.closed,
        }))
      );
    } catch (error) {
      console.error("Error loading polls:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadVotes = async (pollId: number) => {
    if (!globalDataAccount) {
      console.log("Global data account not available yet");
      return;
    }
    
    try {
      console.log(`Loading votes for poll ${pollId}...`);
      const provider = new AnchorProvider(
        connection,
        wallet as anchor.Wallet,
        {}
      );
      const program = new Program(idl as any, provider);
      const data = await (program.account as any).data.fetch(globalDataAccount);
      
      console.log("Raw data from blockchain:", data);
      console.log("Votes array:", data.votes);
      
      const pollVotes: Array<VoteEntity> = (data.votes as Array<OpenType>)
        .filter((vote) => vote.pollId === pollId)
        .map((vote) => ({
          option: vote.option,
        }));
      
      console.log(`Found ${pollVotes.length} votes for poll ${pollId}:`, pollVotes);
      
      const newVotes = new Map(votes);
      newVotes.set(pollId, pollVotes);
      setVotes(newVotes);
    } catch (error) {
      console.error("Error loading votes:", error);
    }
  };

  const handleShowResult = (pollId: number) => {
    console.log(`show results for ${pollId}`);
    // Always reload votes to get latest data
    loadVotes(pollId).catch(console.error);
    setSelectedPoll(pollId);
    setPageState(PageState.Results);
  };

  const handleVote = (id: number) => {
    console.log(`load votes for ${id}`);
    setSelectedPoll(id);
    setPageState(PageState.Vote);
  };

  const handleGoback = () => {
    setSelectedPoll(null);
    setPageState(PageState.Polls);
  };

  const handleVoteSubmit = async (option: number) => {
    console.log(`voted for option ${option}`);
    console.log("Vote conditions check:", {
      wallet: !!wallet,
      selectedPoll,
      globalDataAccount: !!globalDataAccount
    });
    
    if (wallet && selectedPoll !== null && globalDataAccount) {
      console.log("Setting voting state to true");
      setIsVoting(true);
      setVoteMessage("Submitting your vote...");
      
      try {
        const provider = new AnchorProvider(
          connection,
          wallet as anchor.Wallet,
          {}
        );
        const program = new Program(idl as any, provider);
        
        console.log("Submitting vote...");
        
        // Add optimistic update - immediately show the vote locally
        const optimisticVote: VoteEntity = { option };
        const newVotes = new Map(votes);
        const currentVotes = newVotes.get(selectedPoll) || [];
        newVotes.set(selectedPoll, [...currentVotes, optimisticVote]);
        setVotes(newVotes);
        
        setVoteMessage("Confirming transaction...");
        
        const tx = await program.methods
          .vote(selectedPoll, option)
          .accounts({
            data: globalDataAccount,
            voter: wallet.publicKey,
          })
          .rpc({ 
            skipPreflight: false, 
            preflightCommitment: 'confirmed',
            commitment: 'confirmed'
          });
        
        console.log("Vote submitted successfully:", tx);
        setVoteMessage("Vote confirmed! Loading updated results...");
        
        // Reload polls and votes to reflect the new vote
        await loadPolls();
        await loadVotes(selectedPoll);
        
        setVoteMessage("Vote successful!");
        
        // Show results after successful vote
        setTimeout(() => {
          setPageState(PageState.Results);
          setVoteMessage(null);
        }, 1000);
        
      } catch (error) {
        console.error("Error submitting vote:", error);
        
        // Revert optimistic update on error
        const revertedVotes = new Map(votes);
        const currentVotes = revertedVotes.get(selectedPoll) || [];
        if (currentVotes.length > 0) {
          currentVotes.pop(); // Remove the last optimistic vote
          revertedVotes.set(selectedPoll, currentVotes);
          setVotes(revertedVotes);
        }
        
        setVoteMessage("Failed to submit vote. Please try again.");
        setTimeout(() => setVoteMessage(null), 3000);
      } finally {
        console.log("Setting voting state to false");
        setIsVoting(false);
      }
    } else {
      console.log("Vote conditions not met - cannot submit vote");
      setVoteMessage("Cannot submit vote - missing wallet, poll, or data account");
      setTimeout(() => setVoteMessage(null), 3000);
    }
  };

  const loadResultVotes = (): Array<VoteEntity> => {
    if (selectedPoll === null) {
      return [];
    }
    const pollVotes = votes.get(selectedPoll);
    if (pollVotes === undefined) {
      return [];
    }
    return pollVotes;
  };

  const loadSelectedPoll = (): PollEntity | undefined => {
    if (selectedPoll === null) {
      return undefined;
    }
    return polls.find((poll) => poll.id === selectedPoll);
  };

  const renderPolls = (): JSX.Element => {
    if (isLoading) {
      return (
        <LoadingState>
          <LoadingSpinner />
          <LoadingText>Loading polls...</LoadingText>
        </LoadingState>
      );
    }
    
    if (polls.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon />
          <EmptyStateTitle>No Polls Available</EmptyStateTitle>
          <EmptyStateText>
            Be the first to create a poll and get the conversation started!<br />
            Click "New Poll" in the navigation to begin.
          </EmptyStateText>
        </EmptyState>
      );
    }
    
    return (
      <>
        <ButtonContainer>
          <RefreshButton 
            onClick={loadPolls}
            disabled={isLoading}
            $loading={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh Polls'}
          </RefreshButton>
        </ButtonContainer>
        <PollsGrid>
          {polls.map((poll) => (
            <Poll
              key={poll.id}
              poll={poll}
              onShowResult={() => handleShowResult(poll.id)}
              onVotePoll={() => handleVote(poll.id)}
              isLoading={isLoading}
            />
          ))}
        </PollsGrid>
      </>
    );
  };

  const renderResults = (): JSX.Element => {
    const votes = loadResultVotes();
    const selectedPoll = loadSelectedPoll();
    const poll = selectedPoll;
    
    if (!selectedPoll || poll === undefined) {
      console.error(`no such poll ${selectedPoll}`);
      return <></>;
    }
    return (
      <Results
        poll={selectedPoll}
        onVotePoll={() => handleVote(poll.id)}
        onGoBack={handleGoback}
        votes={votes}
        onRefresh={() => loadVotes(poll.id)}
      />
    );
  };

  const renderVoteForm = () => {
    const selectedPoll = loadSelectedPoll();
    const pollId = selectedPoll;
    if (!selectedPoll || pollId === null) {
      console.error(`no such poll ${selectedPoll}`);
      return <></>;
    }
    if (selectedPoll.closed) {
      console.error(`poll ${pollId} is closed`);
      return <></>;
    }
    console.log("Rendering Vote component with isVoting:", isVoting, "voteMessage:", voteMessage);
    return (
      <Vote
        poll={selectedPoll}
        onSubmit={handleVoteSubmit}
        onGoBack={handleGoback}
        isVoting={isVoting}
        voteMessage={voteMessage}
      />
    );
  };

  const componentToRender = (): JSX.Element => {
    if (pageState === PageState.Polls) {
      return (
        <>
          <PageHeader>
            <PageTitle>Community Polls</PageTitle>
            <PageSubtitle>Discover and participate in the latest community discussions</PageSubtitle>
          </PageHeader>
          {renderPolls()}
        </>
      );
    } else if (pageState === PageState.Results) {
      return renderResults();
    } else {
      return renderVoteForm();
    }
  };

  React.useEffect(() => {
    if (wallet && globalDataAccount) {
      loadPolls();
    }
  }, [wallet, globalDataAccount]);

  return (
    <Container>
      <ContentWrapper>
        {componentToRender()}
      </ContentWrapper>
    </Container>  
  );
};

export default Polls;