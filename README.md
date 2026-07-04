# Go Business Referral Dashboard

A secure, responsive, and intuitive referral management system built for Go Business. This dashboard allows authenticated partners to track their referrals, analyze earnings, check active service summaries, share referral links and codes, and search, sort, and paginate the referral partner list.

## 🚀 Features

- **Cookie-Based Route Protection**: Secures the dashboard and detail pages via a `jwt_token` cookie. Unauthenticated users are redirected to `/login`, and authenticated users are redirected to `/`.
- **State-of-the-Art Theme**: Premium styling system built with custom CSS variables supporting responsive layouts, elegant interactive hover states, card shadows, and automatic dark/light mode adjustment.
- **Robust Authentication**: Integrates directly with the authentication POST API. Displays clear failure state messages and handles empty or partial fields gracefully.
- **Overview Metrics**: Displays a summary grid of critical stats loaded dynamically from the referrals REST API.
- **Service Summary**: Visualizes active referrals and total earnings statistics per service category.
- **Referral Sharing panel**: Features read-only links and codes with clickable "Copy" buttons.
- **All Referrals Table**: 
  - Real-time backend API integration for search query filtering.
  - Date sort selector (descending/ascending).
  - Client-side pagination (10 rows per page, numbered page actions).
  - Currency and date formatting (USD with no decimals, YYYY/MM/DD dates).
  - Navigable rows redirecting to single partner records.
- **Referral Detail Page**: Fetches single rows by ID and displays complete partner metrics. Includes a fallback layout if a referral is missing.

---

## 🛠️ Technology Stack

- **Framework**: React 19 (via Vite)
- **Routing**: React Router v7
- **Cookie Management**: JS Cookie
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Premium Slate & Indigo system)

---

## 📦 Getting Started

### Prerequisites

- Node.js (version 18.x or above recommended)
- npm (version 9.x or above)

### Installation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the address displayed (usually `http://localhost:5173/`).

### Production Build

To compile a minified production bundle, run:
```bash
npm run build
```
Vite will compile and output build artifacts inside the `dist/` directory.

---

## 🔑 Test Credentials

Use these credentials to sign in and open your referral dashboard:

- **Email**: `admin@example.com`
- **Password**: `admin123`

---

## 📡 API Reference

### 1. Sign In
- **Method**: `POST`
- **Endpoint**: `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin`
- **Payload**:
  ```json
  {
    "email": "admin@example.com",
    "password": "admin123"
  }
  ```

### 2. Referrals Fetch
- **Method**: `GET`
- **Endpoint**: `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals`
- **Headers**:
  - `Authorization: Bearer <jwt_token>`
- **Query Params**:
  - `search` (filters by name or service name)
  - `sort` (accepts `asc` or `desc` for date sorting)
  - `id` (gets detailed record for a specific referral)
