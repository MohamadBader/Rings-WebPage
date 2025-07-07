import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import debounce from 'lodash/debounce';
import { typography } from '../styles/typography';

interface FilterBarProps {
  onFilterChange: (filters: FilterValues) => void;
}

interface FilterValues {
  minPrice: number | null;
  maxPrice: number | null;
  minPopularity: number | null;
  maxPopularity: number | null;
}

interface ValidationErrors {
  minPrice?: string;
  maxPrice?: string;
  minPopularity?: string;
  maxPopularity?: string;
}

const FilterContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  ${typography.body1};
  color: #333;
  font-weight: 500;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const CurrencyPrefix = styled.span`
  position: absolute;
  left: 12px;
  color: #666;
  ${typography.body1};
  pointer-events: none;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  padding-left: ${props => props.type === 'number' && props.name?.includes('Price') ? '24px' : '12px'};
  border: 2px solid ${props => props.hasError ? '#dc3545' : '#E6CA97'};
  border-radius: 4px;
  ${typography.body1};
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#b4975a'};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(220, 53, 69, 0.25)' : 'rgba(230, 202, 151, 0.25)'};
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const ErrorText = styled.span`
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
`;

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterValues>({
    minPrice: null,
    maxPrice: null,
    minPopularity: null,
    maxPopularity: null
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  // Convert backend value (0-1) to UI value (0-5)
  const toUIValue = (value: number | null, isPopularity: boolean): number | null => {
    if (value === null || !isPopularity) return value;
    return value * 5;
  };

  // Convert UI value (0-5) to backend value (0-1)
  const toBackendValue = (value: number | null, isPopularity: boolean): number | null => {
    if (value === null || !isPopularity) return value;
    return value / 5;
  };

  // Debounced filter update
  const debouncedFilterChange = useCallback(
    debounce((newFilters: FilterValues) => {
      // Convert popularity values to backend scale before sending
      const backendFilters = {
        ...newFilters,
        minPopularity: toBackendValue(newFilters.minPopularity, true),
        maxPopularity: toBackendValue(newFilters.maxPopularity, true)
      };
      onFilterChange(backendFilters);
    }, 300),
    [onFilterChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? null : Number(value);
    
    const newFilters = {
      ...filters,
      [name]: numValue
    };

    const newErrors = validateAndUpdateFilters(
      name as keyof FilterValues,
      value,
      filters
    );

    setErrors(newErrors);
    setFilters(newFilters);

    // Only update if there are no errors
    if (Object.keys(newErrors).length === 0) {
      debouncedFilterChange(newFilters);
    }
  };

  const validateAndUpdateFilters = (
    name: keyof FilterValues,
    value: string,
    currentFilters: FilterValues
  ): ValidationErrors => {
    const newErrors: ValidationErrors = { ...errors };
    const numValue = value === '' ? null : Number(value);

    // Clear existing errors for this field
    delete newErrors[name];

    if (numValue !== null) {
      switch (name) {
        case 'minPrice':
          if (currentFilters.maxPrice !== null && numValue > currentFilters.maxPrice) {
            newErrors.minPrice = 'Min price cannot exceed max price';
          }
          if (numValue < 0) {
            newErrors.minPrice = 'Price cannot be negative';
          }
          break;

        case 'maxPrice':
          if (currentFilters.minPrice !== null && numValue < currentFilters.minPrice) {
            newErrors.maxPrice = 'Max price cannot be less than min price';
          }
          if (numValue < 0) {
            newErrors.maxPrice = 'Price cannot be negative';
          }
          break;

        case 'minPopularity':
          if (numValue < 0 || numValue > 5) {
            newErrors.minPopularity = 'Popularity must be between 0 and 5';
          }
          if (currentFilters.maxPopularity !== null && numValue > currentFilters.maxPopularity) {
            newErrors.minPopularity = 'Min popularity cannot exceed max popularity';
          }
          break;

        case 'maxPopularity':
          if (numValue < 0 || numValue > 5) {
            newErrors.maxPopularity = 'Popularity must be between 0 and 5';
          }
          if (currentFilters.minPopularity !== null && numValue < currentFilters.minPopularity) {
            newErrors.maxPopularity = 'Max popularity cannot be less than min popularity';
          }
          break;
      }
    }

    return newErrors;
  };

  return (
    <FilterContainer>
      <FilterGrid>
        <FilterGroup>
          <Label>Price Range</Label>
          <InputWrapper>
            <CurrencyPrefix>$</CurrencyPrefix>
            <Input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filters.minPrice ?? ''}
              onChange={handleInputChange}
              min={0}
              step="0.01"
              hasError={!!errors.minPrice}
            />
          </InputWrapper>
          {errors.minPrice && <ErrorText>{errors.minPrice}</ErrorText>}
          
          <InputWrapper>
            <CurrencyPrefix>$</CurrencyPrefix>
            <Input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filters.maxPrice ?? ''}
              onChange={handleInputChange}
              min={0}
              step="0.01"
              hasError={!!errors.maxPrice}
            />
          </InputWrapper>
          {errors.maxPrice && <ErrorText>{errors.maxPrice}</ErrorText>}
        </FilterGroup>

        <FilterGroup>
          <Label>Popularity (0.0–5.0)</Label>
          <Input
            type="number"
            name="minPopularity"
            placeholder="Min Popularity"
            value={filters.minPopularity ?? ''}
            onChange={handleInputChange}
            min={0}
            max={5}
            step="0.1"
            hasError={!!errors.minPopularity}
          />
          {errors.minPopularity && <ErrorText>{errors.minPopularity}</ErrorText>}
          
          <Input
            type="number"
            name="maxPopularity"
            placeholder="Max Popularity"
            value={filters.maxPopularity ?? ''}
            onChange={handleInputChange}
            min={0}
            max={5}
            step="0.1"
            hasError={!!errors.maxPopularity}
          />
          {errors.maxPopularity && <ErrorText>{errors.maxPopularity}</ErrorText>}
        </FilterGroup>
      </FilterGrid>
    </FilterContainer>
  );
};

export default FilterBar; 