import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95em;
  height: 2.75rem;
  padding: 0 1.75rem;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    
    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    
    &::before {
      display: none;
    }
  }
`;

interface Props {
  disabled?: boolean;
  text: string;
  icon?: JSX.Element;
  onClick: () => void;
}

const Submit = (props: Props) => (
  <div>
    <Button disabled={props.disabled} onClick={() => props.onClick()}>
      {props.icon} <span>{props.text}</span>
    </Button>
  </div>
);

export default hot(Submit);
