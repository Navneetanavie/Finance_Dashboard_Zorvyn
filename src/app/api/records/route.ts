import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const role = request.headers.get('x-user-role');
  if (role === 'viewer') {
    return NextResponse.json({ error: 'Forbidden: Viewers cannot access full transaction logs' }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const category = searchParams.get('category');

  let query = 'SELECT * FROM financial_records WHERE 1=1';
  const params: any[] = [];
  let paramCount = 1;

  if (type) {
    query += ` AND type = $${paramCount}`;
    params.push(type);
    paramCount++;
  }
  if (category) {
    query += ` AND category LIKE $${paramCount}`;
    params.push(`%${category}%`);
    paramCount++;
  }

  query += ' ORDER BY date DESC';

  try {
    const result = await db.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const role = request.headers.get('x-user-role');
  
  if (role !== 'admin') {
    return NextResponse.json({ error: `Forbidden: ${role}s cannot create records` }, { status: 403 });
  }

  try {
    const { amount, type, category, date, notes, userId } = await request.json();

    if (!amount || !type || !category || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await db.query(`
      INSERT INTO financial_records (amount, type, category, date, notes, "userId")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [Number(amount), type, category, date, notes || '', userId || 1]);

    return NextResponse.json({ id: result.rows[0].id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const role = request.headers.get('x-user-role');
  
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Only Admins can update records' }, { status: 403 });
  }

  try {
    const { id, amount, type, category, date, notes } = await request.json();

    if (!id || !amount || !type || !category || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.query(`
      UPDATE financial_records 
      SET amount = $1, type = $2, category = $3, date = $4, notes = $5
      WHERE id = $6
    `, [Number(amount), type, category, date, notes || '', id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const role = request.headers.get('x-user-role');
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Only Admins can delete records' }, { status: 403 });
  }

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    await db.query('DELETE FROM financial_records WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
