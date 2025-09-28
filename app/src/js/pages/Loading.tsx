import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
  width: 100%;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Loader = styled.div`
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid #007bff;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

const Text = styled.h3`
  color: #6c757d;
  font-weight: 400;
  margin: 0;
`;

const Loading = () => (
  <Container>
    <Loader />
    <Text>Loading...</Text>
  </Container>
);

export default hot(Loading);
