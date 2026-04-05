import { Pool } from 'pg';

const db = new Pool({
  connectionString: process.env.DATABASE_URI || "postgresql://postgres.rspfjtbiiuwvemtvwnvu:Finanace%401234@aws-1-ap-south-1.pooler.supabase.com:5432/postgres",
});

export async function initDb() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('viewer', 'analyst', 'admin')),
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive'))
    );

    CREATE TABLE IF NOT EXISTS financial_records (
      id SERIAL PRIMARY KEY,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      "userId" INTEGER,
      FOREIGN KEY ("userId") REFERENCES users(id)
    );
  `);

  const userCountRes = await db.query('SELECT COUNT(*) as count FROM users');
  const count = parseInt(userCountRes.rows[0].count, 10);
  
  if (count === 0) {
    const insertUser = 'INSERT INTO users (name, email, role, status) VALUES ($1, $2, $3, $4)';
    await db.query(insertUser, ['Admin User', 'admin@example.com', 'admin', 'active']);
    await db.query(insertUser, ['Analyst User', 'analyst@example.com', 'analyst', 'active']);
    await db.query(insertUser, ['Viewer User', 'viewer@example.com', 'viewer', 'active']);

    const insertRecord = 'INSERT INTO financial_records (amount, type, category, date, notes, "userId") VALUES ($1, $2, $3, $4, $5, $6)';
    const now = new Date().toISOString().split('T')[0];
    await db.query(insertRecord, [5000, 'income', 'Salary', now, 'Monthly salary', 1]);
    await db.query(insertRecord, [1200, 'expense', 'Rent', now, 'Apartment rent', 1]);
    await db.query(insertRecord, [450, 'expense', 'Groceries', now, 'Weekly groceries', 2]);
    await db.query(insertRecord, [200, 'expense', 'Transport', now, 'Bus pass', 3]);
    await db.query(insertRecord, [1500, 'income', 'Freelancing', now, 'Web design project', 2]);
  }
}

export default db;
