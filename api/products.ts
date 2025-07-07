import { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import fs from 'fs';

const GOLD_PRICE = 20;

interface Product {
  id?: string;
  name: string;
  popularityScore: number;
  weight: number;
  images: {
    yellow: string;
    white: string;
    rose: string;
  };
}

interface ProductWithPrice extends Product {
  price: number;
}

const getProducts = (): Product[] => {
  try {
    const productsFile = path.resolve(process.cwd(), 'products.json');

    if (!fs.existsSync(productsFile)) {
      console.error('Products file not found:', productsFile);
      return [];
    }

    const productsData = fs.readFileSync(productsFile, 'utf-8');
    let products: Product[] = JSON.parse(productsData);

    if (!Array.isArray(products)) {
      console.error('Products data is not an array');
      return [];
    }

    return products.map((product, index) => ({
      ...product,
      id: (index + 1).toString(),
    }));
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
};

const calculatePrice = (product: Product): number => {
  return (product.popularityScore + 1) * product.weight * GOLD_PRICE;
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { minPrice, maxPrice, minPopularity, maxPopularity } = req.query;
    let products = getProducts();

    let productsWithPrices: ProductWithPrice[] = products.map((product) => ({
      ...product,
      price: calculatePrice(product),
    }));

    if (minPrice) {
      productsWithPrices = productsWithPrices.filter(
        (product) => product.price >= Number(minPrice)
      );
    }

    if (maxPrice) {
      productsWithPrices = productsWithPrices.filter(
        (product) => product.price <= Number(maxPrice)
      );
    }

    if (minPopularity) {
      productsWithPrices = productsWithPrices.filter(
        (product) => product.popularityScore >= Number(minPopularity)
      );
    }

    if (maxPopularity) {
      productsWithPrices = productsWithPrices.filter(
        (product) => product.popularityScore <= Number(maxPopularity)
      );
    }

    res.status(200).json(productsWithPrices);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 