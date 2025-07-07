import React from 'react';
import styled from '@emotion/styled';
import { Product, GoldColor, goldColorMap } from '../types';
import { typography, spacing, colors } from '../styles/typography';
import StarRating from './StarRating';

const Card = styled.div`
  border-radius: 8px;
  background: ${colors.background};
  flex: 0 0 auto;
  width: 280px;
  min-width: 250px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${spacing.contentGap};
  padding: 0;
  transition: transform 250ms ease-in-out, box-shadow 250ms ease-in-out;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 240px;
    min-width: 240px;
    max-width: 240px;
    scroll-snap-align: center;
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    scroll-snap-align: center;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 8px;

  @media (max-width: 768px) {
    height: 250px;
  }

  @media (max-width: 480px) {
    height: 220px;
  }
`;

const ProductInfo = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: ${spacing.contentGap};
  text-align: left;
`;

const ProductTitle = styled.h2`
  ${typography.productTitle}
  margin: 0;
  color: ${colors.text};
`;

const ProductPrice = styled.p`
  ${typography.productPrice}
  margin: 0;
  color: ${colors.text};
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GoldPriceInfo = styled.span`
  ${typography.smallText}
  color: ${colors.textSecondary};
  font-size: 12px;
`;

const WeightInfo = styled.span`
  ${typography.smallText}
  color: ${colors.textSecondary};
  font-size: 12px;
`;

const ColorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

const ColorOptions = styled.div`
  display: flex;
  gap: ${spacing.contentGap};
  margin: 0;
`;

interface ColorSwatchProps {
  color: string;
  isSelected: boolean;
}

const ColorSwatch = styled.button<ColorSwatchProps>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${(props: ColorSwatchProps) => props.color};
  border: ${(props: ColorSwatchProps) => props.isSelected ? '2px solid black' : '1px solid transparent'};
  cursor: pointer;
  padding: 0;
  position: relative;
  box-sizing: content-box;

  ${props => props.isSelected && `
    &::before {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      border: 1px solid white;
      border-radius: 50%;
    }
  `}

  &:hover {
    border-color: #666;
  }

  &:focus {
    outline: none;
  }
`;

const ColorLabel = styled.div`
  ${typography.colorLabel}
  margin: 0;
  color: ${colors.text};
`;

interface ProductCardProps {
  product: Product;
  goldPrice?: number;  // Price per gram of 24k gold in USD
  selectedColor: GoldColor;
  onColorChange: (color: GoldColor) => void;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, goldPrice, selectedColor, onColorChange, onClick }) => {
  const getColorLabel = (color: GoldColor): string => {
    return `${color.charAt(0).toUpperCase() + color.slice(1)} Gold`;
  };

  const calculatePrice = () => {
    if (!goldPrice) return product.price;
    // Using the formula: Price = (popularityScore + 1) * weight * goldPrice
    return (product.popularityScore + 1) * product.weight * goldPrice;
  };

  const formattedPrice = calculatePrice().toFixed(2);

  return (
    <Card onClick={onClick} role="button" aria-label={`View details of ${product.name}`}>  
      <ProductImage 
        src={product.images[selectedColor]} 
        alt={`${product.name} in ${selectedColor} gold`} 
      />

      <ProductInfo>
        <ProductTitle>{product.name}</ProductTitle>
        <PriceContainer>
          <ProductPrice>
            ${formattedPrice} USD
            {!goldPrice && ' (Using base price)'}
          </ProductPrice>
          <WeightInfo>
            24K Gold • {product.weight}g
          </WeightInfo>
        </PriceContainer>
        
        <ColorSection>
          <ColorOptions>
            {(Object.keys(goldColorMap) as GoldColor[]).map((color) => (
              <ColorSwatch
                key={color}
                color={goldColorMap[color]}
                isSelected={selectedColor === color}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onColorChange(color);
                }}
                aria-label={`${color} gold`}
              />
            ))}
          </ColorOptions>
          <ColorLabel>{getColorLabel(selectedColor)}</ColorLabel>
        </ColorSection>

        <StarRating rating={product.popularityScore * 5} />
      </ProductInfo>
    </Card>
  );
};

export default ProductCard; 