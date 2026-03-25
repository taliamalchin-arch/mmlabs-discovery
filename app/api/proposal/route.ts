import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const KEY = 'proposal-signature';

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function GET() {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ signed: false });

  try {
    const data = await redis.get(KEY);
    return NextResponse.json(data || { signed: false });
  } catch {
    return NextResponse.json({ signed: false });
  }
}

export async function POST(request: Request) {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });

  try {
    const body = await request.json();
    const payload = {
      signed: true,
      client_signature: body.client_signature,
      client_date: body.client_date,
      signed_at: body.signed_at,
    };
    await redis.set(KEY, JSON.stringify(payload));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
