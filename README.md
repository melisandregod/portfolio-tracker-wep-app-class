# 💹 Portfolio Tracker (Next.js + Tailwind + Shadcn UI + Prisma + Yahoo Finance)

A **Full-Stack Portfolio Tracker** web app built entirely with **Next.js 15 (App Router)**.  
It uses **Prisma ORM** for database access, **Tailwind + Shadcn UI** for design, and **Yahoo Finance API** for live market data.  
Fully deployable on **Vercel** without any external backend!

---

## 🚀 Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | Next.js 15 (App Router) |
| Styling | Tailwind CSS + Shadcn UI |
| Backend | Next.js API Routes |
| Database ORM | Prisma |
| Database | PlanetScale / Neon / Supabase / Railway |
| Data Source | Yahoo Finance API (`yahoo-finance2`) |
| Deployment | Vercel |

---

## 🧩 Features

- 📊 **Dashboard Overview**
  - Total portfolio value, gain/loss %, cost basis
  - Pie chart for asset allocation (Stocks / ETFs / Crypto / Gold)
- 💹 **Live Market Data (Yahoo Finance)**
  - Fetch stock / ETF / crypto prices in real time
  - Example tickers: AAPL, TSLA, NVDA, BTC-USD, ETH-USD
- 💰 **Transaction Management**
  - Add, edit, delete holdings
  - Calculate average cost, unrealized P/L
- 🔄 **DCA & Rebalancing**
  - Monthly DCA logs
  - Target vs Actual allocation view
- 📈 **Index Comparison**
  - Compare portfolio vs S&P500, NASDAQ100, BTC
- 🌗 **Dark / Light Mode**
  - Toggle between dark and light themes (Shadcn UI)
- 📱 **Responsive Design**
  - Optimized for Desktop, Tablet, and Mobile
- ⚙️ **Full API Integration**
  - Next.js API Routes handle CRUD and Yahoo Finance fetching

---

## 🏗️ Folder Structure

```
src/
├─ app/
│   ├─ (main)/
│   │   ├─ dashboard/
│   │   │   └─ page.tsx
│   │   ├─ layout.tsx
│   │   └─ page.tsx
│   ├─ api/
│   │   ├─ portfolio/
│   │   │   └─ route.ts    # CRUD portfolio routes
│   │   └─ prices/
│   │       └─ route.ts    # Yahoo Finance integration
│   ├─ components/
│   │   ├─ charts/
│   │   ├─ ui/
│   │   └─ layout/
│   ├─ types/
│   │   └─ portfolio.ts
│   └─ styles/
│       └─ globals.css
├─ lib/
│   ├─ prisma.ts
│   └─ yfinance.ts
├─ prisma/
│   └─ schema.prisma
├─ package.json
├─ .env
└─ README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone repository
```bash
git clone https://github.com/your-username/portfolio-tracker-next.git
cd portfolio-tracker-next
```

### 2️⃣ Install dependencies
```bash
npm install
# or
pnpm install
```

### 3️⃣ Set up environment variables
Create `.env` file at the root:

```
DATABASE_URL="mysql://user:password@host:port/dbname"
NEXT_PUBLIC_API_BASE="/api"
```

### 4️⃣ Initialize Prisma
```bash
npx prisma migrate dev --name init
```

### 5️⃣ Run development server
```bash
npm run dev
```
App will be running on [http://localhost:3000](http://localhost:3000)

---

## 🧠 Example API Routes

### GET `/api/prices?ticker=AAPL`
Fetches latest price from Yahoo Finance.

### POST `/api/portfolio`
Add a holding:
```json
{
  "symbol": "AAPL",
  "shares": 10,
  "avg_cost": 150
}
```

### GET `/api/portfolio`
List all holdings with calculated value.

---

## 🧱 Database Schema Example

```prisma
model Holding {
  id        Int      @id @default(autoincrement())
  symbol    String
  name      String?
  category  String   // "Stock" | "Crypto" | "ETF" | "Gold"
  shares    Float
  avg_cost  Float
  createdAt DateTime @default(now())
}
```

---

## 🌐 Deployment on Vercel

1. Push your project to GitHub  
2. Go to [Vercel](https://vercel.com) and import the repository  
3. Set your environment variables (`DATABASE_URL`, etc.) in Vercel Dashboard  
4. Click **Deploy** 🚀

> Prisma + PlanetScale / Supabase work seamlessly on Vercel.

---

## 🧱 Future Enhancements

- 🧑‍💻 Authentication with NextAuth.js
- 📊 Historical performance charts
- 💾 Export to CSV
- 🌍 Thai stock market (SET) support
- 🎨 More UI themes

---

## 🧑‍💻 Author

**Suwinai Aiamsumaung**  
Full-Stack Developer & Portfolio Enthusiast  
📈 Designed for learning, tracking, and optimizing personal investments.

---

### 🏁 License
MIT License © 2025
