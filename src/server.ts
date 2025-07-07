import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;
const GOLD_PRICE = 20; // Constant gold price as specified

app.use(cors());
app.use(express.json());

// Product interface
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

// Read products from JSON file
const getProducts = (): Product[] => {
  try {
    const productsFile = path.resolve(__dirname, '..', 'products.json');
    console.log('Looking for products file at:', productsFile);
    
    if (!fs.existsSync(productsFile)) {
      console.error('Products file not found:', productsFile);
      return [];
    }

    const productsData = fs.readFileSync(productsFile, 'utf-8');
    console.log('Products data loaded:', productsData.substring(0, 100) + '...');
    
    let products: Product[];
    
    try {
      products = JSON.parse(productsData);
      console.log('Products parsed successfully, count:', products?.length || 0);
    } catch (parseError) {
      console.error('Error parsing products JSON:', parseError);
      return [];
    }
    
    if (!Array.isArray(products)) {
      console.error('Products data is not an array');
      return [];
    }

    // Add IDs to products
    return products.map((product, index) => ({
      ...product,
      id: (index + 1).toString()
    }));
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
};

// Calculate price for a product
const calculatePrice = (product: Product): number => {
  return (product.popularityScore + 1) * product.weight * GOLD_PRICE;
};

// Products route with filtering
app.get('/api/products', (req, res) => {
  try {
    const { minPrice, maxPrice, minPopularity, maxPopularity } = req.query;
    let products = getProducts();

    // Add prices to products
    let productsWithPrices: ProductWithPrice[] = products.map(product => ({
      ...product,
      price: calculatePrice(product)
    }));

    // Apply filters
    if (minPrice) {
      productsWithPrices = productsWithPrices.filter(
        product => product.price >= Number(minPrice)
      );
    }

    if (maxPrice) {
      productsWithPrices = productsWithPrices.filter(
        product => product.price <= Number(maxPrice)
      );
    }

    if (minPopularity) {
      productsWithPrices = productsWithPrices.filter(
        product => product.popularityScore >= Number(minPopularity)
      );
    }

    if (maxPopularity) {
      productsWithPrices = productsWithPrices.filter(
        product => product.popularityScore <= Number(maxPopularity)
      );
    }

    res.json(productsWithPrices);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 