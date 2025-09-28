import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";

const RadioContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 8px 0;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #512da8;
    background-color: #f0f0f0;
  }

  &:has(input:checked) {
    border-color: #512da8;
    background-color: #e8e0f7;
  }
`;

const InputRadio = styled.input`
  margin-right: 12px;
  width: 18px;
  height: 18px;
  accent-color: #512da8;
  cursor: pointer;
`;

const RadioLabel = styled.label`
  font-size: 1.1em;
  color: #333;
  cursor: pointer;
  flex: 1;
`;

interface Props {
  label: string;
  value: string;
  name?: string;
  onChange?: (event: React.FormEvent<EventTarget>) => void;
}

const Radio = (props: Props) => (
  <RadioContainer>
    <InputRadio
      type="radio"
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      id={`${props.name}-${props.value}`}
    />
    <RadioLabel htmlFor={`${props.name}-${props.value}`}>{props.label}</RadioLabel>
  </RadioContainer>
);

export default hot(Radio);
