import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const role = request.headers.get('x-user-role') || 'admin';
  const roleData: Record<string, any> = {
    admin: { name: 'Admin User', role: 'admin', email: 'admin@financehub.com', status: 'active' },
    analyst: { name: 'Analyst User', role: 'analyst', email: 'analyst@financehub.com', status: 'active' },
    viewer: { name: 'Viewer User', role: 'viewer', email: 'viewer@financehub.com', status: 'active' },
  };

  return NextResponse.json(roleData[role] || roleData['admin']);
}
