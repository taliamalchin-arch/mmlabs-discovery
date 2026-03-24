import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const password = request.headers.get('x-recovery-password');
  if (!password || password !== process.env.RECOVERY_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formspreeKey = process.env.FORMSPREE_API_KEY;
  if (!formspreeKey) {
    return NextResponse.json({ error: 'FORMSPREE_API_KEY not configured' }, { status: 404 });
  }

  // Extract form ID from the endpoint URL
  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || '';
  const formId = endpoint.split('/').pop();
  if (!formId) {
    return NextResponse.json({ error: 'Could not determine Formspree form ID' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://formspree.io/api/0/forms/${formId}/submissions`, {
      headers: { Authorization: `Bearer ${formspreeKey}` },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Formspree API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: 'Formspree fetch failed', details: err instanceof Error ? err.message : 'Unknown' },
      { status: 500 }
    );
  }
}
