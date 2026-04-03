import { NextResponse } from 'next/server';
import db, { initDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    initDb(); // Ensure tables exist

    const { email, role, name } = await request.json();

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    // Check if user exists
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

    if (user && user.role !== role) {
      return NextResponse.json({ 
        error: `This user is already registered as ${user.role.toUpperCase()}. You must select the correct role to continue.` 
      }, { status: 400 });
    }

    if (!user) {
      // Register new user
      const info = db.prepare(`
        INSERT INTO users (name, email, role, status)
        VALUES (?, ?, ?, 'active')
      `).run(name || email.split('@')[0], email, role);
      
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
    }

    // In a real app we'd set a cookie here. For this mock, we return the user.
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
