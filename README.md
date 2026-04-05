# Finance Dashboard

A role-based, full-stack financial analytics dashboard engineered for dynamic data visualization and strict access control. 

## Tech Stack 🛠️

- **Frontend Core:** Next.js, React, TypeScript
- **Styling & Icons:** Custom CSS, Framer Motion (Animations), Lucide React (Icons)
- **Data Visualization:** Chart.js & `react-chartjs-2`
- **Backend & API:** Next.js Serverless Route Handlers
- **Database Architecture:** PostgreSQL (Hosted on Supabase) via `pg` (node-postgres pooler)
- **Deployment:** Vercel

## Role-Based Access Control (RBAC) 🔐

This dashboard implements strict role-based access management across different tiers of operation.

### 1. Viewers
- **Dashboard:** Full read-only access to high-level financial summary analytics, pie charts, and monthly/weekly trends.
- **Transactions:** Restricted. Viewers are blocked at the route and API level from viewing granular transaction logs and are safely redirected.
- **User Management:** Restricted. Cannot view or alter system roles.

### 2. Analysts
- **Dashboard:** Full read-only access to analytics.
- **Transactions:** Permitted to query, filter, and view the entire transaction log.
- **Data Mutations:** Restricted. Analysts are blocked from creating (`POST`), editing (`PUT`), or deleting (`DELETE`) any financial records.
- **User Management:** Restricted.

### 3. Admins
- **Dashboard:** Full access.
- **Transactions:** Full administrative rights. Capable of viewing, adding new transactions, updating existing records, and executing deletions.
- **User Management:** Full access to the Management interface to onboard teammates and elevate privilege levels to active/inactive users.

---

> **Note:** Commits were made using my work Git configuration, but this is a personal project built by me.
