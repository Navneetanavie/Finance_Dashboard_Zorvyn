import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const users = db.prepare('SELECT id, name, email, role, status FROM users').all();
    return NextResponse.json(users);
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

    db.prepare('UPDATE users SET role = ?, status = ? WHERE id = ?').run(role, status, id);

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

    db.prepare('INSERT INTO users (name, email, role, status) VALUES (?, ?, ?, ?)').run(name, email, role, status);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
