import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query('SELECT id, name, email, role, status FROM users');
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, role, status } = await request.json();

    if (!id || !role || !status) {
      return NextResponse.json({ error: 'ID, role, and status are required' }, { status: 400 });
    }

    await db.query('UPDATE users SET role = $1, status = $2 WHERE id = $3', [role, status, id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, role, status } = await request.json();

    if (!name || !email || !role || !status) {
      return NextResponse.json({ error: 'Full user details required' }, { status: 400 });
    }

    await db.query('INSERT INTO users (name, email, role, status) VALUES ($1, $2, $3, $4)', [name, email, role, status]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
