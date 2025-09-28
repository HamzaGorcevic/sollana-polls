import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled, { keyframes } from "styled-components";

import Submit from "./Submit";

const FormContainer = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
  }
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionLabel = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
  letter-spacing: 0.3px;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  color: #2d3748;
  background: white;
  transition: all 0.3s ease;
  outline: none;
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
    font-weight: 400;
  }
  
  &:disabled {
    background: #f7fafc;
    color: #a0aec0;
    cursor: not-allowed;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const OptionInput = styled.input<{ $hasError?: boolean }>`
  flex: 1;
  padding: 0.875rem;
  border: 2px solid ${props => props.$hasError ? '#fc8181' : '#e2e8f0'};
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #2d3748;
  background: white;
  transition: all 0.3s ease;
  outline: none;
  
  &:focus {
    border-color: ${props => props.$hasError ? '#e53e3e' : '#667eea'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(229, 62, 62, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }
  
  &::placeholder {
    color: #a0aec0;
    font-weight: 400;
  }
  
  &:disabled {
    background: #f7fafc;
    color: #a0aec0;
    cursor: not-allowed;
  }
`;

const OptionNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const RemoveButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: #fed7d7;
  color: #e53e3e;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  &:hover {
    background: #fc8181;
    color: white;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const AddOptionButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  background: transparent;
  color: #718096;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  letter-spacing: 0.3px;
  
  &:hover {
    border-color: #667eea;
    color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  color: #e53e3e;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 0.5rem;
  margin-left: 0.25rem;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-right: 12px;
`;

const MessageContainer = styled.div<{ $type?: 'loading' | 'success' | 'error' }>`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  
  ${props => {
    if (props.$type === 'success') {
      return `
        background: #f0fff4;
        color: #38a169;
        border-color: #9ae6b4;
      `;
    } else if (props.$type === 'error') {
      return `
        background: #fff5f5;
        color: #e53e3e;
        border-color: #fc8181;
      `;
    } else {
      return `
        background: #ebf8ff;
        color: #4299e1;
        border-color: #90cdf4;
      `;
    }
  }}
`;

const SubmitContainer = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
`;

const ValidationMessage = styled.div`
  margin-top: 1rem;
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
`;

interface Props {
  onSubmit: (title: string, options: Array<string>) => void;
  isCreating?: boolean;
  createMessage?: string | null;
}

const NewPollForm = (props: Props) => {
  const [title, setTitle] = React.useState<string>("");
  const [options, setOptions] = React.useState<Array<string>>(["", ""]);
  const [optionErrors, setOptionErrors] = React.useState<Array<boolean>>([]);

  const handleOnTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    
    // Clear error for this option if it now has content
    if (value.trim() && optionErrors[index]) {
      const newErrors = [...optionErrors];
      newErrors[index] = false;
      setOptionErrors(newErrors);
    }
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
      
      const newErrors = [...optionErrors];
      newErrors.splice(index, 1);
      setOptionErrors(newErrors);
    }
  };

  const validateForm = () => {
    const errors = options.map(option => !option.trim());
    setOptionErrors(errors);
    
    const hasEmptyOptions = errors.some(error => error);
    const hasValidTitle = title.trim().length > 0;
    const hasEnoughOptions = options.length >= 2;
    
    return hasValidTitle && hasEnoughOptions && !hasEmptyOptions;
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      const trimmedOptions = options.map(option => option.trim()).filter(option => option.length > 0);
      props.onSubmit(title.trim(), trimmedOptions);
    }
  };

  const getMessageType = () => {
    if (props.createMessage?.includes('successfully') || props.createMessage?.includes('Redirecting')) {
      return 'success';
    } else if (props.createMessage?.includes('Failed') || props.createMessage?.includes('error')) {
      return 'error';
    }
    return 'loading';
  };

  const getValidationMessage = () => {
    if (!title.trim()) return "Please enter a poll title";
    if (options.length < 2) return "Please add at least 2 options";
    if (optionErrors.some(error => error)) return "Please fill in all options - empty options are not allowed";
    return "";
  };

  const isFormValid = !props.isCreating && title.trim() && options.length >= 2 && !optionErrors.some(error => error) && options.every(option => option.trim());

  return (
    <FormContainer>
      {/* Status Message */}
      {props.createMessage && (
        <MessageContainer $type={getMessageType()}>
          {props.isCreating && getMessageType() === 'loading' && <LoadingSpinner />}
          {props.createMessage}
        </MessageContainer>
      )}
      
      <FormSection>
        <SectionLabel htmlFor="poll-title">Poll Question</SectionLabel>
        <TitleInput
          id="poll-title"
          type="text"
          value={title}
          onChange={handleOnTitleChange}
          placeholder="What would you like to ask?"
          disabled={props.isCreating}
          maxLength={200}
        />
      </FormSection>
      
      <FormSection>
        <SectionLabel>Answer Options</SectionLabel>
        <OptionsContainer>
          {options.map((option, index) => (
            <OptionRow key={index}>
              <OptionNumber>{index + 1}</OptionNumber>
              <div style={{ flex: 1 }}>
                <OptionInput
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  disabled={props.isCreating}
                  maxLength={100}
                  $hasError={optionErrors[index]}
                />
                {optionErrors[index] && (
                  <ErrorText>This option cannot be empty</ErrorText>
                )}
              </div>
              {options.length > 2 && (
                <RemoveButton
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  disabled={props.isCreating}
                  title="Remove this option"
                >
                  ×
                </RemoveButton>
              )}
            </OptionRow>
          ))}
          
          {options.length < 6 && (
            <AddOptionButton
              type="button"
              onClick={handleAddOption}
              disabled={props.isCreating}
            >
              + Add Option
            </AddOptionButton>
          )}
        </OptionsContainer>
      </FormSection>
      
      <SubmitContainer>
        <Submit 
          onClick={handleFormSubmit} 
          text={props.isCreating ? "Creating Poll..." : "Create Poll"}
          disabled={!isFormValid}
        />
        
        {!isFormValid && !props.isCreating && (
          <ValidationMessage>
            {getValidationMessage()}
          </ValidationMessage>
        )}
      </SubmitContainer>
    </FormContainer>
  );
};

export default hot(NewPollForm);