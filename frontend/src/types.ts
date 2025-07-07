export interface Product {
  id: string;
  name: string;
  popularityScore: number;
  weight: number;
  price: number;
  images: {
    yellow: string;
    white: string;
    rose: string;
  };
}

export type GoldColor = 'yellow' | 'white' | 'rose';

export const goldColorMap = {
  yellow: '#E6CA97',
  white: '#D9D9D9',
  rose: '#E1A4A9',
} as const; 