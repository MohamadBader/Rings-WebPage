import React from 'react';
import styled from '@emotion/styled';
import { typography } from '../styles/typography';

interface SortBarProps {
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  currentSort: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

const SortContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const SortGrid = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

const SortGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Label = styled.label`
  ${typography.body1};
  color: #333;
  font-weight: 500;
  white-space: nowrap;

  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
`;

const Select = styled.select`
  padding: 10px 14px;
  border: 2px solid #E6CA97;
  border-radius: 4px;
  ${typography.body1};
  background-color: white;
  cursor: pointer;
  min-width: 150px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  padding-right: 40px;
  
  &:focus {
    outline: none;
    border-color: #b4975a;
    box-shadow: 0 0 0 2px rgba(230, 202, 151, 0.25);
  }

  &:hover {
    border-color: #b4975a;
  }
`;

const OrderButtonGroup = styled.div`
  display: flex;
  gap: 1px;
  background: #E6CA97;
  padding: 2px;
  border-radius: 4px;
`;

const OrderButton = styled.button<{ isActive: boolean }>`
  padding: 8px 16px;
  border: none;
  background-color: ${props => props.isActive ? '#b4975a' : 'white'};
  color: ${props => props.isActive ? 'white' : '#333'};
  ${typography.body1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s ease;
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 6px;

  &:first-of-type {
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }

  &:last-of-type {
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }

  &:hover:not(:disabled) {
    background-color: ${props => props.isActive ? '#a3864d' : '#f7f3ea'};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(230, 202, 151, 0.25);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SortBar: React.FC<SortBarProps> = ({ onSortChange, currentSort }) => {
  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value, currentSort.sortOrder);
  };

  const handleOrderChange = (order: 'asc' | 'desc') => {
    onSortChange(currentSort.sortBy, order);
  };

  return (
    <SortContainer>
      <SortGrid>
        <SortGroup>
          <Label>Sort by:</Label>
          <Select 
            value={currentSort.sortBy} 
            onChange={handleSortByChange}
            aria-label="Sort products by"
          >
            <option value="">Default order</option>
            <option value="price">Price</option>
            <option value="popularityScore">Rating</option>
          </Select>
        </SortGroup>

        <OrderButtonGroup>
          <OrderButton
            onClick={() => handleOrderChange('desc')}
            isActive={currentSort.sortOrder === 'desc'}
            disabled={!currentSort.sortBy}
            aria-label="Sort descending"
            title="High to Low"
          >
            <span>↓ High to Low</span>
          </OrderButton>
          <OrderButton
            onClick={() => handleOrderChange('asc')}
            isActive={currentSort.sortOrder === 'asc'}
            disabled={!currentSort.sortBy}
            aria-label="Sort ascending"
            title="Low to High"
          >
            <span>↑ Low to High</span>
          </OrderButton>
        </OrderButtonGroup>
      </SortGrid>
    </SortContainer>
  );
};

export default SortBar; 