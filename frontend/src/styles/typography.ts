import { css } from '@emotion/react';

export const typography = {
  title: css`
    font-family: 'Avenir Book', sans-serif;
    font-size: 45px;
    font-weight: normal;
  `,
  productTitle: css`
    font-family: 'Montserrat', sans-serif;
    font-size: 15px;
    font-weight: 500;
  `,
  productPrice: css`
    font-family: 'Montserrat', sans-serif;
    font-size: 15px;
    font-weight: normal;
  `,
  colorLabel: css`
    font-family: 'Avenir Book', sans-serif;
    font-size: 12px;
  `,
  rating: css`
    font-family: 'Avenir Book', sans-serif;
    font-size: 14px;
  `,
  body1: css`
    font-family: 'Avenir Book', sans-serif;
    font-size: 14px;
    font-weight: normal;
  `,
  smallText: css`
    font-family: 'Avenir Book', sans-serif;
    font-size: 12px;
    font-weight: normal;
  `,
} as const;

export const spacing = {
  containerPadding: '40px 80px',
  cardGap: '24px',
  contentGap: '12px',
} as const;

export const colors = {
  text: '#000000',
  background: '#FFFFFF',
  scrollbarTrack: '#E6E6E6',
  scrollbarThumb: '#CCCCCC',
  textSecondary: '#666666',
} as const; 