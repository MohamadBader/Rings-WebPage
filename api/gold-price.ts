import { VercelRequest, VercelResponse } from '@vercel/node';

// Fetch live gold price (XAU) in USD, convert to USD per gram 24k
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.METAL_PRICE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing METAL_PRICE_API_KEY env variable' });
  }

  const url = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=XAU`;

  try {
    const apiRes = await fetch(url);
    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: 'Failed to fetch metal price' });
    }
    const data = await apiRes.json();

    if (!data.success) {
      return res.status(500).json({ error: 'MetalPriceAPI returned unsuccessful response', data });
    }

    // MetalPriceAPI returns USD per XAU (troy ounce). Convert to USD per gram.
    const gramsPerTroyOunce = 31.1035;
    const usdPerOunce = 1 / data.rates.XAU;
    const usdPerGram = usdPerOunce / gramsPerTroyOunce;

    return res.status(200).json({ pricePerGram24k: usdPerGram, timestamp: data.timestamp });
  } catch (err) {
    console.error('Error fetching gold price:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 