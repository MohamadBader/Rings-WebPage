import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import ProductCard from './components/ProductCard';
import FilterBar from './components/FilterBar';
import SortBar from './components/SortBar';
import { Product, GoldColor } from './types';
import { typography, spacing, colors } from './styles/typography';
import ProductModal from './components/ProductModal';

const AppContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: ${spacing.containerPadding};
  font-family: 'Avenir Book', sans-serif;
`;

const Title = styled.h1`
  ${typography.title}
  text-align: center;
  margin: 0 0 20px 0;
  color: ${colors.text};
`;

// Logo
const Logo = styled.img`
  height: 72px;
  display: block;
  margin: 0 auto 16px;
`;

// Gold colored span for price value
const GoldValue = styled.span`
  color: #E6CA97;
`;

const GoldPriceDisplay = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 8px;
`;

const GoldPriceText = styled.p`
  ${typography.productPrice}
  margin: 0;
  color: ${colors.text};
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 0 40px;
`;

const ProductRow = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: ${spacing.cardGap};
  padding: 20px 0;
  align-items: stretch;
  
  /* Hide scrollbar by default */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Show scrollbar on hover/scroll */
  &:hover {
    scrollbar-width: thin;
    -ms-overflow-style: auto;
    &::-webkit-scrollbar {
      display: block;
      height: 4px;
    }

    &::-webkit-scrollbar-track {
      background: ${colors.scrollbarTrack};
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: ${colors.scrollbarThumb};
      border-radius: 2px;
    }
  }
`;

const ScrollButton = styled.button<{ direction: 'left' | 'right'; disabled: boolean }>`
  position: absolute;
  top: 50%;
  ${props => props.direction}: -20px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  z-index: 1;
  
  &:focus {
    outline: none;
  }

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-right: 2px solid #000;
    border-bottom: 2px solid #000;
    transform: ${props => props.direction === 'left' ? 'rotate(135deg)' : 'rotate(-45deg)'};
    margin-${props => props.direction === 'left' ? 'left' : 'right'}: 2px;
  }
`;

interface GoldPriceData {
  pricePerGram24k: number;
  timestamp: number;
}

interface FilterValues {
  minPrice: number | null;
  maxPrice: number | null;
  minPopularity: number | null;
  maxPopularity: number | null;
}

interface SortValues {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<SortValues>({
    sortBy: '',
    sortOrder: 'asc'
  });
  const [selectedColors, setSelectedColors] = useState<Record<string, GoldColor>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const productRowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Commented out gold price fetching for development
  // Will be uncommented when ready for production
  const [goldPrice, setGoldPrice] = useState<GoldPriceData | null>({
    pricePerGram24k: 107.28,  // Using static value for development
    timestamp: Date.now()
  });
  const [goldPriceError, setGoldPriceError] = useState<string | null>(null);
  const [goldPriceLoading, setGoldPriceLoading] = useState(false);

  /* Commenting out gold price fetching to avoid API calls during development
  const fetchGoldPrice = async () => {
    try {
      const response = await fetch("https://api.metalpriceapi.com/v1/latest?api_key=ef36848b688658c8f532b734ec403b6f&base=USD&currencies=XAU");

      if (!response.ok) {
        throw new Error('Failed to fetch gold price');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error('API returned unsuccessful response');
      }

      const gramsPerTroyOunce = 31.1035;
      const usdPerOunce = 1 / data.rates.XAU;
      const usdPerGram = usdPerOunce / gramsPerTroyOunce;

      setGoldPrice({
        pricePerGram24k: usdPerGram,
        timestamp: data.timestamp
      });
      setGoldPriceError(null);
    } catch (err) {
      setGoldPriceError(err instanceof Error ? err.message : 'Failed to fetch gold price');
      console.error('Error fetching gold price:', err);
    } finally {
      setGoldPriceLoading(false);
    }
  };

  useEffect(() => {
    fetchGoldPrice();
  }, []);
  */

  const sortProducts = (productsToSort: Product[]) => {
    if (!sort.sortBy) return productsToSort;

    return [...productsToSort].sort((a, b) => {
      let aValue = sort.sortBy === 'price' ? a.price : a.popularityScore;
      let bValue = sort.sortBy === 'price' ? b.price : b.popularityScore;
      
      if (sort.sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  };

  const fetchProducts = async (filters: FilterValues) => {
    try {
      const params = new URLSearchParams();
      if (filters.minPrice !== null) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== null) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.minPopularity !== null) params.append('minPopularity', filters.minPopularity.toString());
      if (filters.maxPopularity !== null) params.append('maxPopularity', filters.maxPopularity.toString());

      const apiBase = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';
      const response = await fetch(`${apiBase}/api/products?${params.toString()}`);
      const data = await response.json();
      setProducts(sortProducts(data));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleFilterChange = (filters: FilterValues) => {
    fetchProducts(filters);
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    const newSort = { sortBy, sortOrder };
    setSort(newSort);
    setProducts(prevProducts => sortProducts([...prevProducts]));
  };

  useEffect(() => {
    // Initial fetch without filters
    fetchProducts({
      minPrice: null,
      maxPrice: null,
      minPopularity: null,
      maxPopularity: null
    });
  }, []);

  const checkScrollButtons = () => {
    if (productRowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = productRowRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const productRow = productRowRef.current;
    if (productRow) {
      productRow.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => productRow.removeEventListener('scroll', checkScrollButtons);
    }
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (productRowRef.current) {
      const productWidth = 280; // min-width of a product card
      const gapWidth = 24; // from spacing.cardGap
      const containerWidth = productRowRef.current.clientWidth;
      
      // Calculate how many products are visible
      const productsVisible = Math.max(1, Math.floor(containerWidth / (productWidth + gapWidth)));
      
      // Scroll by the number of visible products
      const scrollAmount = (productWidth + gapWidth) * productsVisible;
      
      productRowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <AppContainer>
      <Logo
        src="https://media.licdn.com/dms/image/v2/D4D0BAQFkihBBAQTXlw/company-logo_200_200/B4DZcwdhBbHMAM-/0/1748864734258/renartglobal_logo?e=2147483647&v=beta&t=PKIEyzSbqEWbFHl3k_qjJX9K9QS0eZF3ykBPz5EI6-Q"
        alt="Company Logo"
      />

      <Title>Product List</Title>
      
      <GoldPriceDisplay>
        <GoldPriceText>
          Current 24K Gold Price: {goldPriceLoading ? 'Loading...' :
            goldPriceError ? 'Error loading price' :
            goldPrice ? <GoldValue>${goldPrice.pricePerGram24k.toFixed(2)} USD per gram</GoldValue> : 'Unavailable'}
        </GoldPriceText>
      </GoldPriceDisplay>

      <FilterBar onFilterChange={handleFilterChange} />
      <SortBar onSortChange={handleSortChange} currentSort={sort} />
      
      <CarouselContainer>
        <ScrollButton
          direction="left"
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
        />
        <ProductRow ref={productRowRef}>
          {products.map(product => {
            const selectedColor = selectedColors[product.id] || 'yellow';
            return (
              <ProductCard
                key={product.id}
                product={product}
                goldPrice={goldPrice?.pricePerGram24k}
                selectedColor={selectedColor}
                onColorChange={(color: GoldColor) => setSelectedColors(prev => ({ ...prev, [product.id]: color }))}
                onClick={() => setSelectedProduct(product)}
              />
            );
          })}
        </ProductRow>
        <ScrollButton
          direction="right"
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
        />
      </CarouselContainer>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          selectedColor={selectedColors[selectedProduct.id] || 'yellow'}
          goldPrice={goldPrice?.pricePerGram24k}
          onColorChange={(color: GoldColor) => setSelectedColors(prev => ({ ...prev, [selectedProduct.id]: color }))}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </AppContainer>
  );
}

export default App;
