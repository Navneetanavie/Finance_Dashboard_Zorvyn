import Database from 'better-sqlite3';
import path from 'path';

// Define the database file path
const DB_PATH = path.resolve(process.cwd(), 'finance.db');

const db = new Database(DB_PATH, { verbose: console.log });

// Initialize the database tables
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('viewer', 'analyst', 'admin')),
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive'))
    );

    CREATE TABLE IF NOT EXISTS financial_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      userId INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id)
    );
  `);

  // Seed initial data if tables are empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    const insertUser = db.prepare('INSERT INTO users (name, email, role, status) VALUES (?, ?, ?, ?)');
    insertUser.run('Admin User', 'admin@example.com', 'admin', 'active');
    insertUser.run('Analyst User', 'analyst@example.com', 'analyst', 'active');
    insertUser.run('Viewer User', 'viewer@example.com', 'viewer', 'active');

    const insertRecord = db.prepare('INSERT INTO financial_records (amount, type, category, date, notes, userId) VALUES (?, ?, ?, ?, ?, ?)');
    const now = new Date().toISOString().split('T')[0];
    insertRecord.run(5000, 'income', 'Salary', now, 'Monthly salary', 1);
    insertRecord.run(1200, 'expense', 'Rent', now, 'Apartment rent', 1);
    insertRecord.run(450, 'expense', 'Groceries', now, 'Weekly groceries', 2);
    insertRecord.run(200, 'expense', 'Transport', now, 'Bus pass', 3);
    insertRecord.run(1500, 'income', 'Freelancing', now, 'Web design project', 2);
  }
}

export default db;
