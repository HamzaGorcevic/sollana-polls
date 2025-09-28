import * as React from "react";
import styled from "styled-components";
import { useWallet } from "@solana/wallet-adapter-react";
import { Link } from "react-router-dom";

const Container = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const StyledLink = styled(Link)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const PrimaryButton = styled(StyledLink)`
  background: #007bff;
  border-color: #007bff;
  
  &:hover {
    background: #0056b3;
    border-color: #0056b3;
  }
`;

const Features = styled.div`
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 800px;
  width: 100%;
`;

const Feature = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const FeatureTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const FeatureText = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const Home = () => {
  const { connected } = useWallet();

  return (
    <Container>
      <Title>Solana Polls</Title>
      <Subtitle>
        Create and participate in decentralized polls on the Solana blockchain. 
        Your votes are secure, transparent, and immutable.
      </Subtitle>
      
      <ButtonGroup>
        <PrimaryButton to="/polls">
          View Polls
        </PrimaryButton>
        <StyledLink to="/new">
          Create Poll
        </StyledLink>
      </ButtonGroup>

      <Features>
        <Feature>
          <FeatureTitle>🔒 Secure</FeatureTitle>
          <FeatureText>
            All polls and votes are stored on the Solana blockchain, ensuring security and immutability.
          </FeatureText>
        </Feature>
        <Feature>
          <FeatureTitle>🌐 Decentralized</FeatureTitle>
          <FeatureText>
            No central authority controls the polls. The community decides what matters.
          </FeatureText>
        </Feature>
        <Feature>
          <FeatureTitle>⚡ Fast</FeatureTitle>
          <FeatureText>
            Built on Solana's high-performance blockchain for instant transactions and results.
          </FeatureText>
        </Feature>
      </Features>
    </Container>
  );
};

export default Home;
