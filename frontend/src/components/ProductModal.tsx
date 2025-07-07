import React from 'react';
import styled from '@emotion/styled';
import { Product, GoldColor, goldColorMap } from '../types';
import { colors, typography, spacing } from '../styles/typography';
import StarRating from './StarRating';

interface ProductModalProps {
  product: Product;
  selectedColor: GoldColor;
  goldPrice?: number;
  onColorChange: (color: GoldColor) => void;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: ${colors.background};
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 540px;
  display: flex;
  flex-direction: column;
  gap: ${spacing.contentGap};
  animation: fadeInScale 200ms ease-in-out;

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${colors.text};
  &:focus {
    outline: none;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
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

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ColorOptions = styled.div`
  display: flex;
  gap: ${spacing.contentGap};
  margin: 8px 0;
`;

interface ColorSwatchProps {
  color: string;
  isSelected: boolean;
}

const ColorSwatch = styled.button<ColorSwatchProps>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: ${(props) => (props.isSelected ? '2px solid black' : '1px solid transparent')};
  cursor: pointer;
  padding: 0;
  position: relative;
  box-sizing: content-box;

  ${(props) =>
    props.isSelected &&
    `
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

const ProductModal: React.FC<ProductModalProps> = ({ product, selectedColor, goldPrice, onColorChange, onClose }) => {
  const calculatePrice = () => {
    if (!goldPrice) return product.price;
    return (product.popularityScore + 1) * product.weight * goldPrice;
  };

  const formattedPrice = calculatePrice().toFixed(2);

  const getColorLabel = (color: GoldColor): string => {
    return `${color.charAt(0).toUpperCase() + color.slice(1)} Gold`;
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton aria-label="Close modal" onClick={onClose}>×</CloseButton>
        <ProductImage src={product.images[selectedColor]} alt={`${product.name} in ${selectedColor} gold`} />
        <ProductTitle>{product.name}</ProductTitle>
        <InfoRow>
          <ProductPrice>${formattedPrice} USD {!goldPrice && '(Using base price)'}</ProductPrice>
          <span style={{ fontSize: '12px', color: colors.textSecondary }}>24K Gold • {product.weight}g</span>
        </InfoRow>

        <ColorLabel>Select Color</ColorLabel>
        <ColorOptions>
          {(Object.keys(goldColorMap) as GoldColor[]).map((color) => (
            <ColorSwatch
              key={color}
              color={goldColorMap[color]}
              isSelected={selectedColor === color}
              onClick={() => onColorChange(color)}
              aria-label={`${color} gold`}
            />
          ))}
        </ColorOptions>
        <ColorLabel>{getColorLabel(selectedColor)}</ColorLabel>

        <StarRating rating={product.popularityScore * 5} />
      </ModalContainer>
    </Overlay>
  );
};

export default ProductModal; 