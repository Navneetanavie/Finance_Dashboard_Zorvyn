import { NextResponse } from 'next/server';
import db, { initDb } from '@/lib/db';

export async function GET() {
  try {
    initDb(); // Ensure tables exist

    const records = db.prepare('SELECT * FROM financial_records').all() as any[];

    const totalIncome = records
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);

    const totalExpenses = records
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    const categorySummary = db.prepare(`
      SELECT category, SUM(amount) as total 
      FROM financial_records 
      WHERE type = 'expense' 
      GROUP BY category
    `).all();

    // 5 newest items in descending order of date and time
    const recentActivity = db.prepare(`
      SELECT * FROM financial_records 
      ORDER BY date DESC, id DESC LIMIT 5
    `).all();

    // Monthly Trends (Past 6 months)
    const monthlyTrends = db.prepare(`
      SELECT 
        strftime('%Y-%m', date) as month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
      FROM financial_records
      GROUP BY month
      ORDER BY month DESC, id DESC
      LIMIT 6
    `).all().reverse();

    // Weekly Trends (Last 7 days)
    const weeklyTrends = db.prepare(`
      SELECT 
        date,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
      FROM financial_records
      WHERE date >= date('now', '-7 days')
      GROUP BY date
      ORDER BY date ASC
    `).all();

    return NextResponse.json({
      summary: {
        totalIncome,
        totalExpenses,
        netBalance,
      },
      categorySummary,
      recentActivity,
      monthlyTrends,
      weeklyTrends
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
