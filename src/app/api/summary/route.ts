import { NextResponse } from 'next/server';
import db, { initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();

    const recordsRes = await db.query('SELECT * FROM financial_records');
    const records = recordsRes.rows;

    const totalIncome = records
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + Number(r.amount), 0);

    const totalExpenses = records
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + Number(r.amount), 0);

    const netBalance = totalIncome - totalExpenses;

    const categorySummaryRes = await db.query(`
      SELECT category, SUM(amount) as total 
      FROM financial_records 
      WHERE type = 'expense' 
      GROUP BY category
    `);

    const recentActivityRes = await db.query(`
      SELECT * FROM financial_records 
      ORDER BY date DESC, id DESC LIMIT 5
    `);

    const monthlyTrendsRes = await db.query(`
      SELECT 
        to_char(date::date, 'YYYY-MM') as month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
      FROM financial_records
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `);
    const monthlyTrends = monthlyTrendsRes.rows.reverse();

    const weeklyTrendsRes = await db.query(`
      SELECT 
        to_char(date::date, 'YYYY-MM-DD') as date,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
      FROM financial_records
      WHERE date::date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY date
      ORDER BY date ASC
    `);

    return NextResponse.json({
      summary: {
        totalIncome,
        totalExpenses,
        netBalance,
      },
      categorySummary: categorySummaryRes.rows,
      recentActivity: recentActivityRes.rows,
      monthlyTrends,
      weeklyTrends: weeklyTrendsRes.rows
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
