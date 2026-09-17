# NeedyZone — Modern Electronics eCommerce & Admin Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16.1-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://ecommerce-page-sagar711993-8671s-projects.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

A full-stack, enterprise-ready eCommerce storefront and admin management platform for high-performance electronics, surveillance systems, networking devices, and consumer hardware. Built with Next.js 15 (App Router), Prisma ORM, Tailwind CSS, DaisyUI, and Zustand.

---

## 🌐 Live Production

- **Live Storefront**: [https://ecommerce-page-sagar711993-8671s-projects.vercel.app](https://ecommerce-page-sagar711993-8671s-projects.vercel.app)
- **Admin Dashboard**: [https://ecommerce-page-sagar711993-8671s-projects.vercel.app/admin](https://ecommerce-page-sagar711993-8671s-projects.vercel.app/admin)
- **GitHub Repository**: [https://github.com/shivsagar1993/needyzone-ecommerce](https://github.com/shivsagar1993/needyzone-ecommerce)

---

## ✨ Features

### 🛒 Storefront & Catalog
- **Category Isolation & Strict Filtering**: Browse dedicated department routes (`/shop/cctv-security`, `/shop/mobile-chargers`, `/shop/data-cables`, `/shop/digital-switches`, `/shop/power-strips`, `/shop/networking-devices`, `/shop/usb-products`).
- **Category Badges**: Real-time category indicators on all product cards and inventory listings.
- **Modern E-Commerce Pagination**:
  - Dynamic catalog counter (*"Showing 1 to 9 of 21 products • Page 1 of 3"*).
  - Numbered page pills with active highlighted states and hover effects.
  - Jump to first, previous, next, and jump to last page controls.
  - Automatic page reset when adjusting price range or availability filters.
  - Smooth catalog scroll on page change.
- **Dynamic Product Filtering**: Real-time price slider, in-stock / out-of-stock toggles, star rating filters, and multiple sorting options (Price Low-to-High, Price High-to-Low, Popularity, Title).
- **Product Details & Live Preview**: High-resolution gallery, stock badges, technical specifications, and related items.
- **Shopping Cart & Wishlist**: Persistent cart, instant quantity updates, checkout flow, and wishlist management.

### 📑 Invoice & Order Processing
- **Automated Pro-Forma Invoice Generation**: Branded invoice generation with official NeedyZone company header, tax breakdown, and shipping details.
- **Print / PDF Export**: Clean, high-fidelity print layout designed for standard A4 and PDF saving.

### 🛠️ Admin Dashboard
- **Product Inventory Management**:
  - Full CRUD functionality for products and categories.
  - Inline **Live Preview** button on every product row to view the storefront listing instantly.
  - Search by product title, brand, or manufacturer.
  - Clean table pagination (10 items per page).
- **Analytics & Orders Tracking**: Revenue metrics, order statuses, customer tracking, and stock monitors.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15.5 (App Router, Server Components & Route Handlers) |
| **Language** | TypeScript |
| **UI & Styling** | Tailwind CSS, DaisyUI, Flowbite React, React Icons (FA6) |
| **State Management** | Zustand (Cart, Wishlist, Pagination, Sorting) |
| **Database & ORM** | Prisma ORM with SQLite (Development) / PostgreSQL (Production) |
| **Authentication** | NextAuth.js |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/shivsagar1993/needyzone-ecommerce.git
cd needyzone-ecommerce
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3010"
NEXTAUTH_SECRET="your-super-secret-key"

# App Port
PORT=3010
```

### 4. Setup Database
```bash
# Push schema to database
npx prisma db push

# Seed NeedyZone catalog & categories
node scripts/seed-needyzone.js
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3010](http://localhost:3010) in your browser.

---

## 📡 Key API Routes

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Paginated product catalog with category, price, rating, stock filters & metadata headers (`x-total-count`, `x-total-pages`) |
| `POST` | `/api/products` | Create a new catalog product with category association |
| `GET` | `/api/products/[id]` | Fetch single product by ID or slug |
| `PUT` | `/api/products/[id]` | Update product details, price, inventory, and category |
| `DELETE` | `/api/products/[id]` | Remove product and unlink order references |
| `GET` | `/api/categories` | List all active product categories |
| `GET` | `/api/orders` | Fetch customer orders and statuses |

---

## 📜 Copyright & License

Copyright © 2026 **Shivsagar Kumar** ([@shivsagar1993](https://github.com/shivsagar1993)) — **NeedyZone Technologies**. All Rights Reserved.

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for complete details.
