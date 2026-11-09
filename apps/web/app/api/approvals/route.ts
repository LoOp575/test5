import { NextResponse } from 'next/server';
import { APPROVALS } from '@/lib/mockData';
export async function GET() {
  return NextResponse.json({ data: APPROVALS, source: 'mock' });
}
