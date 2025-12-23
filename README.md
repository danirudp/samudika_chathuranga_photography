# Samudika Chathuranga Photography 📸

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8) ![Performance](https://img.shields.io/badge/Lighthouse-97%2F100-success)

A high-performance, cinematic photography portfolio built for **Samudika Chathuranga**. This project focuses on delivering a "Fine Art" aesthetic with silky smooth animations while maintaining **100% SEO** and **97+ Performance** scores on production.

## 🚀 Live Demo

https://samudika.netlify.app

## ✨ Key Features

- **Cinematic Experience:** Custom-built smooth scrolling using `Lenis` with parallax effects and mouse-movement interactions.
- **Adaptive Performance:** - **Desktop:** Luxury smooth scrolling and high-res visuals.
  - **Mobile:** Native hardware-accelerated scrolling and optimized assets for 60fps performance on low-end devices.
- **Next-Gen Image Optimization:** Uses `next/image` with `sharp`, adaptive `sizes` prop, and blur placeholders to eliminate layout shifts (CLS).
- **SEO Mastered:** Fully automated `sitemap.xml`, `robots.txt`, and JSON-LD structured data for rich snippets in Google Search.

## 🛠 Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Scrolling:** Lenis (Studio Freight)
- **Fonts:** `next/font` (Inter & Playfair Display) with zero layout shift.

## ⚡ Performance Strategy

This project achieves **97-100/100** on Lighthouse by implementing advanced optimization techniques:

1.  **Mobile-First Resource Loading:**
    - Uses specific `sizes` attributes to prevent mobile devices from downloading 4K desktop images.
    - Conditional rendering of `Lenis` smooth scroll (disabled on mobile for CPU efficiency).
2.  **Core Web Vitals:**
    - **LCP (Largest Contentful Paint):** Solved via `priority` loading and pre-warmed connections.
    - **CLS (Cumulative Layout Shift):** 0.00 score due to strict aspect ratio reservation and font optimization.
3.  **Bundle Optimization:**
    - Heavy components (Gallery, Footer) are lazy-loaded using `next/dynamic`.

## 📦 Getting Started

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/yourusername/samudika-photography.git](https://github.com/yourusername/samudika-photography.git)
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

4.  **Open locally:**
    Visit `http://localhost:3000`

## 🏗 Project Structure

```bash
├── app/
│   ├── components/   # Reusable UI components (Navbar, Footer)
│   ├── layout.tsx    # Root layout with Metadata & Font config
│   ├── page.tsx      # Main Homepage with Parallax logic
│   ├── globals.css   # Tailwind directives
│   ├── robots.ts     # SEO Crawling rules
│   └── sitemap.ts    # SEO Sitemap generator
├── public/           # Static assets (images, fonts)
└── next.config.ts    # Image optimization settings

```

🤝 Credits

Developer: Daniru Perera

Photography: Samudika Chathuranga

Design Inspiration: Fine Art & Cinematic Web Trends

© 2025 Samudika Chathuranga Photography. All Rights Reserved.
