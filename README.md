# 💼 Portify — Portfolio Tracker & Analytics

Portify is a **Next.js full-stack web app** for tracking your personal investments — including **stocks, ETFs, crypto, and gold** — with **real-time market data**, **interactive analytics**, and **multi-asset benchmarking**.

---

## 🚀 Features

### 📊 Portfolio Overview
- Real-time portfolio value and profit/loss tracking  
- Automatic **current price fetching** via Yahoo Finance API  
- Category breakdowns (Stocks / ETFs / Crypto / Gold)
- DCA / Transaction history with gain-loss % calculation  

### 📈 Analytics Dashboard
- Portfolio vs Benchmarks (**S&P500, NASDAQ, BTC, GOLD**)
- Performance metrics:
  - CAGR (Compound Annual Growth Rate)
  - Sharpe Ratio
  - Max Drawdown
- Projected portfolio growth (5-year simulation)
- Top / Worst performing assets

### 🧩 Other Highlights
- Secure authentication via **NextAuth (Google OAuth)**
- Fully **responsive design**
- **Dark / Light** mode toggle (shadcn/ui)
- Database powered by **Prisma + PostgreSQL (Railway)**
- **Deployed on Vercel**

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 15+, React, TypeScript |
| **Styling** | TailwindCSS, Shadcn/UI |
| **State** | SWR (client-side fetching & caching) |
| **Backend** | Next.js Route Handlers (`/api`) |
| **Database** | Prisma ORM + PostgreSQL |
| **Auth** | NextAuth (JWT + Google Provider) |
| **Market Data** | Yahoo Finance (yahoo-finance2) |
| **Deployment** | Vercel (frontend) + Railway (DB) |

---

## ⚙️ Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/melisandregod/portfolio-tracker-wep-app-class.git
cd portfolio-tracker-wep-app-class
```

### 2️⃣ Install Dependencies
```bash
npm install
```

*(if you hit dependency errors, try `npm install --legacy-peer-deps`)*

### 3️⃣ Environment Variables

Create a `.env` file at the root with the following:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/dbname"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# (Optional) For production on Vercel:
NEXTAUTH_URL="https://your-deployed-url.vercel.app"
```

---

## 🧱 Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

**Preview your schema:**
```bash
npx prisma studio
```

---

## 🧩 Development

```bash
npm run dev
```

Visit:  
👉 `http://localhost:3000`

---

## 🗂️ Project Structure

```
src/
 ├─ app/
 │   ├─ (auth)/login/                # Google OAuth login
 │   ├─ dashboard/
 │   │   ├─ analytics/               # Analytics dashboard page
 │   │   ├─ transactions/            # Transaction logs
 │   │   └─ layout.tsx, page.tsx
 │   ├─ api/
 │   │   ├─ overview/                # Overview APIs
 │   │   ├─ analytics/               # Analytics APIs (metrics + benchmarks)
 │   │   └─ auth/                    # Auth APIs (NextAuth)
 │   └─ layout.tsx, globals.css
 ├─ components/
 │   ├─ analytics/                   # Performance, Metrics, Projection, Tables
 │   ├─ overview/                    # Overview charts
 │   ├─ transactions/                # Transaction tables
 │   └─ ui/                          # Shadcn UI (Card, Button, Chart, Theme)
 ├─ hooks/                           # Custom hooks (usePagination, etc.)
 ├─ lib/                             # Prisma, Auth, Utils
 ├─ types/                           # Type definitions
```

---

## 📈 APIs Overview

### `/api/overview/performance`
> Computes historical portfolio value timeline  
→ Used in **Overview Performance Chart**

### `/api/analytics`
> Returns summary analytics: CAGR, Sharpe Ratio, Drawdown, projection, top/worst assets  
→ Used in **Analytics Dashboard**

### `/api/analytics/benchmarks`
> Compares portfolio performance vs benchmarks  
→ Used in **PerformanceBenchmarks Chart**

---

## 🧠 Key Logic Notes

- **Portfolio timeline** is calculated using user transactions (`BUY` / `SELL`)  
- Each day’s value = Σ( quantity × closing price )
- **Normalization (% growth)** starts from the first day with non-zero portfolio value
- `max` range = from first investment date  
- `day` range = last 2 trading days for meaningful comparison

---

## 🌐 Deployment

### 1️⃣ Vercel (Frontend)
```bash
vercel --prod
```

### 2️⃣ Railway (Database)
- Create a new **PostgreSQL instance**
- Copy its connection URL into `.env` → `DATABASE_URL`

---

## 🧾 License
MIT © 2025 — Portify Project  
Built with ❤️ using **Next.js**, **Prisma**, and **Yahoo Finance API**

---

## 🧠 Credits
Developed by [Your Name]  
**Portfolio Tracker / Analytics for modern investors**
