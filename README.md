# Product Listing Application

A full-stack application that displays product listings with filtering capabilities and a modern UI.

## Features

- Backend API serving product data with filtering
- Frontend UI with:
  - Product cards displaying name, price, and popularity
  - Image carousel with arrow navigation and swipe support
  - Gold color picker (Yellow, White, Rose)
  - Responsive design for desktop and mobile
  - Price and popularity filters

## Tech Stack

- Backend:
  - Node.js with Express
  - TypeScript
  - REST API

- Frontend:
  - React with TypeScript
  - Emotion for styled components
  - Swiper for image carousel
  - Modern UI with custom fonts (Avenir, Montserrat)

## Setup

1. Install dependencies for both backend and frontend:
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   ```

2. Start the development servers:
   ```bash
   # From the root directory
   npm start
   ```

   This will start both the backend server (port 3001) and frontend development server (port 3000).

## API Endpoints

- `GET /api/products`: Get all products
  - Query parameters:
    - `minPrice`: Filter products with price >= minPrice
    - `maxPrice`: Filter products with price <= maxPrice
    - `minPopularity`: Filter products with popularity score >= minPopularity

## Development

- Backend server runs on `http://localhost:3001`
- Frontend development server runs on `http://localhost:3000`
- Product data is served from `products.json` 