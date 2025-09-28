import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import { PieChart } from "react-minimal-pie-chart";
const randomColor = require("randomcolor"); // import the script
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import PollEntity from "../../lib/poll";
import Vote from "../../lib/vote";
import Submit from "../form/Submit";

const Container = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.div`
  color: #2d3748;
  font-size: 1.8em;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
`;

const ChartContainer = styled.div`
  height: 400px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
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

const VoteCount = styled.div`
  text-align: center;
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-size: 1.1em;
  color: #495057;
`;

const OptionList = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const OptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
`;

const OptionText = styled.span`
  font-weight: 500;
  color: #495057;
`;

const OptionCount = styled.span`
  background-color: #007bff;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: 600;
`;

const defaultLabelStyle = {
  color: "white",
  fontSize: "4px",
  fontFamily: "sans-serif",
};

interface Props {
  poll: PollEntity;
  onVotePoll: () => void;
  onGoBack: () => void;
  votes: Array<Vote>;
  onRefresh?: () => void;
}

const Results = (props: Props) => {
  const [data, setData] = React.useState<any[]>([]);

  const generateChartData = (): any[] => {
    let data: any[] = [];
    
    props.poll.options.map((option) => {
      const votes = props.votes.filter(
        (vote) => vote.option === option.id
      ).length;
      data.push({
        title: option.text,
        value: votes,
        color: randomColor({ luminosity: "light" }),
      });
    });
    return data;
  };

  React.useEffect(() => {
    setData(generateChartData());
  }, [props.votes, props.poll.options]);

  const totalVotes = props.votes.length;

  return (
    <Container>
      <Title>{props.poll.title}</Title>
      
      {/* Vote Count */}
      <VoteCount>
        Total Votes: <strong>{totalVotes}</strong>
      </VoteCount>
      
      {/* Option List */}
      <OptionList>
        {props.poll.options.map((option) => {
          const votes = props.votes.filter(vote => vote.option === option.id).length;
          const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          return (
            <OptionItem key={option.id}>
              <OptionText>{option.text}</OptionText>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9em', color: '#6c757d' }}>
                  {percentage}%
                </span>
                <OptionCount>{votes}</OptionCount>
              </div>
            </OptionItem>
          );
        })}
      </OptionList>
      
      {/* Chart */}
      {totalVotes > 0 && (
        <ChartContainer>
          <PieChart
            data={data}
            animate={true}
            label={({ dataEntry }) => `${dataEntry.title} (${dataEntry.value})`}
            labelStyle={{
              ...defaultLabelStyle,
            }}
          />
        </ChartContainer>
      )}
      
      <Cta>
        <Submit
          onClick={props.onVotePoll}
          text="Vote poll"
          disabled={props.poll.closed}
        />
        {props.onRefresh && (
          <Submit
            onClick={props.onRefresh}
            text="Refresh Results"
          />
        )}
        <Submit
          onClick={props.onGoBack}
          text="Go back"
          icon={<ArrowLeftIcon width={20} />}
        />
      </Cta>
    </Container>
  );
};

export default hot(Results);
