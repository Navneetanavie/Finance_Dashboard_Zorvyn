# 💰 Finance Dashboard - Pro Overhaul

A premium, secure, and data-driven Financial Management System built with **Next.js 14**, **SQLite**, and **Framer Motion**. This dashboard provides real-time insights into income, expenses, and net balance with a focus on Role-Based Access Control (RBAC).

## 🚀 Features

- **🔐 Secure Authentication**: Dual-pane login flow with auto-registration.
- **📊 Advanced Analytics**: Monthly and Weekly trend visualization using Chart.js.
- **🛡️ Rigid RBAC**:
  - **Admin**: Full management of records and users.
  - **Analyst**: View-only access to transaction logs and insights.
  - **Viewer**: Restricted to dashboard summary data only.
- **💸 Transaction Management**: Real-time search, category filtering, and newest-first ordering.
- **🧬 Tech Stack**: Next.js (App Router), better-sqlite3, Tailwind CSS, Lucide Icons, and Framer Motion.

## 🛠️ Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

## 📂 Project Structure

- `src/app`: Next.js pages and API routes.
- `src/components`: Reusable UI components (Sidebar, StatCards, etc.).
- `src/lib/db.ts`: SQLite database initialization and connection.
- `src/styles/globals.css`: Premium design system tokens and global styles.

---

*Part of the Finance Dashboard Overhaul Project.*
