import { NextResponse } from 'next/server';
import db, { initDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    await initDb();

    const { email, role, name } = await request.json();

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = userRes.rows[0];

    if (user && user.role !== role) {
      return NextResponse.json({ 
        error: `This user is already registered as ${user.role.toUpperCase()}. You must select the correct role to continue.` 
      }, { status: 400 });
    }

    if (!user) {
      const result = await db.query(`
        INSERT INTO users (name, email, role, status)
        VALUES ($1, $2, $3, 'active')
        RETURNING id
      `, [name || email.split('@')[0], email, role]);
      
      const newUserRes = await db.query('SELECT * FROM users WHERE id = $1', [result.rows[0].id]);
      user = newUserRes.rows[0];
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
