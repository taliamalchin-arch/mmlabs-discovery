import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export async function POST(request: Request) {
  const password = request.headers.get('x-recovery-password');
  if (!password || password !== process.env.RECOVERY_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 404 });
  }

  try {
    const redis = new Redis({ url, token });
    const data = await redis.get('mmlabs-discovery-state');
    return NextResponse.json({ found: !!data, data });
  } catch (err) {
    return NextResponse.json(
      { error: 'Redis fetch failed', details: err instanceof Error ? err.message : 'Unknown' },
      { status: 500 }
    );
  }
}
