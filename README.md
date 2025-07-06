# RenArt Jewelry Product Listing Web App

A responsive e-commerce style web application showcasing RenArt's jewellery catalogue. The project is built with **React + TypeScript** on the frontend and **Express + TypeScript** on the backend, styled with **Emotion styled-components** and powered by real-time gold prices fetched from **MetalPriceAPI**.

---

## ✨ Key Features

1. **Dynamic Product Carousel**
   * Horizontally scrollable product row with arrow navigation (adaptive scroll size)
   * Smooth snapping & hidden scrollbar until hover

2. **Quick-View Modal**
   * Click any product to open a centred overlay with enlarged image & details
   * Blur background, click outside to dismiss, or hit the × button
   * Shares colour state with card – choose a colour, open modal, stays in sync

3. **Colour Swatches**
   * Three gold colours (Yellow, White, Rose)
   * Buttons reflect selection with ring outline; now sized at 18 px for subtlety

4. **Live 24 K Gold Price**
   * Fetched on app load from MetalPriceAPI (`metalpriceapi.com`) using API key
   * Jewellery price calculated using
     ```text
     Price = (popularityScore + 1) × weight × goldPricePerGram
     ```
   * Gold price value highlighted in gold colour `#E6CA97`

5. **Sorting & Filtering**
   * Filter by price / popularity ranges
   * Sort ascending / descending by price or popularity

6. **Responsive & Accessible**
   * Works from mobile to desktop
   * Keyboard-focusable buttons, aria labels, proper alt tags

7. **Branded UI**
   * Custom fonts: **Avenir Book**, **Montserrat Regular / Medium**
   * Company logo displayed above the main title

---

## 🗂️ Project Structure

```
my-webpage/
├─ frontend/               # React app
│  ├─ src/
│  │  ├─ components/       # Re-usable UI components
│  │  ├─ styles/           # Typography, spacing, colours tokens
│  │  ├─ assets/Fonts/     # Local font files (Avenir & Montserrat)
│  │  └─ ...
│  └─ package.json         # Frontend dependencies & scripts
├─ src/server.ts           # Express API server (backend)
├─ products.json           # Sample product data (used by backend)
├─ package.json            # Root scripts to run both services
└─ tsconfig.json           # Shared TypeScript config
```

---

## ⚙️ Prerequisites

* **Node.js** 18+
* **npm** 9+

---

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/<your-org>/<your-repo>.git
   cd my-webpage
   ```

2. **Install dependencies**
   ```bash
   # Root dependencies (backend & concurrency helpers)
   npm install

   # Frontend dependencies
   cd frontend && npm install
   cd ..
   ```

3. **Environment variables**  
   The MetalPriceAPI key is hard-coded for demo purposes. For production, create a `.env` file in the project root:
   ```env
   METAL_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   and update `src/App.tsx` to read from `process.env`.

4. **Run both servers**
   ```bash
   npm start
   ```
   This executes `concurrently` to launch:
   * **Backend** – http://localhost:3001
   * **Frontend** – http://localhost:3000 (opens automatically)

5. **Build for production**
   ```bash
   # Backend build (TS → JS)
   npm run build

   # Frontend build
   cd frontend && npm run build
   ```

---

## 📡 API Endpoints

| Method | Endpoint                 | Description                              |
| ------ | ------------------------ | ---------------------------------------- |
| GET    | `/api/products`          | Returns products, supports query filters |

Example:  
`/api/products?minPrice=100&maxPopularity=0.8&sortBy=price&sortOrder=asc`

---

## 🛠️ Scripts (root)

| Command           | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `npm start`       | Run backend + frontend concurrently      |
| `npm run dev`     | Backend with nodemon (frontend manual)   |
| `npm run build`   | TypeScript compile for backend           |

---

## 🤝 Contributing

PRs are welcome! Please open an issue first to discuss any major changes.

1. Fork the repo & create your branch (`git checkout -b feature/foo`)
2. Commit your changes (`git commit -am 'Add some foo'`)
3. Push to the branch (`git push origin feature/foo`)
4. Submit a pull request

