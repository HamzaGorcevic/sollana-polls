import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";

import PollEntity from "../../lib/poll";
import Submit from "../form/Submit";

const Row = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  margin: 1.5rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
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

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }
`;

const Title = styled.div`
  color: #2d3748;
  font-size: 1.5em;
  font-weight: 700;
  text-align: left;
  margin-bottom: 1.5rem;
  line-height: 1.4;
  position: relative;
`;

const StatusBadge = styled.div<{ $closed: boolean }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 600;
  margin-bottom: 1rem;
  background-color: ${props => props.$closed ? '#f56565' : '#48bb78'};
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Cta = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

interface Props {
  poll: PollEntity;
  onShowResult: () => void;
  onVotePoll: () => void;
  isLoading?: boolean;
}

const Poll = (props: Props) => (
  <Row>
    <StatusBadge $closed={props.poll.closed}>
      {props.poll.closed ? 'Closed' : 'Active'}
    </StatusBadge>
    <Title>{props.poll.title}</Title>
    <Cta>
      <Submit 
        onClick={props.onShowResult} 
        text="View Results" 
        disabled={props.isLoading}
      />
      <Submit
        onClick={props.onVotePoll}
        text="Vote Now"
        disabled={props.poll.closed || props.isLoading}
      />
    </Cta>
  </Row>
);

export default hot(Poll);
