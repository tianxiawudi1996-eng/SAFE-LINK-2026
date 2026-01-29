# Prinker Project Upgrade Directive

This directive outlines the implementation of the "Prinker" high-end real estate upgrade features.

## Core Features

### 1. Visual & Interaction (Priority: High)
- **Spline 3D Interactive Hero**:
    - Replace static main screen with mouse-responsive 3D objects.
    - Use `@splinetool/react-spline` or `@react-three/fiber`.
    - Tech-heavy, impressive first impression.
- **Real-site Background**:
    - Drone footage/Images of Cheongju sites (Uncheon Jugong, Gagyeong Honggol).
    - Maximize "on-site" feeling.
- **Premium Wallet UI**:
    - Styles: Glassmorphism, Toss-like accuracy, Karrot-like intuition.
    - Micro-animations for data changes.

### 2. Data & AI Engine
- **Sentinel-X Crawling**:
    - Auto-crawl Naver Cafe 'Megacity', official sites.
    - Update prices, units, images every 10 mins.
- **4 Core Sites Mapping**:
    - Uncheon Jugong Doosan We've The Zenith Cheongju Central
    - Gagyeong Honggol Hanyang Sujain Arbore
    - Hyundai Techno Raywon City
    - Jangseong District Jeil Punggyeongchae
- **AI Marketing Hub**:
    - Generate blog/SNS copy in 3s based on real data.

### 3. Infrastructure
- **Cloudflare D1 & Resend**:
    - Logs, DB, Email auth.
- **Auth**:
    - User types: General (Promo focus) vs Realtor (Mgmt focus).

### 4. Locality & Legal
- **Perfect Korean Patch**:
    - Professional Real Estate terminology.
    - `[KO | EN | CN]` toggle (Top Right).
- **Legal Disclaimer**:
    - Explicit non-liability, data usage, patent rights.

## Implementation Steps
1.  **Setup**: Install 3D libs (`three`, `r3f`, `spline`).
2.  **Migration**: Move existing "Safe-Link" app to `/safety` route to free up Root.
3.  **Hero Section**: Implement 3D Interactive Hero.
4.  **UI Components**: Build Glassmorphism cards/Wallet UI.
