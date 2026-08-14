import { NextResponse } from 'next/server';
import { isTreatmentStoreConfigured, listTreatments, upsertTreatment } from '../../../lib/treatment-store';
import type { TreatmentRegistryItem } from '../../../lib/treatment-registry';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const treatments = await listTreatments({ publishedOnly: searchParams.get('published') === '1' });
    return NextResponse.json({ treatments, persistence: isTreatmentStoreConfigured ? 'supabase' : 'static-fallback' });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load treatments.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TreatmentRegistryItem;
    if (!body.id || !body.label || !body.category) return NextResponse.json({ error: 'id, label and category are required.' }, { status: 400 });
    const saved = await upsertTreatment(body);
    return NextResponse.json({ treatment: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to save treatment.' }, { status: 500 });
  }
}
