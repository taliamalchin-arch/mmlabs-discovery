import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const STATE_KEY = 'mmlabs-discovery-state';

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    console.error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
    return null;
  }
  return new Redis({ url, token });
}

// GET — retrieve saved state
export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ state: null });
  }

  try {
    const state = await redis.get(STATE_KEY);
    return NextResponse.json({ state: state || null });
  } catch (err) {
    console.error('Failed to read state from Redis:', err);
    return NextResponse.json({ state: null });
  }
}

// POST — save state
export async function POST(request: Request) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    await redis.set(STATE_KEY, JSON.stringify(body));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Failed to save state to Redis:', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
