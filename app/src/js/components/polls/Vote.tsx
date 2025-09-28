import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import PollEntity from "../../lib/poll";
import Submit from "../form/Submit";
import Radio from "../form/Radio";

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }
`;

const RadioContainer = styled.div`
  padding: 1.5rem 0;
  text-align: left;
`;

const Title = styled.div`
  color: #1a202c;
  font-size: 1.8em;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
  letter-spacing: -0.025em;
`;

const Cta = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 16px;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const MessageContainer = styled.div`
  text-align: center;
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  color: #1976d2;
  font-weight: 600;
  border: 1px solid #bbdefb;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #e3f2fd;
  border-top: 3px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 12px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface Props {
  poll: PollEntity;
  onSubmit: (option: number) => void;
  onGoBack: () => void;
  isVoting?: boolean;
  voteMessage?: string | null;
}

const Vote = (props: Props) => {
  const [option, setOption] = React.useState<number>();
  
  console.log("Vote component rendered with option:", option);
  const handleSubmit = () => {
    console.log("Vote handleSubmit called, option:", option);
    if (option !== undefined) {
      console.log("Calling props.onSubmit with option:", option);
      props.onSubmit(option);
    } else {
      console.log("No option selected, cannot submit");
    }
  };

  const handleRadioInput = (event: React.FormEvent<EventTarget>) => {
    const value = (event.target as HTMLInputElement).value;
    console.log("Radio input changed, value:", value);
    setOption(parseInt(value));
  };
  const options = props.poll.options.map((option) => (
    <Radio
      key={option.id}
      label={option.text}
      name="poll-vote"
      value={option.id.toString()}
      onChange={handleRadioInput}
    />
  ));

  return (
    <Container>
      <Title>{props.poll.title}</Title>
      <RadioContainer>{options}</RadioContainer>
      
      {/* Vote Message */}
      {props.voteMessage && (
        <MessageContainer>
          {props.isVoting && <LoadingSpinner />}
          {props.voteMessage}
        </MessageContainer>
      )}
      
      <Cta>
        <Submit
          onClick={handleSubmit}
          text={props.isVoting ? "Voting..." : "Vote poll"}
          disabled={option === undefined || props.isVoting}
        />
        <Submit
          onClick={props.onGoBack}
          text="Go back"
          icon={<ArrowLeftIcon width={20} />}
          disabled={props.isVoting}
        />
      </Cta>
    </Container>
  );
};

export default hot(Vote);
