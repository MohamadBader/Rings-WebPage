import React from 'react';
import styled from '@emotion/styled';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { IconType, IconBaseProps } from 'react-icons';
import { typography } from '../styles/typography';

interface StarRatingProps {
  rating: number;
  showScore?: boolean;
  selectedStars?: number[];
}

type IconProps = Partial<IconBaseProps>;

interface IconComponentProps {
  icon: IconType;
}

const IconComponent = ({ icon: Icon, ...props }: IconComponentProps & IconProps) => {
  return React.createElement(Icon as React.ComponentType<IconBaseProps>, props);
};

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 2px;
`;

const StarWrapper = styled.div<{ isSelected?: boolean }>`
  position: relative;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.isSelected ? '8px' : '0'};
  border: ${props => props.isSelected ? '2px solid black' : 'none'};
  border-radius: 50%;
  background: ${props => props.isSelected ? 'white' : 'transparent'};
`;

const PartialStarContainer = styled(StarWrapper)<{ fillPercentage: number }>`
  .star-background {
    color: #E6E6E6;
    position: absolute;
  }

  .star-clip {
    color: #E6CA97;
    clip-path: ${props => `inset(0 ${100 - props.fillPercentage}% 0 0)`};
    position: absolute;
  }
`;

const Score = styled.span`
  ${typography.rating};
`;

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasPartialStar = rating % 1 !== 0;
  const partialFill = (rating % 1) * 100;

  const renderStar = (index: number) => {
    if (index < fullStars) {
      return (
        <StarWrapper key={index}>
          <IconComponent icon={AiFillStar} style={{ color: '#E6CA97' }} size={16} />
        </StarWrapper>
      );
    }

    if (index === fullStars && hasPartialStar) {
      return (
        <PartialStarContainer key={index} fillPercentage={partialFill}>
          <IconComponent icon={AiOutlineStar} className="star-background" size={16} />
          <IconComponent icon={AiFillStar} className="star-clip" size={16} />
        </PartialStarContainer>
      );
    }

      return (
      <StarWrapper key={index}>
          <IconComponent icon={AiOutlineStar} style={{ color: '#E6E6E6' }} size={16} />
        </StarWrapper>
      );
  };

  return (
    <RatingContainer>
      <StarsContainer>
        {[0, 1, 2, 3, 4].map(renderStar)}
      </StarsContainer>
      <Score>{rating.toFixed(1)}/5</Score>
    </RatingContainer>
  );
};

export default StarRating; 