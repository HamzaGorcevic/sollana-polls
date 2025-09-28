import * as React from "react";
import styled from "styled-components";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

const Header = styled.header`
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  font-size: 1rem;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 100;
`;

const LogoSection = styled.div`
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SolanaLogo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: rotate(5deg) scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.5px;
`;

const LinkSection = styled.div`
  flex-grow: 1;
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;

const StyledLink = styled(RouterLink)<{ $active?: boolean }>`
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.85)'};
  text-decoration: none;
  font-weight: ${props => props.$active ? '600' : '500'};
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
  
  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  ${props => props.$active && `
    background-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 2px;
      background: white;
      border-radius: 2px;
    }
  `}
`;

const WalletSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding: 0 2rem;
  align-items: center;
  
  /* Customize wallet adapter buttons to match menu design */
  .wallet-adapter-button {
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    color: white !important;
    border-radius: 8px !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    height: 34px !important;
    padding: 6px 12px !important;
    min-width: auto !important;
    transition: all 0.3s ease !important;
    letter-spacing: 0.3px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    
    &:not(:disabled):hover {
      background: rgba(255, 255, 255, 0.2) !important;
      border-color: rgba(255, 255, 255, 0.3) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    }
    
    &:active {
      transform: translateY(0) !important;
    }
  }
  
  .wallet-adapter-button-trigger {
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    color: white !important;
    border-radius: 8px !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    height: 34px !important;
    padding: 6px 12px !important;
    min-width: auto !important;
    letter-spacing: 0.3px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    
    &:not(:disabled):hover {
      background: rgba(255, 255, 255, 0.2) !important;
      border-color: rgba(255, 255, 255, 0.3) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    }
  }
  
  /* Target the icon container specifically */
  .wallet-adapter-button-start-icon,
  .wallet-adapter-button-end-icon {
    width: 16px !important;
    height: 16px !important;
    margin-right: 6px !important;
    margin-left: 0 !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    flex-shrink: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  /* Target the actual image inside the icon */
  .wallet-adapter-button-start-icon img,
  .wallet-adapter-button-end-icon img {
    width: 16px !important;
    height: 16px !important;
    object-fit: contain !important;
  }
  
  /* Ensure text has proper spacing */
  .wallet-adapter-button {
    & > *:not(.wallet-adapter-button-start-icon):not(.wallet-adapter-button-end-icon) {
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
  }
  
  /* Fix end icon spacing (for disconnect button) */
  .wallet-adapter-button-end-icon {
    margin-right: 0 !important;
    margin-left: 6px !important;
  }
  
  /* Fix dropdown positioning */
  .wallet-adapter-dropdown {
    background: white !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
    margin-top: 8px !important;
    right: 0 !important;
    left: auto !important;
    width: 240px !important;
    max-height: 300px !important;
    overflow-y: auto !important;
  }
`;

const Menu = () => {
  const location = useLocation();
  
  // JavaScript solution to remove dropdown elements
  React.useEffect(() => {
    const removeDropdowns = () => {
      // Remove dropdown containers
      const dropdowns = document.querySelectorAll('.wallet-adapter-dropdown');
      dropdowns.forEach(dropdown => {
        if (dropdown && dropdown.parentNode) {
          dropdown.remove();
        }
      });
      
      // Remove dropdown lists
      const dropdownLists = document.querySelectorAll('.wallet-adapter-dropdown-list');
      dropdownLists.forEach(list => {
        if (list && list.parentNode) {
          list.remove();
        }
      });
      
      // Remove dropdown items
      const dropdownItems = document.querySelectorAll('.wallet-adapter-dropdown-list-item');
      dropdownItems.forEach(item => {
        if (item && item.parentNode) {
          item.remove();
        }
      });
      
      // Remove elements by aria-label
      const ariaDropdowns = document.querySelectorAll('[aria-label="dropdown-list"]');
      ariaDropdowns.forEach(element => {
        if (element && element.parentNode) {
          element.remove();
        }
      });
      
      // Remove elements by role
      const menuElements = document.querySelectorAll('[role="menu"], [role="menuitem"]');
      menuElements.forEach(element => {
        if (element && element.parentNode && 
            (element.classList.contains('wallet-adapter-dropdown-list') || 
             element.classList.contains('wallet-adapter-dropdown-list-item'))) {
          element.remove();
        }
      });
    };
    
    // Remove immediately
    removeDropdowns();
    
    // Set up observer to remove dropdowns when they're added
    const observer = new MutationObserver(() => {
      removeDropdowns();
    });
    
    // Observe the entire document for dropdown additions
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
    });
    
    // Also use interval as backup
    const interval = setInterval(removeDropdowns, 100);
    
    // Cleanup
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);
  
  return (
    <Header>
      <LogoSection>
        <SolanaLogo 
          src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" 
          alt="Solana Logo" 
        />
        <Title>Solana Polls</Title>
      </LogoSection>
      <LinkSection>
        <StyledLink to="/" $active={location.pathname === '/'}>
          Home
        </StyledLink>
        <StyledLink to="/polls" $active={location.pathname === '/polls'}>
          Polls
        </StyledLink>
        <StyledLink to="/new" $active={location.pathname === '/new'}>
          New Poll
        </StyledLink>
      </LinkSection>
      <WalletSection>
        <WalletMultiButton />
        <WalletDisconnectButton />
      </WalletSection>
    </Header>
  );
};

export default Menu;